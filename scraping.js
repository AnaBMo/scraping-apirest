/* 
Realizar scraping de información desde la página El País - Últimas Noticias 
---------------------------------------------------------------------------
*/
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const router = express.Router();

const url = 'https://elpais.com/ultimas-noticias/'; 

router.get('/', async (req, res) => {
    try {
        // solicitud a la url que nos da el enunciado
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // array para los objetos de las noticias
        let noticias = [];

        // recorrer elementos de cada noticia
        $('._g._g-md._g-o.b.b-d article').each((index, elemento) => {
            const titulo = $(elemento).find('h2').text().trim();
            const imagen = $(elemento).find('img').attr('src');
            const descripcion = $(elemento).find('p').text().trim();
            const enlace = $(elemento).find('a').attr('href');

            // objeto con los datos de la noticia
            const noticia = {
                titulo: titulo, 
                imagen: imagen,
                descripcion: descripcion, 
                enlace: enlace, 
            };

            // agregar la noticia a la lista
            noticias.push(noticia);
        });

        // una vez tengamos todo guardaremos los datos del array de la siguiente manera:
        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2)); //Same as writeFile(), but synchronous instead of asynchronous

        // enviar la respuesta al navegador
        res.send(noticias);

    } catch (error) {
        console.error('Error al obtener las noticias:', error);
        res.status(500).send('Error al obtener las noticias');
    }
});

router.post('/', async (req, res) => {
    console.log(req)
    res.send('Router en marcha')
});

module.exports = router;