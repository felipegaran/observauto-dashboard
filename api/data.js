import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const jsonFilePath = path.join(currentDir, 'data.json');
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    response.status(200).json(data);
  } catch (error) {
    console.error(error);
    response.status(500).json({ 
      error: 'Ocurrió un error al leer el archivo de datos.',
      details: error.message 
    });
  }
}
