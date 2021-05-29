import { Request, Response } from "express";

import { OficiosService } from '../services/oficiosService'

import {logger} from '../utils/logger';
import config from '../config.json';

const oficiosService = new OficiosService();
const mail = require(`${config.utilsFolder}/sendEmail`);
let msgAsunto = "App Contratos, error en contratoController";



export const getOficiosSumilla = async (req : Request, res: Response):Promise<Response> => {
    try {
        console.log("sumilla");
        const resultado= await oficiosService.getOficiosSumilla(parseInt(req.params.anio));
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        mail.enviarMail(error.stack, `${msgAsunto} - [getOficiosSumilla]`);        
        return res.status(501).send({error:error.stack});       
    }
}


