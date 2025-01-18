/* 
Implementar un CRUD para gestionar los datos obtenidos en scraping.js 
------------------------------------------------------------------------------------
*/
const express = require('express');
const app = express();
const fs = require('fs'); // permite trabajar con el sistema de archivos del ordenador
const PORT = 3000;

const routerScraping = require('./scraping');

// Leer datos desde el archivo JSON
function leerDatos() {
    try {
        const data = fs.readFileSync('noticias.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al obtener las noticias:', error);
    }
};

// Guardar datos en el archivo JSON
function guardarDatos(noticias) {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
};

app.use('/scraping', routerScraping); // para usar los datos recogidos en el scraping
app.use(express.json()); // Middleware para manejar datos JSON
app.use(express.urlencoded({ extended: true })); // Middleware para manejar datos de formularios URL-encoded

/* 
 - Crear funciones para obtener todas las noticias, obtener una noticia por índice, 
crear una nueva noticia, actualizar una noticia existente y eliminar una noticia.
------------------------------------------------------------------------------------
*/

// GET '/noticias': Obtiene la lista de todas las noticias.
app.get('/noticias', (req, res) => {
    const noticias = leerDatos();
    res.json(noticias);
});


// GET '/noticias/:indice': Obtiene la noticia por su índice.
// Con req.params accedemos al objeto que devuelve el parametro añadido. 
app.get('/noticias/:indice', (req, res) => {

    const noticias = leerDatos(); 
    const indice = parseInt(req.params.indice);

    if (indice >= 0 && indice < noticias.length) {
        res.json(noticias[indice]);
    } else {
        res.status(404).json({ mensaje: 'La noticia no existe' });
    }
});

// POST '/noticias': Crea una nueva noticia.
app.post('/noticias', (req, res) => {
    
    let noticias = leerDatos();
    const { titulo, imagen, descripcion, enlace } = req.body; // recoge los datos enviados como nueva noticia en el cuerpo de la solicitud

    const noticia = {
        titulo: titulo,
        imagen: imagen,
        descripcion: descripcion,
        enlace: enlace,
      };
  
      noticias.push(noticia);
      guardarDatos(noticias);
      res.json(noticias);
});

// PUT '/noticias/:indice': Actualiza la información de la noticia cuyo índice se indica como argumento.
app.put('/noticias/:id', (req, res) => {

    const id = parseInt(req.params.id);
    let noticias = leerDatos();
    const { titulo, descripcion, enlace, imagen } = req.body;
    leerDatos();

    if (id >= 0 && id < noticias.length) {
      noticias[id] = { titulo, descripcion, enlace, imagen };
      guardarDatos(noticias);
      res.json(noticias[id]);
    } else {
      res.status(404).json({ error: 'Noticia no encontrada' });
    }
  });

// DELETE '/noticias/:indice': Elimina una noticia por índice.
// Método .filter() --> crea nuevo listado que no incluye al usuario borrado.
app.delete('/noticias/:id', (req, res) => {

    const id = parseInt(req.params.id);
    let noticias = leerDatos();

    if (id >= 0 && id < noticias.length) {
      const noticiaEliminada = noticias.splice(id, 1);
      guardarDatos(noticias);
      res.json({ message: 'Noticia eliminada', noticia: noticiaEliminada });
      
    } else {
      res.status(404).json({ error: 'Noticia no encontrada' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}, http://localhost:${PORT}/scraping`);
});