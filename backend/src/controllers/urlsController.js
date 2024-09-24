const { supabase } = require('../config/bd');
const { v4: uuidv4 } = require('uuid');

async function createUrl(req, res) {
    const originalUrl  = req.body.url;
    const idUsuario = req.body.idUsuario;
    if (!originalUrl) {
        return res.status(200).json({ error: true, message: "La URL es obligatoria." });
    }

    // Validación de la URL
    if (!/^https?:\/\//i.test(originalUrl)) {
        return res.status(200).send({ error: true, message: 'La URL debe comenzar con "http://" o "https://".' });
    }

    // Generar un identificador único para la URL corta
    const shortId = uuidv4().slice(0, 8);
    const shortUrl = `https://acortador-url-six.vercel.app/api/url/${shortId}`;

    try {
        // Insertar en la base de datos de Supabase
        const { data, error } = await supabase
            .from('urls')
            .insert([{ short_uuid: shortId, original_url: originalUrl, user_id: idUsuario }]);

        if (error) {
            return res.status(200).send({ error: true, message: "Ha ocurrido un error al acortar la URL."});
        }
        res.status(200).send({ error: false, message: "La url se acortó correctamente.", urlAcortada: shortUrl});
    } catch (error) {
        console.error('Error inserting URL into Supabase:', error.message);
        res.status(200).json({ error: true, message: 'Error al guardar la URL en la base de datos.' });
    }
}


async function redirectUrl(req, res) {
    const { shortId } = req.params;

    try {
        // Buscar la URL original en la base de datos
        const { data, error } = await supabase
            .from('urls')
            .select('original_url')
            .eq('short_uuid', shortId)
            .single();  // 'single()' asegura que solo se devuelva un registro

        if (error || !data) {
            return res.status(200).json({ error: true, message: 'URL no encontrada.' });
        }

        // Redirigir a la URL original
        res.redirect(data.original_url);
    } catch (error) {
        console.error('Error fetching URL from Supabase:', error.message);
        res.status(200).json({ error: true, message: 'Error al recuperar la URL.' });
    }
}

async function getUrls(req, res) {
    const idUser = req.params.idUser;
    console.log(idUser);

    if (!idUser) {
        return res.status(200).send({ error: true, message: "No se pueden recuperar los enlaces sin el id del usuario." });
    }
    try {
        // Define la base URL de tu API
        const baseUrl = 'https://acortador-url-six.vercel.app/api/url/';

        // Consulta a Supabase
        const { data, error } = await supabase
            .from('urls')
            .select('original_url, short_uuid')
            .eq('user_id', idUser);

        if (error) {
            console.log(error);
            return res.status(200).send({ error: true, message: "Ha ocurrido un error al recuperar las URLs." });
        }

        if (!data || data.length === 0) {
            return res.status(200).send({ error: false, message: "No se han encontrado URLs." });
        }

        // Construye las URLs completas
        const urls = data.map(item => ({
            original_url: item.original_url,
            short_uuid: `${baseUrl}${item.short_uuid}` // Construye la URL completa
        }));

        return res.status(200).send({ error: false, message: "URLs recuperadas correctamente.", urls: urls });
    } catch (error) {
        console.log(error);
        return res.status(200).send({ error: true, message: "Error al recuperar las URLs." });
    }
}


module.exports = { 
    createUrl, 
    redirectUrl ,
    getUrls
};
