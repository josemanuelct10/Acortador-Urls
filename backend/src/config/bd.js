// config/bd.js
const { createClient } = require('@supabase/supabase-js');

// URL y clave de tu proyecto Supabase
const SUPABASE_URL = 'https://hsxhapqhmnlbzhngmqsb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzeGhhcHFobW5sYnpobmdtcXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ1NDM2MjAsImV4cCI6MjA0MDExOTYyMH0.Rw2P5RfiNKD9Os6K7baErs1iBTTKQGhSQmS4l9FRGzM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkConnection() {
    try {
        // Realiza una consulta simple para verificar la conexión
        const { data, error } = await supabase
            .from('urls') // Usa una tabla existente para hacer la consulta
            .select('*')
            .limit(1); // Limita la consulta a 1 registro para no obtener muchos datos

        if (error) {
            console.error('Error connecting to Supabase:', error.message);
        } else {
            console.log('Successfully connected to Supabase!');
        }
    } catch (error) {
        console.error('Error checking connection:', error.message);
    }
}

module.exports = { supabase, checkConnection };
