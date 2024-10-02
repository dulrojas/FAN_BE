const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
})

const Consultas = (request, response) => {
  const { query } = request.body;
  pool.query(query, (error, results) => {
    if (error) {
      var x = error.toString();
      console.log("erno:", x);
      response.status(200).json(x);
      return;
    }
    var dato = { res: "OK", dato: results.rows };
    response.status(200).json(dato)
  })
}

const ConsultaInterna = async (query) => {
  try {
    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error("Error executing query:", error.toString());
    throw error;
  }
}

function generarQuery(req) {
  let q = "";
  if (req.body) {
    if (req.body.procedure_name) {
      let parametrosCadena = "";
      if (req.body.body) {  
        if (req.body.body.params) {
          if (req.body.body.params.length > 0) {
            let c = 0;
            if(req.headers['ip']!=null){
              parametrosCadena = parametrosCadena +'\''+ req.headers['ip']+'\',' 
            }
            
            req.body.body.params.forEach(function (element) {
              c = c + 1;
              if (element.type.toLocaleLowerCase() == 'string') {
                if (element.value !== null) {
                  parametrosCadena = parametrosCadena + ' \'' + element.value + '\'';
                } else {
                  parametrosCadena = parametrosCadena + ' ' + element.value;
                }
              }
              else {
                parametrosCadena = parametrosCadena + ' ' + element.value;
              }

              if (c < req.body.body.params.length) {
                parametrosCadena = parametrosCadena + ',';
              }
            })
          }
        }
      }
      q = "SELECT * FROM " + req.body.procedure_name + "(" + parametrosCadena + ") AS res;";
       console.log(q);
    }
  }
  return q;
}

const getSP = (request, response) => {
  if(request.headers['ip']==null || request.headers['ip']=='' ){
      var msg="ERROR: falta ip, debe incluir este parametro en el header";
      response.status(500).json(msg);
      return;
  }

  console.log(request.headers);
  var query = generarQuery(request);
  console.log(query);
  pool.query(query, (error, results) => {
    if (error) {
      console.log(error);
      var x = "DB query error: "+error.toString();
      console.log("DB query error: ", x);
      response.status(200).json(x);
      return;
    }
    response.status(200).json(results.rows)
  })
}

const upload = (request, response) => {
  var query = generarQuery(request);
  pool.query(query, (error, results) => {
    if (error) {
      console.log(error);
      var x = error.toString();
      console.log("erno:", x);
      response.status(200).json(x);
      return;
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  Consultas,
  ConsultaInterna,
  getSP
}