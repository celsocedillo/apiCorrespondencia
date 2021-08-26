import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { createConnection } from "typeorm";
import config from "../config.json";

dotenv.config();

export  const verificar = async (req : Request, res: Response, next: NextFunction) =>  {
    let decodeToken:any ;

    console.log('validando token', req.get('authorization'))

    //Validando token
    try {
        const autorizacion = req.get('authorization');
        let token='';
        if (autorizacion && autorizacion.toLowerCase().startsWith('bearer')) {
            token = autorizacion.substring(7);
        }
        decodeToken = await jwt.verify(token, process.env.JWT_SECRET!);
        const xuser =  decodeToken.usuario;
    } catch (error) {
        //console.log('error al validar token', error);
        return res.status(503).send({error:error.stack});       
    }

    //Conectando a la base de datos para realiar operaciones del usuario
    try {   
        const connection = await createConnection({
            type: config.type,
            host: config.host,
            port: config.port,
            username: decodeToken.usuario,
            password: decodeToken.password,
            sid: config.sid,
            //entities: [`${config.entities}`],
            synchronize: false,
            logging: ["info", "error"],
            //logger: new TypeOrmLogger()
        });
    } catch (error) {
        //console.log('error al conectar', error)
        
        return res.status(504).send({error:error.stack});       
    }
    console.log('token OK')
    next();

}