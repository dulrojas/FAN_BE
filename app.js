const cors = require('cors');
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
app.use(cors());
app.options('*', cors());

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// These id's and secrets should come from .env file.
const accountTransport = require("./account_transport.json");
const CLIENT_ID = accountTransport.auth.clientId;
const CLEINT_SECRET = accountTransport.auth.clientSecret;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = accountTransport.auth.refreshToken;

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

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

app.post('/email', (req, res) => {
  // sendEM(0,function(rescb){
  //   console.log(rescb);
  //   res.send(rescb);
  // })
  console.log("email");
  sendMail(res);
});

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
app.get('/downloadFile/:id', f.uploadMiddleware, f.handleFileDownload2);
app.post('/reporte/expensasResponsable', (req, res) => {
  r.expensasResponsable(req,buffer => {
    
    console.log(buffer);
    if(buffer=="ERROR"){
      
      return res.status(500).json("Error al generar pdf");
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
    res.send(buffer);
  });
});

app.listen(port, () => console.log('aplicacion en puerto '+ port));
