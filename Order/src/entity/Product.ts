import { Column, Entity, PrimaryColumn } from "typeorm";

export class Product {
    @Column()
    id: number;

    @Column()
    title: string;

    @Column()
    image: string;

    @Column()
    price: number;
}