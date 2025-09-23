import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(request, response) {
  // --- Cabeceras de CORS ---
  // Esto es crucial. Permite que tu página en Ionos pueda recibir datos
  // desde el dominio donde vivirá nuestro puente (ej. Vercel).
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Si el método es OPTIONS (una pre-verificación del navegador), solo respondemos OK.
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // 1. Encontrar la ruta al archivo data.json en el servidor.
    // process.cwd() es la raíz del proyecto en el servidor.
    const jsonFilePath = path.join(process.cwd(), 'data.json');

    // 2. Leer el contenido del archivo de forma asíncrona.
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');

    // 3. Convertir el texto del archivo a un objeto JSON.
    const data = JSON.parse(fileContents);

    // 4. Enviar los datos con un status 200 (OK).
    response.status(200).json(data);

  } catch (error) {
    console.error(error);
    // Si algo falla (ej. no se encuentra el archivo), enviamos un error 500.
    response.status(500).json({ 
      error: 'Ocurrió un error al leer el archivo de datos.',
      details: error.message 
    });
  }
}