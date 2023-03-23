import { DataSource } from "typeorm";
import { Product } from "./entity/product";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "sqluser",
    password: "root",
    database: "product",
    synchronize: true,
    logging: false,
    entities: [Product],
    subscribers: [],
    migrations: [],
});
