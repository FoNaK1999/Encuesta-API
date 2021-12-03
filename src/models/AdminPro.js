module.exports = {
    ObtenerAllProfesionales:function(conexion,funcion){
        conexion.query("SELECT * FROM usuarios WHERE rol_usu = 2",funcion);
    },
    ObtenerProfesionalID:function(conexion,datos,funcion){
        const {id} = datos;
        conexion.query("SELECT * FROM usuarios WHERE id_usu = $1",[id],funcion);
    },
    ObtenerProfesionalEmail:function(conexion,datos,funcion){
        const {correo} = datos;
        conexion.query('SELECT * FROM usuarios WHERE correo_usu = $1',[correo],funcion);
    },
    ActualizarProfesional:function(conexion,datos,funcion){
        const {id,nombre,correo} = datos;
        conexion.query("UPDATE usuarios SET nombre_usu = $1 , correo_usu = $2 WHERE id_usu = $3",[nombre,correo,id],funcion);
    },
    CambiarEstadoProfesional:function(conexion,datos,funcion){
        const {estado,id} = datos;
        conexion.query('UPDATE usuarios SET estado_usu = $1 WHERE id_usu = $2',[estado,id],funcion);
    }
}