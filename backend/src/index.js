const express = require('express');
const cors = require('cors');
const { checkConnection } = require('./config/bd');
const rutasUrls = require('./routes/url');
const rutasUsers = require('./routes/user');
const cookieParser = require('cookie-parser');

require('dotenv').config();


const app = express();

app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
    });

    next();
});

app.use(cors({
    origin: '*', // Reemplaza con el origen de tu frontend
    credentials: true // Permitir el envío de credenciales (cookies, cabeceras de autorización, etc.)
}));
app.use(express.json()); // Usar express.json() en lugar de bodyParser.json()
app.use(cookieParser()); // Usar cookie-parser en la aplicación
app.use('/api/url', rutasUrls);
app.use('/api/user', rutasUsers);


// Llama a la función para verificar la conexión al iniciar el servidor
checkConnection().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Salir si no se puede conectar a la base de datos
});
