import { Request, Response } from "express";

import { OficiosService } from '../services/oficiosService'

import {logger} from '../utils/logger';
import config from '../config.json';
import moment from "moment";

const oficiosService = new OficiosService();
const mail = require(`${config.utilsFolder}/sendEmail`);
let msgAsunto = "App Oficios, error en oficiosController";



export const getSumillasEnEspera = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado= await oficiosService.getSumillasEnEspera();
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

export const getOficiosByFiltro = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado = await oficiosService.getOficiosByFiltro(parseInt(req.params.anio), parseInt(req.params.registro), req.query )
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        mail.enviarMail(error.stack, `${msgAsunto} - [getOficiosByFiltro]`);        
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

export const getDepartamentos = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado= await oficiosService.getDepartamentos(parseInt(req.params.id));
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        mail.enviarMail(error.stack, `${msgAsunto} - [getOficio]`);        
        return res.status(501).send({error:error.stack});       
    }
}

export const getEstadoUsuarios = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado = await oficiosService.getEstadoUsuarios();
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        mail.enviarMail(error.stack, `${msgAsunto} - [getOficio]`);        
        return res.status(501).send({error:error.stack});               
    }
}

export const insertSumilla = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado = await oficiosService.insertSumilla(req.body);
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        mail.enviarMail(error.stack, `${msgAsunto} - [insertSumilla]`);        
        return res.status(501).send({error:error.stack});               
    }
}

export const deleteSumilla = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado = await oficiosService.deleteSumilla(parseInt(req.params.id));
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        mail.enviarMail(error.stack, `${msgAsunto} - [deleteSumilla]`);        
        return res.status(501).send({error:error.stack});               
    }
}

export const getFiltroUsuarios = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado = await oficiosService.getFiltroUsuarios(req.params.buscar);
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        mail.enviarMail(error.stack, `${msgAsunto} - [getFiltroUsuarios]`);        
        return res.status(501).send({error:error.stack});               
    }
}

export const updateSumilla = async (req : Request, res: Response):Promise<Response> => {
    try {
        const resultado = await oficiosService.updateSumilla(req.body);
        return res.status(201).json({data: resultado});
    } catch (error) {
        logger.error(error.stack);
        mail.enviarMail(error.stack, `${msgAsunto} - [updateSumilla]`);        
        return res.status(501).send({error:error.stack});               
    }
}

