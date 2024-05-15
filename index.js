// Paquetes
const express = require('express');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: true }));

// archivos estáticos 
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz para servir el formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para procesar la imagen
app.post('/subir-imagen', async (req, res) => {
    const imageUrl = req.body.imageUrl;

    try {
        // Obtener la imagen desde la URL
        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer',
        });

        // Cargar la imagen en Jimp
        const image = await Jimp.read(response.data);

        // imagen en escala de grises 
        image
            .resize(350, Jimp.AUTO)
            .greyscale();

        // Generar un nombre de archivo único
        const filename = `${uuidv4().split('-')[0]}.jpeg`;
        const filepath = path.join(__dirname, 'images', filename);

        // Guardar la imagen 
        await image.writeAsync(filepath);

        // Error
        res.sendFile(filepath);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al subir imagen');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor arriba en http://localhost:${port}`);
});
