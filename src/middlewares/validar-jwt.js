const {response,request} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req = request, res= response, next) => {
    const token = req.header('token');

    if(!token){
        return res.json({
            msg:'No hay token en la peticion'
        });
    }

    try {
        
        jwt.verify(token,'MySecret1408');

        next();
    } catch (error) {
        console.log(error);
        res.json({
            msg:'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}



