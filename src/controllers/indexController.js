const pool = require('../bd/conexion');
const consulta = require('../models/index');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require("validator");


const RegistrarUsuarios = (req,res) =>{
    const {nombre = '',correo = '',password1 = '',password2 = ''} = req.body;
    try{
        if(validator.isAlphanumeric(nombre) && validator.isAlphanumeric(password1) && validator.isAlphanumeric(password2)){

            if(validator.isEmail(correo)){
                
                consulta.ObtenerUsuarioCorreo(pool,{correo},async (err,data) =>{
                    if(!data.rows.length == 0){
                        console.log(data.rows);
                        res.json({
                            status:'UserExist',
                            msg:'El correo ya esta registrado'
                        });
                    }else{
                        if(password1 == password2){
                            let passHash = await bcryptjs.hash(password1,8);
                            consulta.RegistrarUsuario(pool,{nombre,correo,passHash},(err,result)=>{
                                if(!err){
                                    res.json({
                                        status:'Ok',
                                        msg:'Usuario Registrado con exito'
                                    });
                                }else{
                                    console.log('Error al ingresar usuario');
                                }
                            });
                        }else{
                            res.json({
                                status:'PassDist',
                                msg:'Las constraseñas no son iguales'
                            });
                        }
                    }
                })
            }else{
                res.json({
                    status:'EmailInvalid',
                    msg:'Correo Invalido'
                });
            }

        }else{
            res.json({
                status:'Empty',
                msg:'Faltan datos'
            });
        }
    }catch(e){
        throw e;
    }
}
/*
    , {
        expiresIn:'1h'
    }
*/
const IniciarSesion = async (req,res) => {

    const {correo = '',password = ''} = req.body;
    try{

        if(await validator.isEmail(correo)){
            if(await validator.isAlphanumeric(password)){
                console.log('Correo y password validos')
                consulta.IniciarSesion(pool,{correo}, async(err,data)=>{
                
                    if(!err){
                        if(data.rows.length == 0 || !(await bcryptjs.compare(password,data.rows[0].password_usu))){
                            res.json('2');
                        }else{
                            const {id_usu,nombre_usu,rol_usu} = data.rows[0];
                            return new Promise ((resolve,reject) => {
                                const payload = {id_usu,rol_usu};
    
                                jwt.sign(payload,'MySecret1408', (err,token) => {
                                    if(err){
                                        console.log(err);
                                        reject('No se pudo generar el token');
                                    }else{
                                        resolve(res.json({
                                            status:'1',
                                            rol:rol_usu,
                                            token
                                        }));
                                    }
                                })
    
                            })
                        }
                    }else{
                        console.log(err);
                        //res.json('3');
                    }
                })
            }else{
                res.json('4');
            }

        }else{
            res.json('5');
        }

    }catch(e){
        console.log('ERROR CATCH')
        throw e;
    }
    
}

const RegistrarProfesional = (req,res) =>{
    const {nombre,correo,password1,password2} = req.body;

    try{
        if(nombre.length != 0 && correo.length != 0 && password1.length != 0 && password2.length != 0){
            consulta.ObtenerUsuarioCorreo(pool,{correo},async (err,data) =>{
                if(!data.rows.length == 0){
                    console.log(data.rows);
                    res.json('Existe el Profesional');
                }else{
                    if(password1 == password2){
                        let passHash = await bcryptjs.hash(password1,8);
                        consulta.RegistrarProfesional(pool,{nombre,correo,passHash},(err,result)=>{
                            if(!err){
                                res.json('Profesional Ingresado');
                            }else{
                                console.log('Error al ingresar Profesional');
                                res.json('Error al ingresar profesional')
                            }
                        });
                    }else{
                        res.json('Las claves no son iguales');
                    }
                }
            })
        }else{
            res.json('Faltan datos');
        }
    }catch(e){
        throw e;
    }
}



module.exports = {
    RegistrarUsuarios,
    RegistrarProfesional,
    IniciarSesion
}












