import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";
import { AppDataSource } from "./dataSource";
import { Product } from "./entity/product";
import * as bodyParser from "body-parser";
import * as amqp from "amqplib/callback_api";
import { In } from "typeorm";

const QUEUE = "orderPlaced";

AppDataSource.initialize()
.then(db => {
    const PORT = 8000;
    const CORS = {
        origin: ["http://localhost:3000"]
    };
    
    const app = express();
    
    app.use(cors(CORS));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    const productRepository = AppDataSource.getRepository(Product);

    amqp.connect("amqps://hkymaegl:tcyz0U5zQgsSC6K7SifQCqOWx4IhAdg3@chimpanzee.rmq.cloudamqp.com/hkymaegl", (error0, connection ) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(QUEUE, { durable: false });

            channel.consume(QUEUE, async (message) => {
                const orderReq = JSON.parse(message.content.toString());
                const productIds = orderReq.products.map((product) => parseInt(product.id));
                const products = await productRepository.find({
                    where: { "id": In(productIds) }
                });
                products.forEach(prod =>prod.purchaseCount++);
                await productRepository.save(products)
            });
            
            app.get("/api/products", async (req: Request, res: Response) => {
                const products = await productRepository.find();
        
                res.json(products);
            });
        
            app.post("/api/products", async (req: Request, res: Response) => {
                const product = await productRepository.create(req.body);
                const result = await productRepository.save(product)
        
                res.send(result);
            });
        
            app.get("/api/products/:id", async (req: Request, res: Response) => {
                const product = await productRepository.findOneBy({ "id": parseInt(req.params.id) });
        
                res.send(product);
            });
        
            app.put("/api/products/:id", async (req: Request, res: Response) => {
                const product = await productRepository.findOneBy({ "id": parseInt(req.params.id) });
                productRepository.merge(product, req.body);
                const result = await productRepository.save(product)
        
                res.send(result);
            });
        
            app.delete("/api/products/:id", async (req: Request, res: Response) => {
                const result = await productRepository.delete({ "id": parseInt(req.params.id) });
        
                res.send(result);
            });
        
            app.post("/api/products/:id/like", async (req: Request, res: Response) => {
                const product = await productRepository.findOneBy({ "id": parseInt(req.params.id) });
                product.likes++;
                const result = await productRepository.save(product)
        
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
