const express = require('express');

//controllers
const authController = require('./../controllers/auth.controller');

//middlewares
const validationMiddleware = require('./../middlewares/validations.middleware');
const userMiddleware = require('./../middlewares/user.middleware');
const authMiddleware = require('./../middlewares/auth.middleware');

const upload = require('./../utils/multer');//aqui se importa la configuracion de Multer que se hizo

const router = express.Router();

router.post(
  '/signup',
  //Antes de hacer cualquier cosa en esta ruta, se pone la configuracion de multer, llamando a upload
//como aqui solo es para que el usuario suba una sola foto, la de el, se usa single
//En el 'profileImgUrl' es donde vendra la imagen, se puede usar cualquier nombre
upload.single('profileImgUrl'), //?al utilizar el upload de multer, se activa y me va a permitir tener acceso a la req.file
  validationMiddleware.createUserValidation,
  authController.signUp
);

router.post(
  '/signin',
  validationMiddleware.loginUserValidation,
  authController.signIn
);

router.use(authMiddleware.protect);

router.patch(
  '/password/:id',
  validationMiddleware.updatePasswordValidation,
  userMiddleware.validUser,
  authMiddleware.protectAccountOwner,
  authController.updatePassword
);

module.exports = router;
