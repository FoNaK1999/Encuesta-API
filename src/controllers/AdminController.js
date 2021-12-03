const pool = require('../bd/conexion');
const consulta = require('../models/Admin');
const validator = require("validator");

const ObtenerEncuestas = (req,res) => {
    try{
        consulta.ObtenerAllEncuestas(pool,(err,result) => {
            if(!result.rows.length == 0){
                res.json(result.rows);
            }else{
                res.json({
                    status:'2',
                    msg:'Error al cargar encuestas'
                });
            }
        })

    }catch(e){
        throw e;
    }
}

const ObtenerPacientes = (req,res) => {
    try{
        consulta.ObtenerAllPacientes(pool,(err,result) => {
            if(!result.rows.length == 0){
                res.json(result.rows);
            }else{
                res.json({
                    status:'Error',
                    msg:'Error al cargar pacientes'
                })
            }
        })
    }catch(e){
        throw e;
    }
}

const CrearEncuesta = (req,res) => {
    try{
        const {titulo} = req.body;

        if(titulo){
            consulta.CrearEncuesta(pool,{titulo},(err,result) => {
                if(!err){
                    res.json({
                        status:'ok',
                        msg:'Encuesta Creada'
                    });
                }else{
                    res.json({
                        status:'2',
                        msg:'No se ha podido crear la encuesta'
                    })
                }
            })
        }else{
            res.json({
                status:'3',
                msg:'Falta el titulo'
            });
        }

    }catch(e){
        throw e;
    }
}

const ObtenerPacienteUnico = (req,res) => {
    const {id} = req.body;

    if(id != null || id != 'undefined'){
        consulta.ObtenerPacienteID(pool,{id},(err,result) => {
            if(!result.rows.length == 0){
                res.json(result.rows);
            }else{
                res.json({
                    status:'Error Query',
                    msg:'Error al cargar datos del paciente'
                })
            }
        })
    }else{
        res.json({
            status:'Empty',
            msg:'Faltan Datos'
        });
    }

}

const ActualizarDatosPaciente = (req,res) => {
    const {nombre = '',correo = '',id = ''} = req.body;

    try{
        //Validar campos
        if(validator.isAlphanumeric(nombre) && validator.isAlphanumeric(id)){
            //Validar correo
            if(validator.isEmail(correo)){

                consulta.ObtenerPacienteID(pool,{id},(err2,result1)=>{
                    if(!err2){
                        if(correo == result1.rows[0].correo_usu){
                            console.log('CORREO PERTENECE AL PACIENTE');

                                //Actualizar Profesional
                                consulta.ActualizarPaciente(pool,{nombre,correo,id},(err,result) => {
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
                            console.log('CORREO NO PERTENECE AL PACIENTE');

                            //Validar si existe el correo
                            consulta.ObtenerPacienteCorreo(pool,{correo},(err1,result) => {
                                if(!err1){
                            
                                    if(result.rows.length == 0){
                                        //Actualizar Profesional
                                        consulta.ActualizarPaciente(pool,{nombre,correo,id},(err,result) => {
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

const EliminarPaciente = (req,res)=>{
    const {id} = req.body;
    const estado = 2;
    if(id.length != 0){

        consulta.CambiarEstadoPaciente(pool,{id,estado},(err,result) => {
            if(!err){
                res.json({
                    status:'Ok',
                    msg:'Paciente Eliminado'
                })
            }else{
                res.json({
                    status:'Error Update',
                    msg:'Erro al actualizar paciente'
                })
            }
        });

    }else{
        res.json({
            status:'Empty',
            msg:'Falta id del paciente'
        })
    }

}

const ActivarPaciente = (req,res)=>{
    const {id} = req.body;
    const estado = 1;
    if(id.length != 0){

        consulta.CambiarEstadoPaciente(pool,{id,estado},(err,result) => {
            if(!err){
                res.json({
                    status:'Ok',
                    msg:'Paciente Restablecido'
                })
            }else{
                res.json({
                    status:'Error Update',
                    msg:'Erro al actualizar paciente'
                })
            }
        });

    }else{
        res.json({  
            status:'Empty',
            msg:'Falta id del paciente'
        })
    }

}

const CrearEncuestas = (req,res) => {
    const {titulo,preg} = req.body;
    console.log('TITULO: '+titulo);

    consulta.CrearEncuesta(pool,{titulo},(err,result)=>{
        if(!err){
            const idenc = result.rows[0].id_enc;
            console.log(result.rows[0].id_enc);

            for(let i=0;i<preg.length;i++){
                console.log('CONTADOR de i: ' + i);
                console.log(`Pregunta texto: ${preg[i].text} | Pregunta id: ${preg[i].id}`);

                consulta.CrearPregunta(pool,{encabezado:preg[i].text,idenc},(err,result)=>{
                    const idpreg = result.rows[0].id_preg;
                    if(!err){
                        // INICIO FOR ALTERNATIVAS
                        for(let j=0;j<preg[i].alternativas.length;j++){
                            console.log('CONTADOR de j: ' + j);
                            console.log(`Alternativa text: ${preg[i].alternativas[j].text} | Alternativa id: ${preg[i].alternativas[j].id}`);
                            consulta.CrearAlternativas(pool,{contenido:preg[i].alternativas[j].text,idpreg},(err,result)=>{
                                if(!err){
                                    console.log('ALTERNATIVAS CREADAS');
                                }else{
                                    console.log('ERROR ALTERNATIVAS');
                                }
                            })


                        }
                        //FIN FOR ALTERNATIVAS
                    }else{
                        console.log('ERROR PREGUNTA');
                    }
                })
            }
        }else{
            console.log('Error Titulo');
        }
    })

   
}








module.exports = {
    ObtenerEncuestas,
    ObtenerPacientes,
    ObtenerPacienteUnico,
    ActualizarDatosPaciente,
    EliminarPaciente,
    ActivarPaciente,
    CrearEncuesta,
    CrearEncuestas
}