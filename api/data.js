import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(request, response) {
  // --- Cabeceras de CORS ---
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // La ruta correcta y más fiable en Vercel
    const jsonFilePath = path.join(process.cwd(), 'api', 'data.json');
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Devolvemos la respuesta
    return response.status(200).json(data);

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'No se pudo leer el archivo de datos.' });
  }
}