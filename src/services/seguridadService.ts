import { Request, Response } from "express";
import { getRepository,  getManager, In} from 'typeorm';
import  oracledb from 'oracledb';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';


/**
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiQ0NFRElMTE8iLCJwYXNzd29yZCI6ImNjZWRpbGxvIiwiaWF0IjoxNjI1ODY2ODEyfQ.vQ9SqVihuKmUqnX37h6o1p0dBFEIa-jNdINN7gIhEA0
*/
dotenv.config();

export class SeguridadService{

    async login(user:string, password:string) {
        try {
            //Realizando conneccion de usuario
            let conn = await oracledb.getConnection({connectString: '192.198.12.200:1522/oradesa', user:user, password: password});

            //Creando token
            const userToken = {usuario: user, password: password}
            const token = jwt.sign(userToken, process.env.JWT_SECRET!, {expiresIn: 60 * 120 });

            let query = `select  codigo "codigo", cedula "cedula", empleado "empleado", grado_id "gradoId", cargo_id "cargoId", departamento_id "departamentoId", usuario_jefe_departamento "usuarioJefeDepartamento",
            direccion_id "direccionId", direccion "direccion", usuario_display "usuarioDisplay", email "email", usuario "usuario"
            from vw_empleado where usuario = '${user}' and estado='A'
            `
            const data = await conn.execute(query, [], {outFormat: oracledb.OUT_FORMAT_OBJECT});
            const resp = {usuario: data.rows![0], token : token};
            return resp;
        } catch (error) {
            throw new Error(error);
        }
    }   
}