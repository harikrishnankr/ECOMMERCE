import { type } from "os";
import { Column, Entity, ObjectIdColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Order {
    @ObjectIdColumn()
    id: string;

    @Column()
    user_id: number;

    @Column()
    total_price: number;

    @Column(type => Product)
    products: Product[];
}