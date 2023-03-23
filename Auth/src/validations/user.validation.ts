import { object, string, TypeOf, z } from "zod";
import { UserTypes } from "../entity/User";

export const createUserSchema = object({
    body: object({
        fullName: string({
            required_error: "Name is required",
        }),

        email: string({
            required_error: "Email address is required",
        }).email("Invalid email address"),

        phone: string({
            required_error: "Phone number is required",
        }),

        password: string({
            required_error: "Password is required",
        })
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),

        passwordConfirm: string({
            required_error: "Please confirm your password",
        }),

        type: z.enum([UserTypes.Buyer, UserTypes.Seller], {
            required_error: "User Type is required",
            invalid_type_error: "User Type should be String"
        })
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ["passwordConfirm"],
        message: "Passwords do not match",
    })
});

export const loginUserSchema = object({
    body: object({
        email: string({
            required_error: "Email address is required",
        })
        .email("Invalid email address"),

        password: string({
            required_error: "Password is required",
        })
        .min(8, "Invalid email or password"),

        type: z.enum([UserTypes.Buyer, UserTypes.Seller], {
            required_error: "User Type is required",
            invalid_type_error: "User Type should be String"
        }),
    }),
});

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>["body"], "passwordConfirm">;

export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
