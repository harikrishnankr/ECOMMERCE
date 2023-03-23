import { DataSource } from "typeorm";
import { MONGO_DB_NAME, MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER } from "./config";
import { Order } from "./entity/Order";
import { Product } from "./entity/Product";

export const AppDataSource = new DataSource({
    type: "mongodb",
    host: MONGO_IP,
    database: MONGO_DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Product, Order],
    useUnifiedTopology: true,
    port: parseInt(MONGO_PORT as string, 10),
    username: MONGO_USER,
    password: MONGO_PASSWORD,
    authSource: "admin"
});
