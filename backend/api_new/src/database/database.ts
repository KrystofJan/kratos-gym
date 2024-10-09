import postgres, { Sql } from 'postgres';
import "dotenv/config";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

export class Database {
    public readonly sql: Sql

    constructor() {
        this.sql = postgres({
            host: PGHOST,
            database: PGDATABASE,
            username: PGUSER,
            password: PGPASSWORD,
            port: 5432,
            ssl: 'require',
            connection: {
                options: `project=${ENDPOINT_ID}`,
            },
        });
    }
}
