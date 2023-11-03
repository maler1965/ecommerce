const jwt = require('jsonwebtoken');

const generateJWT = (id) => {

  return new Promise((resolve, reject) => {  //new promise sirve para crear una promesa, esta promesa tiene un resolve y una reject
    const payload = { id };  // el payload es donde se pone la informacion que se va a inscriptar

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,  //en la pagina smalldev.tools.com escribir cualquier frase para ser codificada y el hasd que se genera es lo que se pega en el archivo env 
      {
        expiresIn: process.env.JWT_EXPIRE_IN, //es el tiempo de expiracion del token, aqui 2 horas
      },
      (err, token) => {
        if (err) {
          reject(err);
        }

        resolve(token);
      }
    );

  });
  
};

module.exports = generateJWT;
