import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "mysql",
    port: 3306,
    username: "sqluser",
    password: "root",
    database: "auth_db",
    synchronize: true,
    logging: false,
    entities: ['src/entity/**/*{.ts,.js}'],
    migrations: ['src/migrations/**/*{.ts,.js}'],
    subscribers: ['src/subscribers/**/*{.ts,.js}'],
});
