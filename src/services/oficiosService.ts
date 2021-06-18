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
                        where s.id_registro = c.id_registro and s.id_sec_registro2 is not null and s.id_registro2 is not null and s.tipo='S') "sumillas",
                        (select count(*) from cr_registros_detalle s 
                        where s.id_registro = c.id_registro and s.id_sec_registro2 is not null and s.id_registro2 is not null and estado_usuarios = 'C') "contestacion"                        
                        from erco.cr_registros_cabecera c
                        left join erco.cr_registros_detalle d on d.id_registro = c.id_registro 
                        where 
                        fecha_ingreso between (sysdate -30) and sysdate
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
                            d.id_dpto_destino "idDptoDestino", d.asunto "asunto", s.id_sec_registro "sumiIdSecRegistro", s.tipo "sumillado", d.observacion "observacion",
                            s.id_usuario_destino "sumiIdUsuarioDestino", s.usuario_destino "sumiUsuarioDestino", s.dpto_destino "sumiDptoDestino",
                            s.estado_usuarios "sumiEstadoUsuarios", s.registro_dpto "sumiRegistroDpto", s.fecha_envio "fechaSumilla", s.fecha_contesta "sumiFechaContesta",
                            s.fecha_vencimiento "sumiFechaVencimiento", s.sumilla "sumilla", s.registro_dpto "registroContesta", s.contestacion "contestacion",
                            s.id_dpto_destino "sumiIdDpto", nvl(dep.siglas,'?') "siglas", round(sysdate - s.fecha_envio) "diasEspera", e.est_descripcion "estadoSumilla",
                            s.tip_oficio2 "oficioContesta", s.anio2 "anioContesta", s.digitos2 "digitosContesta"
                            from erco.cr_registros_cabecera c
                            left join erco.cr_registros_detalle d on d.id_registro = c.id_registro 
                            left outer join cr_registros_detalle s on s.id_registro = c.id_registro and
                            d.id_sec_registro = s.id_sec_registro2 and s.tipo = 'S'
                            left outer join cr_departamentos_n dep on s.id_dpto_destino = dep.id_departamento
                            left outer join cr_estado e on s.estado_usuarios = e.est_codigo
                            where 
                            c.id_registro = ${pid}
                            and d.id_sec_registro2 is null
                            and d.id_registro2 is null
                            order by fecha_ingreso DESC, c.registro_dpto DESC, s.id_sec_registro asc`
            const result = await getManager().query(query);     
            //console.log("resultado", result);
            //Armando un solo objeto    
            let {sumiIdSecRegistro, sumillado, sumiIdUsuarioDestino, 
                   sumiUsuarioDestino, sumiDptoDestino,sumiEstadoUsuarios, 
                   sumiRegistroDpto,fechaSumilla, sumiFechaVencimiento, 
                   sumilla, registroContesta, contestacion, sumiIdDpto, 
                   ...objeto} = result[0];

            //Armando las sumillas como detalle del obejto                   
            let sumillas :any = []
            result.map( (x :any) => {
                if (x.sumiIdSecRegistro) {
                    const {id,fechaIngreso,usuario,dpto,tipoDocumento,registroDpto,tipoOficio,
                           anio, digitos, idSecRegistro, idDptoOrigen, dptoOrigen,idUsuarioOrigen,
                           usuarioOrigen,idUsuarioDestino, usuarioDestino,idDptoDestino,asunto,
                            ...nuevo} = x
                    sumillas.push(nuevo);
                }
            })

            let querygerCon=`select g.tip_oficio2 "gerTipoOficio", g.digitos2 "gerDigitos", g.anio2 "gerAnio", g.contestacion "gerContestacion", 
                             g.fecha_contesta "gerFechaContesta", g.id_sec_registro "gerIdSecRegistro"
                             from cr_registros_detalle g
                             where 
                                 g.id_registro = ${pid}
                             and g.id_sec_registro2 = ${result[0].idSecRegistro} and g.tipo = 'G'                           
                            `
            const gerContesta = await getManager().query(querygerCon);                                 
            //Armando las contesta gerente como detalle del obejto                   
            // let gerContesta :any = []
            // result.map( (x :any) => {
            //     if (x.gerIdSecRegistro) {
            //         const {id,fechaIngreso,usuario,dpto,tipoDocumento,registroDpto,tipoOficio,
            //                anio, digitos, idSecRegistro, idDptoOrigen, dptoOrigen,idUsuarioOrigen,
            //                usuarioOrigen,idUsuarioDestino, usuarioDestino,idDptoDestino,asunto,
            //                anioContesta, diasEspera, digitosContesta, estadoSumilla, observacion,
            //                oficioContesta, siglas, sumiFechaContesta,
            //                sumiIdSecRegistro, sumillado, sumiIdUsuarioDestino, 
            //                sumiUsuarioDestino, sumiDptoDestino,sumiEstadoUsuarios, 
            //                sumiRegistroDpto,fechaSumilla, sumiFechaVencimiento, 
            //                sumilla, registroContesta, contestacion, sumiIdDpto,                            
            //                 ...nuevo} = x
            //         gerContesta.push(nuevo);
            //     }
            // })

            objeto = {...objeto, sumillas, gerContesta};
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
                            s.id_dpto_destino "sumiIdDpto", round(sysdate - s.fecha_sumilla) "diasEspera",
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
            //console.log("objeto", objeto);
             return result
        } catch (error) {
            throw new Error(error);
        }
    }

    async getDepartamentos(pid: number){
        try {
            let query = `select dc.id_departamento "corrIdDepartamento", d.descripcion "departamento", sigla "siglas", d.cargo "cargoId", p.nombre1||' '||p.apellido1 "empleado", p.usuario "usuario"
                            from cr_departamentos_n dc
                            join rhh_direccion d on d.codigo = dc.direccion_id
                            join rhh_personal p on p.cargo = d.cargo and p.estado = 'A'
                            where id_departamento is not null`
            const result = await getManager().query(query);
            return result
        } catch (error) {
            throw new Error(error);
        }
    }

    async getEstadoUsuarios(){
        try {
            let query = `select est_codigo "id", est_descripcion "estado" from cr_estado where est_estado = 'A'`
            const result = await getManager().query(query);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getFiltroUsuarios(pbuscar :string){
        try {
            let query = `select tipo "tipo",  usuario "usuario", empleado "empleado", departamento  "departamento", id_departamento "departamentoId" , codigo "id"
                        from (
                        select 'I' tipo ,  usuario, empleado, departamento, d.id_departamento, codigo           
                        from vw_empleado e
                        left outer join  cr_departamentos_n d on d.direccion_id = e.direccion_id
                        where e.estado= 'A'
                        and e.usuario like '%${pbuscar}%'
                        or e.empleado like '%${pbuscar}%'
                        and rownum < 10
                        union all
                        select 'E' tipo, id_usuario, nombre_usuario, d.descripcion, d.id_departamento, usu_codigo
                        from cr_usuarios_departamentos u
                        join  cr_departamentos_n d on d.id_departamento = u.id_departamento
                        where 
                        id_usuario like '%${pbuscar}%' 
                        or nombre_usuario like '%${pbuscar}%'
                        and rownum < 10
                        )`
            const result = await getManager().query(query);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async insertSumilla(precord:any){
        try {
            let qrySecuencia = `select cr_s_registro_detalle.nextval from dual`
            const resSecuencia = await getManager().query(qrySecuencia);
            // let query = `insert into cr_registros_detalle (
            //     ID_REGISTRO, ID_SEC_REGISTRO, FECHA_ENVIO, ID_USUARIO_DESTINO, ID_DPTO_DESTINO, ESTADO_USUARIOS, USUARIO_DESTINO,
            //     DPTO_DESTINO, SUMILLA, ID_REGISTRO2, ID_SEC_REGISTRO2, TIPO ) values (
            //         ${precord.idRegistro},${resSecuencia[0].NEXTVAL},
            //         to_date('${moment().format('YYYY-MM-DD')}','yyyy-mm-dd'),
            //         '${precord.idUsuarioDestino}',${precord.idDptoDestino},
            //         '${precord.estadoUsuarios}', '${precord.usuarioDestino}', 
            //         '${precord.dptoDestino}', '${precord.sumilla}', 
            //         ${precord.idRegistro2}, ${precord.idSecRegistro2}, 
            //         '${precord.tipo}')`;
            let query = `insert into cr_registros_detalle (
                ID_REGISTRO, ID_SEC_REGISTRO, FECHA_ENVIO, ID_USUARIO_DESTINO, ID_DPTO_DESTINO, ESTADO_USUARIOS, USUARIO_DESTINO,
                DPTO_DESTINO, SUMILLA, ID_REGISTRO2, ID_SEC_REGISTRO2, TIPO ) values (
                    ${precord.idRegistro},${resSecuencia[0].NEXTVAL},
                    to_date('${moment().format('YYYY-MM-DD')}','yyyy-mm-dd'),
                    '${precord.sumiIdUsuarioDestino}',${precord.sumiIdDpto},
                    '${precord.sumiEstadoUsuarios}', '${precord.sumiUsuarioDestino}', 
                    '${precord.sumiDptoDestino}', '${precord.sumilla}', 
                    ${precord.idRegistro2}, ${precord.idSecRegistro2}, 
                    'S')`;
            console.log('query', query);
            const inserta = await getManager().query(query);
            return resSecuencia[0].NEXTVAL;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteSumilla(pid : number){
        try {
            let query = `delete cr_registros_detalle where id_sec_registro = ${pid} and tipo='S'`
            const borrar = await getManager().query(query);
            return 'ok';
        } catch (error) {
            throw new Error(error);            
        }
    }

    async updateSumilla(precord: any){
        try {
            let query = `update cr_registros_detalle set sumilla='${precord.sumilla}', estado_usuarios='${precord.estadoUsuarios}' where id_sec_registro = ${precord.idSecRegistro} and tipo='S'`
            const borrar = await getManager().query(query);
            return 'ok';
        } catch (error) {
            throw new Error(error);            
        }
    }


}