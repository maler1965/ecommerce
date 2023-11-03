const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const generateJWT = require('./../utils/jwt');
const storage = require('../utils/firebase');
const User = require('./../models/user.model');

const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, description } = req.body;

console.table(req.body);
console.log(req.file );

//req.file es el archivo que viene en la solicitud
  if (!req.file) {  //verifica que realmente venga una imagen
    return next(new AppError('Please upload a file', 400));
  }

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);//es l bodega donde se guardara la imagen, y la carpeta donde con un nombre unico de la imagen en esa bodega
  const imgUpload = await uploadBytes(imgRef, req.file.buffer); //aqui recien se esta cargando la imagen en la carpeta de la bodega, en req.file.buffer es por donde viene la imagen para ser enviada a la bodega

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPassword,
    description,
    profileImgUrl: imgUpload.metadata.fullPath,// aqui se guarda en la base de datos, no la imagen, sino la ruta donde esta la imagen en la bodega de firebase, es decir en la nube
  });

  const tokenPromise = generateJWT(user.id);

  const imgRefToDownload = ref(storage, user.profileImgUrl);//en esta variable se guarda la direccion de la imagen y de la bodega
  const urlPromise = getDownloadURL(imgRefToDownload); // en esta variable se guarda la direccion de la imagen que trae la funcion y es una direccion con formato http

  const [token, url] = await Promise.all([tokenPromise, urlPromise]);

  user.profileImgUrl = url;

  res.status(200).json({
    status: 'success',
    message: 'The user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: user.profileImgUrl,
    },
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  //1. traernos la informacion de la req.body
  const { email, password } = req.body;

  //2. buscar el usuario y revisar si existe
  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`User with email: ${email} not found`, 404));
  }
  //3. validar si la contraseña es correcta
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Correo o contraseña incorrecta', 401));
  }

  //4. generar el token
  const tokenPromise = generateJWT(user.id);

  const imgRef = ref(storage, user.profileImgUrl);
  const urlPromise = getDownloadURL(imgRef);

  const [token, url] = await Promise.all([tokenPromise, urlPromise]);

  user.profileImgUrl = url;

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: user.profileImgUrl,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. traerme el usuario que viene de la req, del midleware
  const { user } = req;

  //2. traerme los datos de la req.body
  const { currentPassword, newPassword } = req.body;

  //3. validar si la contraseña actual y nueva son iguales enviar un error
  if (currentPassword === newPassword) {
    return next(new AppError('The password cannot be equals', 400));
  }

  //4. validar si la contraseña actual es igual a la contraseña en bd
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  //5. encriptar la nueva contraseña
  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);

  //6. actualizar el usuario que viene de la req
  await user.update({
    password: encryptedPassword,
    passwordChangedAt: new Date(),
  });

  //7. enviar el mensaje al cliente
  return res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfully',
  });
});
