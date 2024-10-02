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
  //generar ruta y nombre de archivo
  const ff = new Date();
  let rutaCarpeta = "./adjuntos/" + ff.getFullYear() + "/" + b.tabla_origen + "/";
  //let fechaActual = ff.getFullYear+(ff.getMonth()+1)+ff.getDate()+"-"+ff.getHours()+
  let nombreArchivo = b.id_tabla + "_" + Date.now() + ext;
  //insertar registro
  pool.query("SELECT * FROM sp_adjunto('A1',$1,$2,$3,$4,$5,$6)", [b.id_tabla, b.tabla_origen, b.id_usuario, tipo, nombreArchivo, rutaCarpeta], (err, resSql) => {
    if (err) {
      console.error('Error al insertar el archivo en la base de datos:', err);
      return res.status(500).send('Error interno del servidor.');
    }
    let id_adjunto = resSql.rows[0].dato[0].id_adjunto;
    //revision de ruta: 
    fs.access(rutaCarpeta, function (error) {
      if (error) { //Directory does not exist
        console.log("no hay ruta " + rutaCarpeta);
        fs.mkdirSync(rutaCarpeta);
      }

      let rutaArchivo = rutaCarpeta + nombreArchivo;
      sampleFile.mv(rutaArchivo, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        // Guarda información sobre el archivo en la base de datos
        try {
          //confirma que el archivo se guardo correctamente
          pool.query("SELECT * FROM sp_adjunto('M1',$1,$2,$3,$4,$5,$6)", [id_adjunto, null, null, null, null, null], (err, result) => {
            if (err) {
              console.error('Error al insertar el archivo en la base de datos:', err);
              return res.status(500).send('Error interno del servidor.');
            }
            return res.status(200).send('Archivo subido correctamente, id_adjunto: '+id_adjunto);
          });
        } catch (error) {
          res.status(500).send(error);
        }
      });
    })
  });
}

function handleFileDownload(req, res) {
  var id = req.body.id_adjunto;
  pool.query("SELECT * FROM sp_adjunto('C2',$1)", [id], (err, resSql) => {
    if (err) {
      return res.status(500).send('Error interno del servidor.');
    }
    let nombre = resSql.rows[0].dato[0].nombre_archivo;
    let ruta = resSql.rows[0].dato[0].ruta;
    const filePath = path.join(ruta, nombre);//'./adjuntos/'
    if (fs.existsSync(filePath)) {
       // Verifica si el archivo es una imagen (opcional, dependiendo de tus necesidades)
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
      const fileExtension = path.extname(nombre).toLowerCase();

      if (imageExtensions.includes(fileExtension)) {
        /*res.download(filePath, nombre, (err) => {
          if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo.');
          }
        });*/
        sharp(filePath)
        .metadata()
        .then(metadata => {
          const maxWidth = 800; // Define el ancho máximo deseado
          const maxHeight = 600; // Define el alto máximo deseado

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
        .then(data => {
          res.set('Content-Type', 'image/' + fileExtension.replace('.', ''));
          res.send(data);
        })
        .catch(err => {
          console.error('Error al procesar la imagen:', err);
          res.status(500).send('Error al procesar la imagen.');
        });
      } else {
        // Si no es una imagen, envía el archivo tal como está
        res.download(filePath, nombre, (err) => {
          if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo.');
          }
        });
      }  
    } else {
      // Si el archivo no existe, envía un mensaje de error
      res.status(404).send('Archivo no encontrado.');
    }
  });
}

function handleFileDownload2(req, res) {
  var id = req.params.id;
  console.log(req.params);
  console.log(id);
  pool.query("SELECT * FROM sp_adjunto('C2',$1)", [id], (err, resSql) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error interno del servidor.');
    }
    let nombre = resSql.rows[0].dato[0].nombre_archivo;
    let ruta = resSql.rows[0].dato[0].ruta;
    const filePath = path.join(ruta, nombre);//'./adjuntos/'
    if (fs.existsSync(filePath)) {
       // Verifica si el archivo es una imagen (opcional, dependiendo de tus necesidades)
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
      const fileExtension = path.extname(nombre).toLowerCase();

      if (imageExtensions.includes(fileExtension)) {
        res.download(filePath, nombre, (err) => {
          if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo.');
          }
        });
        
      } else {
        // Si no es una imagen, envía el archivo tal como está
        res.download(filePath, nombre, (err) => {
          if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo.');
          }
        });
      }  
    } else {
      // Si el archivo no existe, envía un mensaje de error
      res.status(404).send('Archivo no encontrado.');
    }
  });
}

module.exports = {
  uploadMiddleware
  ,handleFileUpload
  ,handleFileDownload
  ,handleFileDownload2
  //uploadFile
  //,insertFileRecord
};