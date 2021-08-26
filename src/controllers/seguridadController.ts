import { Request, Response } from "express";
import { SeguridadService } from '../services/seguridadService';
import {logger} from '../utils/logger';
//import config from '../config.json';


const loginService = new SeguridadService();
//const mail = require(`${config.utilsFolder}/sendEmail`);

export const login = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado= await loginService.login(req.params.user, req.params.password);
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        //mail.enviarMail(error.stack, `${msgAsunto} - [getUltimosOficios]`);        
        return res.status(502).send({error:error.stack});       
    }
}