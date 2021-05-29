import { Request, Response } from "express";
import { getRepository,  getManager, In} from 'typeorm';


import config from "../config.json";
import { ConsoleTransportOptions } from "winston/lib/winston/transports";
import moment from "moment";
var oracledb = require("oracledb");

export class OficiosService{
    
    async getOficiosSumilla(panio: number){
        try{
            let query = `select id_sec_registro "id", tip_oficio "tipoOficio", digitos "digitos", anio "anio", fecha_ingreso "fechaIngreso", 
            cabe_usuario_ingresa "usuarioIngresa", cabe_tipo_documento "tipoDocumento", tipo_registro "tipoRegistro",
            registro_dpto "registroDepartamento", id_usuario_origen "idUsuarioOrigen", usuario_origen "usuarioOrigen",
            dpto_origen "departamentoOrigen", id_usuario_destino "usuarioDestino", usuario_destino "usuarioDestino",
            dpto_destino "departamentoDestino", asunto "asunto", sumillado "sumillado", 
            sumi_id_usuario_destino "sumillaIdUsuarioDestino", sumi_usuario_destino "sumillaUsuarioDestino",
            sumi_dpto_destino "sumillaDepartamentoDestino", sumi_estado_usuarios "sumillaEstado", sumilla "sumilla", siglas "siglas",
            round(sysdate - fecha_sumilla) "diasEspera",
            fecha_sumilla "fechaSumilla"
            from vw_oficio_sumilla
            where sumillado = 'S' and sumi_estado_usuarios = 'S' 
            order by fecha_sumilla ASC`
            const result = await getManager().query(query);
           return result;
        }catch(err){
            throw new Error(err);
        }
    }
}