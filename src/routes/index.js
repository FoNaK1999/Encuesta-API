const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.post('/',indexController.RegistrarUsuarios);
router.post('/IngresarProfesional',indexController.RegistrarProfesional);
router.post('/login',indexController.IniciarSesion);



module.exports = router;
