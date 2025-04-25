const cors = require('cors');
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
app.use(cors());
app.options('*', cors());

const port = 3005;
const q = require('./queries');
const f = require('./fileservice');
const r = require('./reporte');
app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)



app.get('/', (req, res) => {
  res.send('No tiene permisos para el acceso.');
});

app.post('/version', (req, res) => {
  res.send('0.1.2');
});

 app.post('/consultas', q.Consultas);
 app.post('/sp', q.getSP);
 app.post('/uploadFile', f.uploadMiddleware, f.handleFileUpload);
 app.post('/downloadFile', f.uploadMiddleware, f.handleFileDownload);
 app.post('/exportarDatos', f.exportarDatos);
 app.post('/importarDatos', f.uploadMiddleware, f.importarDatos);
// app.get('/downloadFile/:id', f.uploadMiddleware, f.handleFileDownload2);

app.listen(port, () => console.log('aplicacion en puerto '+ port));
