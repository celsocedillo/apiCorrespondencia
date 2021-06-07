import { Request, Response } from "express";

import { OficiosService } from '../services/oficiosService'

import {logger} from '../utils/logger';
import config from '../config.json';

const oficiosService = new OficiosService();
const mail = require(`${config.utilsFolder}/sendEmail`);
let msgAsunto = "App Oficios, error en oficiosController";



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

export const getUltimosOficios = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado= await oficiosService.getUltimosOficios();
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        mail.enviarMail(error.stack, `${msgAsunto} - [getUltimosOficios]`);        
        return res.status(501).send({error:error.stack});       
    }
}

export const getOficio = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado= await oficiosService.getOficio(parseInt(req.params.id));
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        mail.enviarMail(error.stack, `${msgAsunto} - [getOficio]`);        
        return res.status(501).send({error:error.stack});       
    }
}

