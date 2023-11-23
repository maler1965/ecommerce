require('dotenv').config();
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { promisify } = require('util');

exports.protect = catchAsync(async (req, res, next) => {
  //1. Extract token from header
  let token ; 

  console.log("estoy en servidor protect token 1")
  
  if (
    req.headers.authorization &&  //para verificar que en la req.headers venga algo, o sea que no este vacio/ && significa y...
    req.headers.authorization.startsWith('Bearer') // y.. que lo que viene en req.headers comienza con "Bearer"
  ) {

    //verificar que el front end o en el postman  no se este enviando el token con comillas, eso hara que salga error de token invalido.
    token = req.headers.authorization.split(' ')[1]; //entonces la variable token se cargara con lo que viene en la req.headers, como viene dos palabras, Bearer y las letras del token, split(' ')[1] separa las palabras en el espacio que hay entre ellos y escoge la del indice 1, es decir la segunda. 
  }

  console.log("estoy en servidor token 2")
  
  console.log({ token }) //el token debe tener solo una comilla

  //2. validar si el token existe
  if (!token) {
    return next(
      new AppError('You are not logged in!, Please log in to get access', 401)
    );
  }

  //3. decodificar el token jwt
  const decoded = await promisify(jwt.verify)(  //promisify, es una funcion que convierte una funcion que no es una promesa, en una promesa. por eso ahora si se puede poner await
    token,   //el promisify  necesita el token que se recibio de la req. y la Key que esta en la variable de entorno .env
    process.env.SECRET_JWT_SEED   // con process.env se accede a la variable de entorno .env a la parte que queremos, en este caso a SECRET_JWT_SEED
  );

  //4. buscar el usuario y validar si existe
  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token is not longer available', 401)
    );
  }

  //5. validar el tiempo en el que se cambio la contraseña, para saber si el token
  //generado fue generado despues del cambio de contraseña
  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );

    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError('User recently changed password! please login again.', 401)
      );
    }
  }

  //6. Adjuntar el usuario en session
  req.sessionUser = user;
  console.log({ user})
  next();
});

exports.protectAccountOwner = (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account.', 401));
  }

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};
