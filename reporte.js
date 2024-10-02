// reporte.js
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const {ConsultaInterna} = require('./queries');
// Define fonts
const fonts = {
  Roboto: {
    normal: 'fonts/Roboto/Roboto-Regular.ttf',
    bold: 'fonts/Roboto/Roboto-Medium.ttf',
    italics: 'fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto/Roboto-MediumItalic.ttf'
  }
};

const printer = new PdfPrinter(fonts);

async function expensasResponsable(req,callback) {
  try {
    //console.log("a:",req.body);
    
    const query = "select * from sp_predio_expensas(\'C3\',0,0,"+req.body.id_predio+",\'"+req.body.fecha+"\') AS res;";
    //console.log("C3",query);
    const data = await ConsultaInterna(query);
    //console.log("b:",JSON.stringify(data));
    var array =[]
    if(data!=null && data[0].dato!=null){
      for (const element of data[0].dato) {
        //data[0].dato.forEach(element => {
          //console.log("c:",JSON.stringify(element));
          const query = "select * from sp_predio_expensas(\'C2\', 0, "+element.id_persona+ ","+req.body.id_predio+",\'"+req.body.fecha+"\') AS res;";
          //console.log("C2",query);
          const dataPersona = await ConsultaInterna(query);
          var listaP = dataPersona[0].dato;
          var i = 0;
          listaP.forEach(element => {
            element.nombre=element.nombre==null?"":element.nombre;
            element.nombre=element.nombre==undefined?"":element.nombre;
            //console.log("d:",JSON.stringify(element));
            if(i==0){
              array.push([element.nombre,element.unidad,element.item_cobro,String(element.monto),element.tipo_relacion,element.tipo_m2,String(element.superficie),element.tipo_prorrateo,String(element.factor)])
            }
            else{
              array.push(['',element.unidad,element.item_cobro,String(element.monto),element.tipo_relacion,element.tipo_m2,String(element.superficie),element.tipo_prorrateo,String(element.factor)])
            }        
            i++;
          });
    
          const query1 = "select * from sp_predio_expensas(\'C4\', \'0\', "+element.id_persona+ ","+req.body.id_predio+",\'"+req.body.fecha+"\') AS res;";
          const dataTotal = await ConsultaInterna(query1);
          console.log("C4",query1);
          console.log("e:",JSON.stringify(dataTotal[0]));
          var total = dataTotal[0].dato;
          console.log("e:",JSON.stringify(total));
          array.push([
            { text: 'Total', colSpan: 8, alignment: 'right', bold: true }, {}, {}, {}, {}, {}, {}, {},
            { text: String(total[0].suma_total), alignment: 'right', bold: true }
          ]),
          array.push([{ text: '', colSpan: 9 }, {}, {}, {}, {}, {}, {}, {}, {}])
        };
    }

    //console.log(array);
    
var p_body = [
  [
    { text: 'RESPONSABLE DE PAGO', style: 'tableHeader', alignment: 'center' },
    { text: 'UNIDAD/SERVICIO', style: 'tableHeader', alignment: 'center' },
    { text: 'TIPO DE COBRO', style: 'tableHeader', alignment: 'center' },
    { text: 'MONTO', style: 'tableHeader', alignment: 'right' },
    { text: 'RELACIÓN', style: 'tableHeader', alignment: 'center' },
    { text: 'TIPO (m2)', style: 'tableHeader', alignment: 'center' },
    { text: 'SUPERFICIE (m2)', style: 'tableHeader', alignment: 'center' },
    { text: 'PRORRATEO', style: 'tableHeader', alignment: 'center' },
    { text: 'FACTOR DE COBRO', style: 'tableHeader', alignment: 'center' },
  ]
  /*,
  array[0],
  array[1],
  //['John Doe', 'Unidad 1', 'Propietario', '100', 'Mensual', '100', '0.5', '1.2', '1000'],
  // ['Jane Smith', 'Unidad 2', 'Arrendatario', '75', 'Mensual', '75', '0.3', '1.1', { text: '$800', alignment: 'right' }],
  // Más filas según sea necesario
  [
    { text: 'Total', colSpan: 8, alignment: 'right', bold: true }, {}, {}, {}, {}, {}, {}, {},
    { text: '$1800', bold: true, alignment: 'right' }
  ]*/
]

p_body = p_body.concat(array);

    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 40, 40, 40],
      content: [
        // {
        //   canvas: [
        //     { type: 'rect', x: 20, y: 20, w: 800, h: 552, r: 0, lineColor: 'black' }
        //   ],
        //   absolutePosition: { x: 0, y: 0 }
        // },
        {
          text: 'EXPENSAS POR RESPONSABLE DE PAGO',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            
            body: p_body
          },
          layout: {
            paddingLeft: function(i, node) {
              //return i === 0 ? 10 : 0; // Añadir padding de 10 solo a la primera columna
              return 0;
            },
            paddingRight: function(i, node) {
              //return i === 0 ? 10 : 0; // Añadir padding de 10 solo a la primera columna
              return 5;
            },
            // paddingLeft: function(i, node) { return 0; },
            // paddingRight: function(i, node) { return 0; },
            paddingTop: function(i, node) { return 0; },
            paddingBottom: function(i, node) { return 0; },
            hLineWidth: function(i, node) { return 0; }, // Quita las líneas horizontales
            vLineWidth: function(i, node) { return 0; }, // Quita las líneas verticales
          } 
        }
      ],
      styles: {
        header: {
          fontSize: 14, // Reducido el tamaño del título
          bold: true,
          margin: [0, 10, 0, 10]
        },
        tableExample: {
          margin: [0, 5, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 11, // Reducido el tamaño de los encabezados de la tabla
          color: 'black'
        }
      },
      defaultStyle: {
        fontSize: 10, // Reducido el tamaño de fuente por defecto
        columnGap: 20
      }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];
    pdfDoc.on('data', chunk => chunks.push(chunk));
    pdfDoc.on('end', () => callback(Buffer.concat(chunks)));
    pdfDoc.end();

  } catch (error) {
    console.error('Error creating PDF:', error);
    callback("ERROR", error);
  }
}

module.exports = { expensasResponsable };
