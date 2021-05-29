import cors from "cors";
import express from 'express'

import { createConnection } from "typeorm";

import oficiosRoute from "./routes/oficiosRoute";
import config from "./config.json";
import { TypeOrmLogger } from './utils/loggerorm'

const connection = createConnection({
    type: config.type,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    sid: config.sid,
    //entities: ["./dist/entities/**/*.js"],
    entities: [`${config.entities}`],
    synchronize: false,
    logging: ["info", "error"],
    logger: new TypeOrmLogger()
});


const app = express();
app.use(cors());
app.use(express.json());

//app.use(cobroRoute);
 app.use(oficiosRoute);

//app.listen(config.puertoAPI);
app.listen(config.puertoAPI);
console.log(`Servidor iniciado puerto ${config.puertoAPI}`);


console.log("Iniciado");

