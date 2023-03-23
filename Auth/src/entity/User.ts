import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Model } from "./Model";
import { hash, compare } from "bcryptjs";

export enum UserTypes {
    Buyer = "Buyer",
    Seller = "Seller"
}

@Entity('users')
@Index(["email", "type"], { unique: true })
export class User extends Model {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    fullName: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserTypes,
        default: UserTypes.Buyer
    })
    type: string;

    public toJSON() {
        return {
            ...this,
            password: undefined
        };
    }

    /**
     * Hash password before saving to database
     */
    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 12);
    }

    /**
     * Validate password
     * @param candidatePassword 
     * @param hashedPassword 
     * @returns {Boolean}
     */
    static async comparePasswords(
        candidatePassword: string,
        hashedPassword: string
    ) {
        return await compare(candidatePassword, hashedPassword);
    }
}
