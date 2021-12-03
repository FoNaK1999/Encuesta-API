const pool = require('../bd/conexion');
const consulta = require('../models/AdminPro');
const nodemailer = require('nodemailer');
const validator = require("validator");

//Config del objeto de transporte
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'sysencuesta@gmail.com',
        pass:'gokias14'
    }
})

const ObtenerProfesionales = (req,res) => {
    try{
        consulta.ObtenerAllProfesionales(pool,(err,result) => {
            if(!result.rows.length == 0){
                res.json(result.rows);
            }else{
                res.json({
                    status:'2',
                    msg:'Error al cargar profesionales'
                });
            }
        })

    }catch(e){
        throw e;
    }
}

const ObtenerProfesionalUnico = (req,res) => {

    const {id} = req.body;
    try{
        if(id.length != 0){
            consulta.ObtenerProfesionalID(pool,{id},(err,result) => {
                if(!result.rows.length == 0){
                    res.json(result.rows);
                }else{
                    res.json({
                        status:'Error Query',
                        msg:'Error al cargar datos del profesional'
                    })
                }
            });
        }else{

        }
    }catch(e){
        throw e;
    }
}

const ActualizarProfesional = (req,res) => {

    const {nombre = '',correo = '',id = ''} = req.body;

    try{
        //Validar campos
        if(validator.isAlphanumeric(nombre) && validator.isAlphanumeric(id)){
            //Validar correo
            if(validator.isEmail(correo)){
                consulta.ObtenerProfesionalID(pool,{id},(err2,result1)=>{
                    if(!err2){
                        if(correo == result1.rows[0].correo_usu){
                            console.log('CORREO PERTENECE AL PROFESIONAL');

                                //Actualizar Profesional
                                consulta.ActualizarProfesional(pool,{nombre,correo,id},(err,result) => {
                                        if(!err){
                                            res.json({
                                                status:'Ok',
                                            msg:'Actualizado'
                                        })
                                        }else{
                                        res.json({
                                            status:'Error Query',
                                            msg:'Error en la insercion'
                                        })  
                                    }
                                })
                                //Fin Actualizar Profesional
                        }else{
                            console.log('CORREO NO PERTENECE AL PROFESIONAL');

                            //Validar si existe el correo
                            consulta.ObtenerProfesionalEmail(pool,{correo},(err1,result) => {
                                if(!err1){
                            
                                    if(result.rows.length == 0){
                                        //Actualizar Profesional
                                        consulta.ActualizarProfesional(pool,{nombre,correo,id},(err,result) => {
                                            if(!err){
                                                res.json({
                                                    status:'Ok',
                                                    msg:'Actualizado'
                                                })
                                            }else{
                                                res.json({
                                                    status:'Error Query',
                                                    msg:'Error en la insercion'
                                                })  
                                            }
                                        })
                                        //Fin Actualizar Profesional
                            
                                    }else{
                                        res.json({
                                            status:'EmailExists',
                                                msg:'El correo ya se encuentra registrado'
                                            })
                                        }
                            
                                    }else{
                                        res.json({
                                            status:'Error Query',
                                            msg:'Error en la insercion'
                                        }) 
                                    }
                            })
                            //Fin validacion existencia del correo
                        }
                    }else{

                    }
                })


            }else{
                res.json({
                    status:'EmailInvalid',
                    msg:'Correo invalido'
                }) 
            }

        }else{
            res.json({
                status:'Empty',
                msg:'Faltan Datos'
            })
        }
    }catch(e){
        throw e;
    }

}

const InvitarProfesional = (req,res) => {
    const {correo} = req.body;

    try{
        if(correo.length != 0){
            let mensaje = 'Se le invita a participar en el sistema de encuestas ingresando al siguiente link : http://localhost:8080/Profesional/RegPro';
            var mailOptions = {
                from: 'sysencuesta@gmail.com',
                to: correo,
                subject: 'Invitación al sistema de encuestas',
                text: mensaje
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                  res.json({
                      status:'Error',
                      msg:error
                  })
                } else {
                  console.log('Email enviado: ' + info.response);
                  res.json({
                      status:'Ok',
                      msg:'Correo Enviado'
                  })
                }
            });    
        }else{
            res.json({
                status:'Empty',
                msg:'Falta el correo'
            })
        }
    }catch(e){
        throw e;
    }

}

const EliminarProfesional = (req,res) => {
    
    const {id} = req.body;
    const estado = 2;
    try{
        if(id.length != 0){
            consulta.CambiarEstadoProfesional(pool,{estado,id},(err,result) => {
                if(!err){
                    res.json({
                        status:'Ok',
                        msg:'Profesional Eliminado'
                    })
                }else{

                    res.json({
                        status:'Error',
                        msg:'Ha ocurrido un error al cambiar estado del profesional'
                    })

                }
            });
        }else{

            res.json({
                status:'Empty',
                msg:'Faltan Datos'
            })

        }

    }catch(e){
        throw e;
    }
}

const ActivarProfesional = (req,res) => {

    const {id} = req.body;
    const estado = 1;
    try{
        if(id.length != 0){
            consulta.CambiarEstadoProfesional(pool,{estado,id},(err,result) => {
                if(!err){
                    res.json({
                        status:'Ok',
                        msg:'Profesional Eliminado'
                    })
                }else{

                    res.json({
                        status:'Error',
                        msg:'Ha ocurrido un error al cambiar estado del profesional'
                    })

                }
            });
        }else{

            res.json({
                status:'Empty',
                msg:'Faltan Datos'
            })

        }

    }catch(e){
        throw e;
    }
}


module.exports = {
    ObtenerProfesionales,
    ObtenerProfesionalUnico,
    ActualizarProfesional,
    EliminarProfesional,
    ActivarProfesional,
    InvitarProfesional
}




