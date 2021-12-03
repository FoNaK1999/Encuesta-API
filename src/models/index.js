module.exports = {
    ObtenerUsuarioCorreo:function(conexion,datos,funcion){
        const {correo} = datos;
        conexion.query("SELECT * FROM usuarios WHERE correo_usu = $1",[correo],funcion);
    },
    RegistrarUsuario:function(conexion,datos,funcion){
        const {nombre,correo,passHash} = datos;
        conexion.query('INSERT INTO usuarios (nombre_usu,correo_usu,password_usu,rol_usu,estado_usu) values ($1,$2,$3,3,1)',[nombre,correo,passHash],funcion);
    },
    IniciarSesion:function(conexion,datos,funcion){
        const {correo} = datos;
        conexion.query('SELECT * FROM usuarios WHERE correo_usu = $1',[correo],funcion);
    },
    RegistrarProfesional:function(conexion,datos,funcion){
        const {nombre,correo,passHash} = datos;
        conexion.query('INSERT INTO usuarios (nombre_usu,correo_usu,password_usu,rol_usu,estado_usu) values ($1,$2,$3,2,1)',[nombre,correo,passHash],funcion);
    }
}