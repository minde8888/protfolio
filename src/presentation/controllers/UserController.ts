import { Request, Response, NextFunction } from "express";

import { GetAllUsersUseCase } from "../../application/useCases/user/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../../application/useCases/user/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../application/useCases/user/UpdateUserUseCase";
import { RemoveUserUseCase } from "../../application/useCases/user/RemoveUserUseCase";
import { UpdateUserDTO } from "../../application/dtos/user/UpdateUserDTO";

import { IGetUserByIdRequest } from "../../domain/entities/user/IGetUserByIdRequest";
import { IUpdateUserRequest } from "../../domain/entities/user/IUpdateUserRequest";
import { IRemoveUserRequest } from "../../domain/entities/user/IRemoveUserRequest";

export class UserController {
  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase
  ) { }

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.getAllUsersUseCase.execute();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    req: Request & IGetUserByIdRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      const user = await this.getUserByIdUseCase.execute(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: Request & IUpdateUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updates: Partial<UpdateUserDTO> = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      };

      const updatedUser = await this.updateUserUseCase.execute(req.params.id,  updates );
      
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  removeUser = async (
    req: Request & IRemoveUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      const user = await this.removeUserUseCase.execute(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
