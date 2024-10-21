import postgres, { Sql } from 'postgres';
import "dotenv/config";

const { MODE, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

export class Database {
    public readonly sql: Sql

    constructor() {
        if (MODE === 'prod') {
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
        } else {
            this.sql = postgres({
                host: PGHOST,
                database: PGDATABASE,
                username: PGUSER,
                password: PGPASSWORD,
                port: 5432,
            });
        }
    }
}
