import { User } from "@/contracts/models/user.interface";
import { LoginSchemaType } from "../schemas/auth/LoginSchema";

/**
 * @deprecated this interface is not used
 */
export interface AuthRepository {
    login(data: LoginSchemaType): Promise<User>;
    register(data: any): Promise<User>
    logout(): Promise<void>;
}