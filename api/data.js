const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Permitir la conexión desde tu sitio
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // La ruta correcta al archivo data.json en Vercel
    const filePath = path.join(process.cwd(), 'api', 'data.json');
    
    // Leer el archivo
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Devolver los datos
    const data = JSON.parse(fileContents);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
