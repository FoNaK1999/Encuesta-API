module.exports = {
    ObtenerAllEncuestas:function(conexion,funcion){
        conexion.query("SELECT * FROM encuestas",funcion);
    },
    ObtenerAllPacientes:function(conexion,funcion){
        conexion.query('SELECT * FROM usuarios WHERE rol_usu = 3 ORDER BY nombre_usu asc',funcion);
    },
    CrearEncuesta:function(conexion,datos,funcion){
        const {titulo} = datos;
        conexion.query('INSERT INTO encuestas (titulo_enc,estado_enc) values ($1,1) RETURNING id_enc;',[titulo],funcion);
    },
    CrearPregunta:function(conexion,datos,funcion){
        const {encabezado,idenc} = datos;
        conexion.query('INSERT INTO preguntas (encabezado_preg,estado_preg,id_enc_preg) values ($1,1,$2) RETURNING id_preg;',[encabezado,idenc],funcion);
    },
    CrearAlternativas:function(conexion,datos,funcion){
        const {contenido,idpreg} = datos;
        conexion.query('INSERT INTO alternativas (contenido_alt,estado_alt,id_preg_alt) values ($1,1,$2)',[contenido,idpreg],funcion);
    },
    RegistrarPregunta:function(conexion,datos,funcion){
        const {encabezado,idenc} = datos;
        conexion.query('INSERT INTO preguntas (encabezado_preg,estado_preg,id_enc_preg) values ($1,1,$2)',[encabezado,idenc],funcion);
    },
    RegistrarAlternativa:function(conexion,datos,funcion){
        const {contenido,idpreg} = datos;
        conexion.query('INSERT INTO alternativas (contenido_alt,estado_alt,id_preg_alt) values (?,1,?)',[contenido,idpreg],funcion);
    },
    ObtenerPacienteID:function(conexion,datos,funcion){
        const {id} = datos;
        conexion.query('SELECT * FROM usuarios WHERE id_usu = $1',[id],funcion);
    },
    ActualizarPaciente:function(conexion,datos,funcion){
        const {nombre,correo,id} = datos;
        conexion.query('UPDATE usuarios SET nombre_usu = $1, correo_usu = $2 WHERE id_usu = $3',[nombre,correo,id],funcion);
    },
    ObtenerPacienteCorreo:function(conexion,datos,funcion){
        const {correo} = datos;
        conexion.query('SELECT * FROM usuarios WHERE correo_usu = $1',[correo],funcion);
    },
    CambiarEstadoPaciente:function(conexion,datos,funcion){
        const {id,estado} = datos;
        conexion.query('UPDATE usuarios SET estado_usu = $1 WHERE id_usu = $2',[estado,id],funcion);
    }
}