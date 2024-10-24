import * as bcrypt from "bcrypt";
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Mapper } from '@automapper/core';
import { Auth } from '../../../domain/entities/Auth';
import { User } from "../../../domain/entities/User";
import { HttpStatus } from "@nestjs/common";
import { handleError } from "../../../utils/Errors/handleError";

export class RegisterUseCase {
    constructor(
        private authRepository: IAuthRepository,
        private userRepository: IUserRepository,
        private mapper: Mapper
    ) { }

    async execute(email: string, name: string, password: string, role: string): Promise<{ status: number; error?: string }> {

        try {
            // Input validation
            if (!email || !name || !password || !role) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Missing required fields'
                };
            }

            // Check for existing user
            const existingUser = await this.authRepository.findByEmail(email);
            if (existingUser) {
                return {
                    status: HttpStatus.CONFLICT,
                    error: 'Email already exists'
                };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create auth record
            const authCreationResult = await this.authRepository.create({
                email,
                password: hashedPassword,
                role,
                name: name,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date()
            });


            const { user: auth } = authCreationResult;
            const user = this.mapper.map(auth, Auth, User);
            await this.userRepository.create(user);
            return {
                status: HttpStatus.CREATED,
            };

        } catch (error) {
            return handleError(error);
        }
    }
}