const path = require('path');
const { Pool } = require('pg');
const fileUpload = require('express-fileupload');
const fs = require("fs");
const sharp = require('sharp');
const XLSX = require('xlsx');
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
  else {
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
  let rutaCompleta = rutaCarpeta + nombreArchivo;
  console.log("rutas", rutaCarpeta, nombreArchivo, rutaCompleta);
  fs.access(rutaCarpeta, function (error) { //revisa si existe la carpeta de guardado del archivo 
    if (error) {
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
      let query1 = `UPDATE ${nombreTabla} SET ${campoTabla} = '` + rutaCompleta + `' WHERE ${idTabla} = ` + b.id_registro;
      console.log(query1);

      // Ejecuta la consulta con parámetros para los valores
      pool.query(query1, (err, resQ) => { //insertar registro
        if (err) {
          console.error('Error al insertar el archivo en la base de datos:', err);
          return res.status(500).json({
            success: false,
            message: 'Error interno del servidor.',
          });
        }
        else {
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
  //console.log(query,b.id_registro);
  try {//manejo de try   catch para errores 
    // Consulta para obtener la ruta y el nombre del archivo
    pool.query(query, [b.id_registro], (err, resSql) => {
      if (err) {
        console.error('Error al consultar la base de datos:', err);
        return res.status(500).send('Error interno del servidor.');
      }
      console.log(resSql);
      // Verifica si se encontró el archivo en la base de datos
      if (resSql.rows.length === 0) {
        return res.status(404).send('Archivo no encontrado en la base de datos.');
      }
      if (resSql.rows[0].ruta == null) {
        return res.status(404).send('Archivo no encontrado en la base de datos.');
      }

      const { idTabla: id_tabla, ruta } = resSql.rows[0];
      const filePath = ruta;
      console.log(filePath);

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
          nombre = b.nombre_tabla + "_" + b.id_registro;
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

  } catch (error) {
    console.error('Error al descargar el archivo:', error);
    res.status(500).send('Error al descargar el archivo.');
  }
}


async function exportarDatos(req, res) {

  id_pb = req.body.id_proy_beneficiario;
  //validar el dato id_pb
  if (id_pb == null || id_pb == 0) {
    return res.status(400).send('El id_proy_beneficiario es obligatorio.');
  }

  pool.query("SELECT * FROM public.sp_proy_bene_lista($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
    [
      '0',              // p_ip
      'C4',         // p_accion
      0,                // p_id_proy_bene_lista
      id_pb,              // p_id_proy_beneficiario
      '0',              // p_comunidad_no_registrada
      '0',              // p_num_doc_identidad
      '0',              // p_nombre
      0,                // p_idp_rango_edad
      null,             // p_es_hombre
      0,                // p_idp_organizacion_tipo
      0,                // p_idp_organizacion_subtipo
      0,                // p_id_ubica_geo_depto
      0                 // p_id_ubica_geo_comu
    ],
    async (err, resSql1) => {
      console.log(resSql1);

      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Resultados:', resSql1.rows);
        // Crear libro de trabajo y hoja de trabajo
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(resSql1.rows[0].dato);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

        // Escribir en un buffer
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        // Configurar encabezados para descarga
        res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Enviar el archivo al cliente
        res.send(buffer);
      }
    });
}

async function importarDatos(req, res) {
  //console.log("importarDatos");

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('Archivo no encontrado.');
  }

  const file = req.files.file;
  const uploadPath = './adjuntos/importar_beneficiario_temp.xlsx';

  file.mv(uploadPath, (err) => {
    if (err) {
      console.error('Error al mover el archivo', err);
      return res.status(500).send('Error al mover el archivo');
    }
    try {
        const workbook = XLSX.readFile(uploadPath);
        // Obtener los nombres de las hojas
        const sheetNames = workbook.SheetNames;
        id_proy_beneficiario = req.body.id_proy_beneficiario;
        // Verificar cuántas hojas hay
        console.log(`El archivo tiene ${sheetNames.length} hojas.`);
        if(workbook.SheetNames.length > 1){
            res.status(200).json({ res: "ERROR", message: "Existe mas de una hoja de trabajo, por favor revise su documento." });
        }
        const sheetName = workbook.SheetNames[0]; //Lee la primera hoja del Excel
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        const sheetDataCabecera = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const cabeceraActual = sheetDataCabecera[0];
        const cabeceraEsperada = ['ci', 'nombre', 'genero', 'tipo_actor', 'institucion',
        'departamento', 'municipio', 'comunidad', 'comunidad_no_registrada', 'rango_edad'];

        // Validar que todas las cabeceras esperadas existan en la cabecera actual
        const setCabeceraActual = new Set(cabeceraActual); // Convertir a conjunto
        const setCabeceraEsperada = new Set(cabeceraEsperada); // Convertir a conjunto
    
        const faltantes = [...setCabeceraEsperada].filter(cabecera => !setCabeceraActual.has(cabecera));
        const adicionales = [...setCabeceraActual].filter(cabecera => !setCabeceraEsperada.has(cabecera));
    
        if (faltantes.length > 0 || adicionales.length > 0) {
            return res.status(200).json({
                res: "ERROR",
                message: "Las cabeceras no coinciden.",
                cabeceras_faltantes: faltantes,
                cabeceras_adicionales: adicionales
            });
        }
            
        

      validarDatos(sheetData, id_proy_beneficiario).then(async resVal => {
        console.log("validarDatos:", resVal);
        console.log("sheetData:", sheetData);

        // Verificar si hay errores en los datos
        if (resVal.length > 0) {
          res.status(200).json({res:"ERROR",message:resVal});
        }
        else {
          const res_guardado = await guardar(sheetData, id_proy_beneficiario);
          console.log("res_guardado:", res_guardado);
          // Verificar si hay errores en los datos
          if (res_guardado.length > 0) {
            res.status(500).json({ res: "ERROR", message: res_guardado });
          }
          else {
            res.status(200).json({ res: "OK", status: 200, message: "Registros guardados correctamente" });
          }
        }

      }).catch(error => {
        console.error('Error:', error);
      });

    } catch (error) {
      console.error('Error al procesar el archivo Excel', error);
      res.status(500).send('Error al procesar el archivo Excel');
    }
  });
}

// Función para guardar los datos en la base de datos
const guardar = async (sheetData, id_proy_beneficiario) => {
  try {
    console.log("guardar");

    const errores = [];
    for (const [index, row] of sheetData.entries()) {
      const fila = index + 1;
      // Insertar el beneficiario
      const result = await insertar_beneficiario(row, id_proy_beneficiario);
      if (result.error) {
        errores.push(`Fila ${fila}: ${result.error}`);
      }

    }
    console.log("guardar:", errores);
    return errores;
  }
  catch (error) {
    console.error('Error al procesar archivo:', error);
    // Retorna un arreglo con el error
    return [String(error)];
  }
};

// Función para insertar un beneficiario en la base de datos
async function insertar_beneficiario(row, id_proy_beneficiario) {
  try {
    console.log("insertar_beneficiario", row);
    //variable para modificar genero a true o false
    var es_hombre = true;
    if (row.genero == 'M') {
      es_hombre = false;
    }
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM public.sp_proy_bene_lista($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14)",
        [
          '0',              // p_ip
          'A1',         // p_accion
          0,
          id_proy_beneficiario,
          row.ci,
          row.nombre,
          es_hombre,
          row.id_tipo_actor,                // p_idp_organizacion_tipo
          row.id_tipo_institucion,                // p_idp_organizacion_subtipo
          row.id_departamento,                // p_id_ubica_geo_depto
          row.id_municipio,
          row.id_comunidad,                // p_id_ubica_geo_comu
          row.comunidad_no_registrada,
          row.id_rango_edad
        ], (err, result) => {
          if (err) {
            console.error('Error en la consulta:', err);
            return reject({ error: err }); // Rechaza la promesa si hay un error
          }
          resolve({ error: null }); // Resuelve la promesa con los resultados
        });
    });
  } catch (error) {
    console.error('Error:', error);
    return { error: error };
  }
}

const validarDatos = async (sheetData, id_proy_beneficiario) => {
  try {
    const beneficiarios_existentes = await obtener_beneficiarios_existentes(id_proy_beneficiario);
    const actores = await obtener_tipo_actor();
    const tipo_institucion = await obtener_tipo_institucion();
    const departamento = await obtener_tipo_departamento();
    const municipio = await obtener_tipo_municipio();
    const comunidad = await obtener_tipo_comunidad();
    const rango_edad = await obtener_rango_edad();

    const errores = [];
    for (const [index, row] of sheetData.entries()) {
      const fila = index + 1;

      // Validar que el campo "ci" no esté vacío
      if (!row.ci) {
        errores.push(`Fila ${fila}: El campo "ci" es obligatorio.\n`);
      }

      if(beneficiarios_existentes!=null && beneficiarios_existentes.length>0){
        // Validar que el campo "ci" no esté en beneficiarios_existentes
        for (let i = 0; i < beneficiarios_existentes.length; i++) {
          if (beneficiarios_existentes[i].num_doc_identidad == row.ci) {
            errores.push(`Fila ${fila}: El CI "${row.ci}" ya existe.\n`);
          }
        }
      }

      // Validar que el campo "nombre" no esté vacío
      if (!row.nombre) {
        errores.push(`Fila ${index + 1}: El campo "nombre" es obligatorio.\n`);
      }

      const actoresFiltrados = actores.filter(item => item.descripcion_subtipo.trim().toLowerCase() === row.tipo_actor.trim().toLowerCase());
      if (actoresFiltrados.length != 1) {
        errores.push(`Fila ${fila}: El tipo de actor "${row.tipo_actor}" no existe.\n`);
      }
      else{
        row.id_tipo_actor = actoresFiltrados[0].id_subtipo;
      }
      
      if (row.rango_edad) {
          // Validar rango de edad
          const rangoFiltrado = rango_edad.filter(item => item.descripcion_subtipo.trim().toLowerCase() === row.rango_edad.trim().toLowerCase());
          if (rangoFiltrado.length !== 1) {
            errores.push(`Fila ${fila}: El rango de edad "${row.rango_edad}" no existe.\n`);
          } else {
            row.id_rango_edad = rangoFiltrado[0].id_subtipo;
          }
      }
      else {
         errores.push(`Fila ${index + 1}: El campo "rango_edad" es obligatorio.\n`);
      }
      
      if (row.institucion) {
          // Validar tipo de institución
          const institucionFiltrada = tipo_institucion.filter(item => item.descripcion_subtipo.trim().toLowerCase() === row.institucion.trim().toLowerCase());
          if (institucionFiltrada.length !== 1) {
            errores.push(`Fila ${fila}: El tipo de institución "${row.institucion}" no existe.\n`);
          } else {
            row.id_tipo_institucion = institucionFiltrada[0].id_subtipo;
          }
      }
      else {
        row.institucion = null;
      }

      //validar que row.departamento no sea vacio
      if (row.departamento) {
        const deptoFiltrado = departamento.filter(item => item.nombre.trim().toLowerCase() === row.departamento.trim().toLowerCase());
        if (deptoFiltrado.length !== 1) {
          errores.push(`Fila ${fila}: El departamento "${row.departamento}" no existe.\n`);
        } else {
          row.id_departamento = deptoFiltrado[0].id_ubica_geo;
        }
      }
      else {
        row.id_departamento = null;
      }

      // validar que row.municipio no sea vacio
      if (row.municipio) {
        const munFiltrado = municipio.filter(item => item.nombre.trim().toLowerCase() === row.municipio.trim().toLowerCase());
        if (munFiltrado.length !== 1) {
          errores.push(`Fila ${fila}: El municipio "${row.municipio}" no existe.\n`);
        } else {
          row.id_municipio = munFiltrado[0].id_ubica_geo;
        }
      }
      else {
        row.id_municipio = null;
      }

      // validar que row.comunidad no sea vacio
      if (row.comunidad) {
        // Validar comunidad
        const comFiltrada = comunidad.filter(item => item.nombre.trim().toLowerCase() === row.comunidad.trim().toLowerCase());
        if (comFiltrada.length !== 1) {
          errores.push(`Fila ${fila}: La comunidad "${row.comunidad}" no existe.\n`);
        } else {
          row.id_comunidad = comFiltrada[0].id_ubica_geo;
        }
      }
      else {
        row.id_comunidad = null;
      }

      // Validar que el campo "genero" sea  o M o F
      if (row.genero !== 'M' && row.genero !== 'F') {
        errores.push(`Fila ${index + 1}: El campo "genero" debe ser "M" o "F".\n`);
      }
    }
    return errores;
  }
  catch (error) {
    console.error('Error al procesar archivo:', error);
    // Retorna un arreglo con el error
    return [String(error)];

  }
};

async function obtener_beneficiarios_existentes(id_proy_beneficiario) {
  try {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM public.sp_beneficiarios($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)", [
        '0',              // p_ip
        'C5',             // p_accion
        id_proy_beneficiario,                // p_id_proy_bene_lista
        '0',                // p_id_proy_beneficiario
        '0',              // p_comunidad_no_registrada
        '0',              // p_num_doc_identidad
        '0',              // p_nombre
        0,                // p_idp_rango_edad
        null,             // p_es_hombre
        0,                // p_idp_organizacion_tipo
        0,                // p_idp_organizacion_subtipo
        0,                // p_id_ubica_geo_depto
        0,
        0,                // p_idp_organizacion_tipo
        0,                // p_idp_organizacion_subtipo
        0,                // p_id_ubica_geo_depto
        0                 // p_id_ubica_geo_comu
      ], (err, result) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return reject(err); // Rechaza la promesa si hay un error
        }
        resolve(result.rows[0].dato); // Resuelve la promesa con los resultados
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return [error];
  }
}

async function obtener_tipo_actor() {
  try {
    return new Promise((resolve, reject) => {
      pool.query("select id_subtipo,descripcion_subtipo from parametrica where id_tipo = 18;", (err, result) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return reject(err); // Rechaza la promesa si hay un error
        }
        resolve(result.rows); // Resuelve la promesa con los resultados
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function obtener_rango_edad() {
  try {
    return new Promise((resolve, reject) => {
      pool.query("select id_subtipo,descripcion_subtipo from parametrica where id_tipo = 20;", (err, result) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return reject(err); // Rechaza la promesa si hay un error
        }
        resolve(result.rows); // Resuelve la promesa con los resultados
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function obtener_tipo_institucion() {
  try {
    return new Promise((resolve, reject) => {
      pool.query("select id_subtipo,descripcion_subtipo from parametrica where id_tipo = 26;", (err, result) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return reject(err); // Rechaza la promesa si hay un error
        }
        resolve(result.rows); // Resuelve la promesa con los resultados
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
//dep
async function obtener_tipo_departamento() {
  try {
    return new Promise((resolve, reject) => {
      pool.query("select id_ubica_geo,nombre from ubica_geografica where nivel = 2 and rama = 1;", (err, result) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return reject(err); // Rechaza la promesa si hay un error
        }
        resolve(result.rows); // Resuelve la promesa con los resultados
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

//mun
async function obtener_tipo_municipio() {
  try {
    return new Promise((resolve, reject) => {
      pool.query("select id_ubica_geo,nombre from ubica_geografica where nivel = 4 and rama = 1;", (err, result) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return reject(err); // Rechaza la promesa si hay un error
        }
        resolve(result.rows); // Resuelve la promesa con los resultados
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

//comunidad
async function obtener_tipo_comunidad() {
  try {
    return new Promise((resolve, reject) => {
      pool.query("select id_ubica_geo,nombre from ubica_geografica where nivel = 5 and rama = 1;", (err, result) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return reject(err); // Rechaza la promesa si hay un error
        }
        resolve(result.rows); // Resuelve la promesa con los resultados
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

module.exports = {
  uploadMiddleware,
  handleFileUpload,
  handleFileDownload,
  exportarDatos,
  importarDatos
};