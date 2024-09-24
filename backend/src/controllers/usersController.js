const { supabase } = require('../config/bd');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;


async function createUser(req, res) {
    // Recuperación del usuario y la password del request
    const { username, password } = req.body;

    // Comprobación de usuario y password
    if (!username || !password) {
        return res.status(200).send({ error: true, message: "El username y la contraseña son obligatorios." });
    }

    try {
        // Hash de la contraseña
        const hash = await bcrypt.hash(password, saltRounds);

        const { data, error } = await supabase
            .from('users')
            .insert([{ username: username, password: hash }]);

        if (error) {
            // Comprobar si el error es por entrada duplicada
            if (error.code === '23505' || error.message.includes('duplicate key value')) {
                return res.status(200).send({ error: true, message: "El username ya existe. Por favor, elige otro." });
            }
            console.log(error);
            return res.status(200).send({ error: true, message: "Error al crear el usuario." });
        }

        return res.status(200).send({ error: false, message: "Usuario creado correctamente." });
    } catch (error) {
        console.log(error);
        // Manejo de errores de bcrypt y de supabase
        return res.status(200).send({ error: true, message: "Error interno del servidor." });
    }
}

async function login(req, res){
    const { username, password} = req.body;

    if (!username || !password) {
        return res.status(200).send({ error: true, message: "El username y la contraseña son obligatorios." });
    }

    try {

        // Recuperamos el username
        const { data, error} = await supabase
            .from('users')
            .select('id, username, password')
            .eq('username', username)
            .single();
        
        if (error || !data){
            return res.status(200).send({ error: true, message: "Usuario no encontrado."});
        }

        const user = data;

        bcrypt.compare(password, user.password, (err, match) => {
            if (err){
                return res.status(200).send({ error: true, message: "Error al comparar las contraseñas."});
            }
            if (!match){
                return res.status(200).send({ error: true, message: "Usuario o contraseña incorrectos."});
            }

            const token = jwt.sign(
                { id: user.id, username: user.username},
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.cookie('access_token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60
            }).send({ message: "Ha iniciado sesion correctamente.", error: false, username: user.username, id: user.id});
        });

    }catch (error){
        return res.status(200).send({ error: true, message: "Error al recuperar el usuario."});
    }
}

async function isAuthenticated(req, res) {
    const token = req.cookies.access_token; // Leer el token de la cookie
    console.log(token);

    if (!token) {
        return res.status(200).send({ error: true, message: "No autenticado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
        console.log(token);
        return res.status(200).send({ error: false, message: "Autenticado", user: decoded });
    } catch (error) {
        return res.status(200).send({ error: true, message: "Token inválido" });
    }
}

function logout(req, res){
    console.log("Cerrando Sesion...");
    res.clearCookie('access_token'); // Elimina la cookie de sesión
    res.status(200).send({error: false, message: "Sesión cerrada correctamente" });
}

module.exports = {
    createUser,
    login,
    isAuthenticated,
    logout
}