import { Logger, QueryRunner } from "typeorm";
import { logger } from "./logger"

export class TypeOrmLogger implements Logger {
    
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.info(`Query ${query} - ${JSON.stringify(parameters)}`);
    
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    logger.error(`ORM Query ERROR [${error}] - ${JSON.stringify(parameters)}`);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    throw new Error('Method not implemented. Slow');
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    throw new Error('Method not implemented. SB');
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    throw new Error('Method not implemented. M');
  }

  log(level: 'log' | 'info' | 'warn', message: string, queryRunner?: QueryRunner) {
    //throw new Error('Method not implemented. log');
    if (!message.includes("glob pattern"))
    logger.error(`ORM log ${level} [${message}]`);
  }
}