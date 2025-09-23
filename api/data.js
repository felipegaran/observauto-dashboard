// Este archivo se ejecutará en el servidor de Vercel, no en el navegador.

// Importamos los datos estáticos temporalmente para simular la respuesta.
// Asegúrate de que la ruta al archivo data.json sea correcta desde la raíz del proyecto.
import data from '../data.json'; 

export default function handler(request, response) {
  // Configuramos las cabeceras para permitir el caching si es necesario en el futuro
  // y para indicar que la respuesta es un JSON.
  response.setHeader('Content-Type', 'application/json');

  // Enviamos el contenido del archivo data.json como respuesta.
  response.status(200).json(data);
}
