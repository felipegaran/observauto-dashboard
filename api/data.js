import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

export default async function handler(request, response) {
  // --- Cabeceras de CORS ---
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // 1. Encontrar la ruta del directorio actual de la función.
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    
    // 2. Construir la ruta al archivo data.json que está en la misma carpeta.
    const jsonFilePath = path.join(currentDir, 'data.json');

    // 3. Leer el contenido del archivo.
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');

    // 4. Convertir el texto a un objeto JSON.
    const data = JSON.parse(fileContents);

    // 5. Enviar los datos.
    response.status(200).json(data);

  } catch (error) {
    console.error(error);
    response.status(500).json({ 
      error: 'Ocurrió un error al leer el archivo de datos.',
      details: error.message 
    });
  }
}