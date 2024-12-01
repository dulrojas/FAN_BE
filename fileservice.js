const path = require('path');
const { Pool } = require('pg');
const fileUpload = require('express-fileupload');
const fs = require("fs");
const sharp = require('sharp');

const uploadMiddleware = fileUpload();
// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT
})

// Función para manejar la subida de archivos
function handleFileUpload(req, res) {
  var b = req.body;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('Archivo no encontrado.');
  }
  let sampleFile = req.files.file;

  //generar ruta y nombre de archivo
  var tipo = 0; var ext = "";
  if (sampleFile.mimetype == 'application/pdf') {
    tipo = 1; ext = ".pdf";
  }
  else if (sampleFile.mimetype == 'image/png') {
    tipo = 2; ext = ".png";
  }
  else if (sampleFile.mimetype == 'image/jpeg') {
    tipo = 3; ext = ".jpeg";
  }
  else{
    return res.status(400).send('Extension no soportada.');
  }
  //===============
  //primero guardamos el archivo, y si guardo correctamente actualizamos el registro
  //=================

  //generar ruta y nombre de archivo
  const ff = new Date();
  fechaMilisec = ff.getTime();
  let rutaCarpeta = "./adjuntos/" + b.nombre_tabla + "/";
  let nombreArchivo = b.nombre_registro + "_" + fechaMilisec + ext;
  let rutaCompleta = rutaCarpeta+nombreArchivo;
  
  fs.access(rutaCarpeta, function (error) { //revisa si existe la carpeta de guardado del archivo 
    if(error){
      console.log("no existe la ruta de destino. Creando ruta: " + rutaCarpeta);
      fs.mkdirSync(rutaCarpeta);
    }

    let rutaArchivo = rutaCarpeta + nombreArchivo;
    sampleFile.mv(rutaArchivo, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        });
      }

      //si el archivo se guardo correctamente, procedemos a guardar el registro
      let nombreTabla = b.nombre_tabla;
      let campoTabla = b.campo_tabla;
      let idTabla = b.id_en_tabla;
      let query = `UPDATE ${nombreTabla} SET ${campoTabla} = $1 WHERE ${idTabla} = $2`;
      let query1 = `UPDATE ${nombreTabla} SET ${campoTabla} = '`+rutaCompleta+`' WHERE ${idTabla} = `+b.id_registro;
      console.log(query1);
      
      // Ejecuta la consulta con parámetros para los valores
      pool.query(query1,(err, resQ) => { //insertar registro
          if (err) {
            console.error('Error al insertar el archivo en la base de datos:', err);
            return res.status(500).json({
              success: false,
              message: 'Error interno del servidor.',
            });
          }
          else{
            return res.status(200).json({
              success: true,
              message: 'Archivo guardado correctamente.',
            });
          }
        });
    });
  });
}

function handleFileDownload(req, res) {
  var b = req.body;

  let nombreTabla = b.nombre_tabla;
  let campoTabla = b.campo_tabla;
  let idTabla = b.id_en_tabla;

  // Construcción de la consulta SQL
  const query = `
    SELECT ${idTabla}, ${campoTabla} AS ruta
    FROM ${nombreTabla}
    WHERE ${idTabla} = $1
  `;
  console.log(query,b.id_registro);

  // Consulta para obtener la ruta y el nombre del archivo
  pool.query(query, [b.id_registro], (err, resSql) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send('Error interno del servidor.');
    }

    // Verifica si se encontró el archivo en la base de datos
    if (resSql.rows.length === 0) {
      return res.status(404).send('Archivo no encontrado en la base de datos.');
    }

    const { idTabla: id_tabla, ruta } = resSql.rows[0];
    const filePath = ruta;

    // Verifica si el archivo existe en el sistema de archivos
    fs.access(filePath, fs.constants.F_OK, (error) => {
      if (error) {
        console.error('Archivo no encontrado en el sistema de archivos:', filePath);
        return res.status(404).send('Archivo no encontrado.');
      }

      // Verifica si es una imagen para procesarla
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
      const fileExtension = path.extname(filePath).toLowerCase();

      if (imageExtensions.includes(fileExtension)) {
        sharp(filePath)
          .metadata()
          .then((metadata) => {
            const maxWidth = 800;
            const maxHeight = 600;

            let newWidth = metadata.width;
            let newHeight = metadata.height;

            // Calcula las nuevas dimensiones manteniendo la proporción
            if (metadata.width > maxWidth || metadata.height > maxHeight) {
              const widthRatio = maxWidth / metadata.width;
              const heightRatio = maxHeight / metadata.height;
              const minRatio = Math.min(widthRatio, heightRatio);

              newWidth = Math.round(metadata.width * minRatio);
              newHeight = Math.round(metadata.height * minRatio);
            }

            return sharp(filePath).resize(newWidth, newHeight).toBuffer();
          })
          .then((data) => {
            res.set('Content-Type', 'image/' + fileExtension.replace('.', ''));
            res.send(data);
          })
          .catch((err) => {
            console.error('Error al procesar la imagen:', err);
            res.status(500).send('Error al procesar la imagen.');
          });
      } 
      else {
        nombre= b.nombre_tabla+"_"+b.id_registro;
        // Si no es una imagen, envía el archivo directamente
        res.download(filePath, nombre, (err) => {
          if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo.');
          }
        });
      }
    });
  });
}

module.exports = {
  uploadMiddleware,
  handleFileUpload,
  handleFileDownload
};