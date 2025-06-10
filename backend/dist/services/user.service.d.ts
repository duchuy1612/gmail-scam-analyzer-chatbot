import { Repository } from 'typeorm';
import { User, CreateUserData, UserResponse } from '../entities/user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    createUser(userData: CreateUserData): Promise<UserResponse>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<UserResponse | null>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    getAllUsers(): Promise<UserResponse[]>;
}
