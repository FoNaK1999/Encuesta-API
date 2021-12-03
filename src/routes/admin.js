const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const AdminProController = require('../controllers/AdminProController');

//Rutas funciones Administrador
//Funciones Encuestas
router.post('/',validateToken,validateAdmin);
router.post('/CargarEncuestas',validateToken,validateAdmin,AdminController.ObtenerEncuestas);
router.post('/CrearEncuesta',validateToken,validateAdmin,AdminController.CrearEncuesta);
//Prueba
router.post('/CrearEncuesta2',validateToken,validateAdmin,AdminController.CrearEncuestas);
//Fin Prueba
//Funciones Pacientes
router.post('/Pacientes',validateToken,validateAdmin,AdminController.ObtenerPacientes);
router.post('/Pacientes/EditarGETPac',validateToken,validateAdmin,AdminController.ObtenerPacienteUnico);
router.post('/Pacientes/EditarPac',validateToken,validateAdmin,AdminController.ActualizarDatosPaciente);
router.post('/Pacientes/EliminarPac',validateToken,validateAdmin,AdminController.EliminarPaciente);
router.post('/Pacientes/ActivarPac',validateToken,validateAdmin,AdminController.ActivarPaciente);
//Funciones Profesionales
router.post('/Profesionales',validateToken,validateAdmin,AdminProController.ObtenerProfesionales);
router.post('/Profesionales/EditarGETPro',validateToken,validateAdmin,AdminProController.ObtenerProfesionalUnico);
router.post('/Profesionales/EditarPro',validateToken,validateAdmin,AdminProController.ActualizarProfesional);
router.post('/Profesionales/InvitarPro',validateToken,validateAdmin,AdminProController.InvitarProfesional);
router.post('/Profesionales/EliminarPro',validateToken,validateAdmin,AdminProController.EliminarProfesional);
router.post('/Profesionales/ActivarPro',validateToken,validateAdmin,AdminProController.ActivarProfesional);


//middleware validar token
function validateToken(req,res,next){
    const {token} = req.body;
    
    if(!token){
        console.log('Acceso denegado');
    }

    const {rol_usu} = jwt.verify(token,'MySecret1408');
    console.log(rol_usu);
    if(!rol_usu){
        console.log('Acceso denegado, token expirado o incorrecto')
    }else{
        console.log('Validacion token correcta');
        req.datos = {rol:rol_usu};
        next();
    }

}

//Middleware Validar Rol Admin
function validateAdmin(req,res,next){
    const {rol} = req.datos;
    console.log("ROL_USUARIO "+rol)

    if(!rol){
        console.log('Se quiere verificar el rol sin validar el token primero');
    }

    if(rol !== 1){
        console.log('El usuario no es administrador-no puede hacer eso');
        return res.json({
            status:'error2',
            msg:'Acceso restringido'
        });
    }
    console.log('Validacion admin correcta')
    next();

}


module.exports = router;
