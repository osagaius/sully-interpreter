import pg from "pg";
import { DATABASE_URL } from "../env";

let dbPool: pg.Pool;

export const connectPgClient = () => {
    if (dbPool) {
        return dbPool;
    }

    dbPool = new pg.Pool({
        connectionString: DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    return dbPool;
};

export const getPgClient = (): pg.Pool => {
    return connectPgClient();
}
