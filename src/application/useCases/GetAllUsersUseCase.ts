import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User[] | undefined> {
    return this.userRepository.getAll();
  }
}
