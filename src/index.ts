import cors from "cors";
import express from 'express'

import { Connection, createConnection } from "typeorm";

import oficiosRoute from "./routes/oficiosRoute";
import seguridadRoute from './routes/seguridadRoute'
import config from "./config.json";
import { TypeOrmLogger } from './utils/loggerorm'
import { getConnection} from 'typeorm';

/* 
Prueba de autenticacion del usuario
*/

// import oracledb from 'oracledb';
// let conn:any;

// config
// const test = async ()  => {
//     try {
//         let config = {connectString: '192.198.12.200:1522/oradesa', user:'ercortt', password: 'erco'};
//         conn =await oracledb.getConnection(config);
//         console.log('Conectado');        
//         conn.close();
//     } catch (error) {
//         console.log('error', error.errorNum);
//     }
// }

// test();

// const connection = createConnection({
//     type: config.type,
//     host: config.host,
//     port: config.port,
//     username: config.username,
//     password: config.password,
//     sid: config.sid,
//     //entities: ["./dist/entities/**/*.js"],
//     entities: [`${config.entities}`],
//     synchronize: false,
//     logging: ["info", "error"],
//     logger: new TypeOrmLogger()
// });


const app = express();
app.use(cors());
app.use(express.json());

//app.use(cobroRoute);
 app.use(seguridadRoute);
 app.use(oficiosRoute);

//app.listen(config.puertoAPI);
app.listen(config.puertoAPI);
console.log(`Servidor iniciado puerto ${config.puertoAPI}`);


console.log("Iniciado");

