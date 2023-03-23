import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./dataSource";
import * as amqp from "amqplib/callback_api";
import { Order } from "./entity/Order";
import { Request, Response } from "express";
import { Product } from "./entity/Product";

const QUEUE = "orderPlaced";
const PORT = process.env.PORT;
const CORS = {
    origin: ["http://localhost:3000"]
};

AppDataSource.initialize()
.then(db => {

    const app = express();

    app.enable("trust proxy");
    app.use(cors(CORS));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    const orderRepository = AppDataSource.getMongoRepository(Order);

    amqp.connect("amqps://hkymaegl:tcyz0U5zQgsSC6K7SifQCqOWx4IhAdg3@chimpanzee.rmq.cloudamqp.com/hkymaegl", (error0, connection ) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            app.get("/api/v1", (req, res) => {
                res.send("This is Order service!!")
            });

            app.post("/api/orders", async (req: Request, res: Response) => {
                channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(req.body)));
                const order = new Order();
                order.user_id = req.body.user_id;
                order.total_price = req.body.total_price;
                order.products = req.body.products.map((prod) => {
                    const product = new Product();
                    product.id = prod.id;
                    product.image = prod.image;
                    product.price = prod.price;
                    product.title = prod.title;

                    return product;
                });
                const result = await orderRepository.save(order)

                res.send(result);
            });

            app.listen(PORT, () => {
                console.log(`Product Service started at port ${PORT}....`)
            });

            process.on("beforeExit", () => {
                console.log("Closing the server.....");
                connection.close();
            });
        });
    });
}).catch(error => console.log(error));
