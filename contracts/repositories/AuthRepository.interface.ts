import { User } from "@/contracts/models/user.interface";

export interface AuthRepository {
    login(email: string, password: string): Promise<User>;
    register(data: any): Promise<User>
    logout(): Promise<void>;
}