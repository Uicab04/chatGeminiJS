/*
Instalar primero los modulos:
npm install @google/generative-ai express multer image-size
*/

const bodyParser = require('body-parser')
const multer = require('multer'); // Agrega esta línea para manejar archivos multipart/form-data
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const imageSize = require('image-size');
const clave = ""; // Copiar su clave
const app = express();
const port = 3000;

// Configura multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// recuperamos la clave de un modulo
const genAI = new GoogleGenerativeAI(clave);
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function fileToGenerativePart(binario, mimeType) {
  return {
    inlineData: {
      data: binario,
      mimeType: 'image/'+mimeType
    },
  };
}

function getMimeType(buffer) {
  const type = imageSize(buffer);
  return type ? type.type : null;
}

app.use(express.static(__dirname + '/static'))

// la ruta /consultar  usa multer y acceder a la imagen desde req.file
app.post('/consultar', upload.single('imagen'), async (req, res) => {
  const prompt = req.body.consulta;

  let imageText = "";
  if (req.file) {
    // Accede al contenido de la imagen
    imageText = req.file.buffer.toString('base64'); // Convierte la imagen a base64
    let extension=getMimeType(req.file.buffer)
    if (extension==="jpg") {
      extension="jpeg"
    }
    JSONImagen=fileToGenerativePart(imageText,extension);
    const result = await model.generateContent([prompt, JSONImagen]);
    const response = await result.response;
    const text = response.text();

    const respuestaJson = { mensaje: text };
    res.json(respuestaJson);
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

