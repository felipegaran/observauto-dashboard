const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Permitir la conexión desde cualquier sitio (importante para Vercel)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // El navegador a veces envía una solicitud 'OPTIONS' antes de la real.
  // Con esto, le decimos que todo está bien.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Construimos la ruta al archivo data.json que está en la misma carpeta api/
    const filePath = path.join(process.cwd(), 'api', 'data.json');
    
    // Leemos el archivo
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Convertimos el contenido a JSON y lo enviamos de vuelta
    const data = JSON.parse(fileContents);
    res.status(200).json(data);

  } catch (error) {
    // Si algo sale mal, informamos el error.
    console.error('Error al leer el archivo:', error);
    res.status(500).json({ message: 'Error en el servidor al leer el archivo de datos.', error: error.message });
  }
};
