// Importamos los módulos 'path' y 'fs/promises' de Node.js para manejar rutas de archivos y leerlos.
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(request, response) {
  try {
    // 1. Construimos la ruta correcta al archivo data.json.
    // 'process.cwd()' nos da el directorio raíz del proyecto en Vercel.
    const jsonDirectory = path.join(process.cwd());
    
    // 2. Leemos el contenido del archivo de forma asíncrona.
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'data.json'), 'utf8');
    
    // 3. Convertimos el contenido del archivo (que es texto) a un objeto JSON.
    const data = JSON.parse(fileContents);

    // 4. Configuramos las cabeceras para indicar que la respuesta es un JSON
    // y para evitar que el navegador guarde en caché la respuesta, asegurando datos frescos.
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    // 5. Enviamos los datos con un estado 200 (OK).
    response.status(200).json(data);

  } catch (error) {
    // Si ocurre cualquier error durante la lectura o parseo del archivo,
    // lo capturamos, lo mostramos en la consola del servidor de Vercel,
    // y enviamos una respuesta de error 500 clara.
    console.error(error);
    response.status(500).json({ message: 'Error al leer los datos.' });
  }
}
