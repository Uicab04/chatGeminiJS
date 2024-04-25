const { GenerativeModel } = require('google-generative-ai');

const apiKey = ''; // Reemplaza con tu clave API real

const model = new GenerativeModel(apiKey);

const generation_config = {
  "temperature": 0.9,
  "top_p": 1,
  "top_k": 1,
  "max_output_tokens": 2048,
};

const safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOQUEAR_MEDIO_Y_SUPERIOR" // Cambiado a "BLOQUEAR_MEDIO_Y_SUPERIOR" para español
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOQUEAR_MEDIO_Y_SUPERIOR" // Cambiado a "BLOQUEAR_MEDIO_Y_SUPERIOR" para español
  },
];

let convo = null;

const express = require('express');
const app = express();

app.get('/chat', (req, res) => {
  const userMessage = req.query.message; // Obtiene el mensaje del usuario de la cadena de consulta

  if (!convo) {
    // Inicializa la conversación en la primera petición
    convo = model.start_chat(history=[
      {
        "role": "user",
        "parts": ["Hola"]
      },
      {
        "role": "model",
        "parts": ["Hola, ¿cómo estás?"]
      },
    ]);
  }

  if (userMessage) {
    convo.send_message(userMessage);
  }

  res.send({ message: convo.last.text }); // Envía la respuesta del modelo
});

app.listen(8080, () => console.log('Servidor escuchando en el puerto 3000'));
