import { Request, Response } from "express";
import { getRepository,  getManager, In} from 'typeorm';


import config from "../config.json";
import { ConsoleTransportOptions } from "winston/lib/winston/transports";
import moment from "moment";
var oracledb = require("oracledb");

export class OficiosService{
    
    async getOficiosSumilla(panio: number){
        try{
            console.log("base");
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

    async getUltimosOficios(){
        try{
            let query = `select c.id_registro "id", fecha_ingreso "fechaIngreso", id_usuario "usuario", dpto "dpto", tip_doc "tipoDocumento", 
                        c.registro_dpto "registroDpto", tip_oficio "tipoOficio", anio "anio", digitos "digitos",
                        d.id_dpto_origen "idDptoOrigen",d.dpto_origen "dptoOrigen", d.id_usuario_origen "idUsuarioOrigen", d.usuario_origen "usuarioOrigen", 
                        d.id_usuario_destino "idUsuarioDestino", d.usuario_destino "usuarioDestino", d.id_dpto_destino "idDptoDestino", 
                        d.asunto "asunto", 
                        (select count(*) from cr_registros_detalle s 
                        where s.id_registro = c.id_registro and s.id_sec_registro2 is not null and s.id_registro2 is not null) "sumillas"
                        from erco.cr_registros_cabecera c
                        left join erco.cr_registros_detalle d on d.id_registro = c.id_registro 
                        where 
                        fecha_ingreso between (sysdate -15) and sysdate
                        and dpto = 11
                        and d.id_sec_registro2 is null
                        and d.id_registro2 is null
                        order by fecha_ingreso DESC, c.registro_dpto DESC`
            const result = await getManager().query(query);
           return result;
        }catch(err){
            throw new Error(err);
        }
    }

    async getOficio(pid: number){
        try {
            let query = `select c.id_registro "id", fecha_ingreso "fechaIngreso", id_usuario "usuario", dpto "dpto", tip_doc "tipoDocumento", 
                            c.registro_dpto "registroDpto", tip_oficio "tipoOficio", anio "anio", digitos "digitos",
                            d.id_sec_registro "idSecRegistro", d.id_dpto_origen "idDptoOrigen", d.dpto_origen "dptoOrigen",d.id_usuario_origen "idUsuarioOrigen", 
                            d.usuario_origen "usuarioOrigen", d.id_usuario_destino "idUsuarioDestino", d.usuario_destino "usuarioDestino", 
                            d.id_dpto_destino "idDptoDestino", d.asunto "asunto", s.id_sec_registro "sumiIdSecRegistro", s.tipo "sumillado", 
                            s.id_usuario_destino "sumiIdUsuarioDestino", s.usuario_destino "sumiUsuarioDestino", s.dpto_destino "sumiDptoDestino",
                            s.estado_usuarios "sumiEstadoUsuarios", s.registro_dpto "sumiRegistroDpto", s.fecha_envio "fechaSumilla",
                            s.fecha_vencimiento "sumiFechaVencimiento", s.sumilla "sumilla", s.registro_dpto "registroContesta", s.contestacion "contestacion",
                            s.id_dpto_destino "sumiIdDpto", nvl(dep.siglas,'?') "siglas"
                            from erco.cr_registros_cabecera c
                            left join erco.cr_registros_detalle d on d.id_registro = c.id_registro 
                            left outer join cr_registros_detalle s on s.id_registro = c.id_registro and
                            d.id_sec_registro = s.id_sec_registro2
                            join cr_departamentos_n dep on s.id_dpto_destino = dep.id_departamento
                            where 
                            c.id_registro = ${pid}
                            and d.id_sec_registro2 is null
                            and d.id_registro2 is null
                            order by fecha_ingreso DESC, c.registro_dpto DESC`
            const result = await getManager().query(query);     
            //Armando un solo objeto    
            let {sumiIdSecRegistro, sumillado, sumiIdUsuarioDestino, 
                   sumiUsuarioDestino, sumiDptoDestino,sumiEstadoUsuarios, 
                   sumiRegistroDpto,fechaSumilla, sumiFechaVencimiento, 
                   sumilla, registroContesta, contestacion, sumiIdDpto, ...objeto} = result[0];
            //Armando las sumillas como detalle del obejto                   
            let sumillas :any = []
            result.map( (x :any) => {
                if (x.sumiIdSecRegistro) {
                    const {id,fechaIngreso,usuario,dpto,tipoDocumento,registroDpto,tipoOficio,
                           anio, digitos, idSecRegistro, idDptoOrigen, dptoOrigen,idUsuarioOrigen,
                           usuarioOrigen,idUsuarioDestino, usuarioDestino,idDptoDestino,asunto, ...nuevo} = x
                    sumillas.push(nuevo);
                }
            })
            objeto = {...objeto, sumillas};
            return objeto
        } catch (error) {
            throw new Error(error);
        }
    }

    async getOficio2(pid: number){
        try {
            let query = `select c.id_registro "id", fecha_ingreso "fechaIngreso", id_usuario "usuario", dpto "dpto", tip_doc "tipoDocumento", 
                            c.registro_dpto "registroDpto", tip_oficio "tipoOficio", anio "anio", digitos "digitos",
                            d.id_sec_registro "idSecRegistro", d.id_dpto_origen "idDptoOrigen", d.dpto_origen "dptoOrigen",d.id_usuario_origen "idUsuarioOrigen", 
                            d.usuario_origen "usuarioOrigen", d.id_usuario_destino "idUsuarioDestino", d.usuario_destino "usuarioDestino", 
                            d.id_dpto_destino "idDptoDestino", d.asunto "asunto", s.id_sec_registro "sumiIdSecRegistro", s.tipo "sumillado", 
                            s.id_usuario_destino "sumiIdUsuarioDestino", s.usuario_destino "sumiUsuarioDestino", s.dpto_destino "sumiDptoDestino",
                            s.estado_usuarios "sumiEstadoUsuarios", s.registro_dpto "sumiRegistroDpto", s.fecha_envio "fechaSumilla",
                            s.fecha_vencimiento "sumiFechaVencimiento", s.sumilla "sumilla", s.registro_dpto "registroContesta", s.contestacion "contestacion",
                            s.id_dpto_destino "sumiIdDpto"
                            from erco.cr_registros_cabecera c
                            left join erco.cr_registros_detalle d on d.id_registro = c.id_registro 
                            left outer join cr_registros_detalle s on s.id_registro = c.id_registro and
                            d.id_sec_registro = s.id_sec_registro2
                            where 
                            c.id_registro = ${pid}
                            and d.id_sec_registro2 is null
                            and d.id_registro2 is null
                            order by fecha_ingreso DESC, c.registro_dpto DESC`
            const result = await getManager().query(query);
            let { sumiIdSecRegistro, ...objeto  } = result;
            console.log("objeto", objeto);
             return result
        } catch (error) {
            throw new Error(error);
        }
    }


}