const multer = require('multer');

const storage = multer.memoryStorage(); //para guardar las imagenes en memoria del servidor no en el disco del servidor
//memoryStorage()  esto viene con la libreria de Multer
const upload = multer({ storage }); //en la variable upload se le pasa el milddeware multer incluyendole la configuracion que se hizo de que se guarde las imagenes en memoria

module.exports = upload;  // luego se exporta en este caso no como objeto, {upload}

//Esta es la configuracion de Multer