import { Request, Response } from "express";
import { LoginUseCase } from './../../application/useCases/auth/LoginUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase';
import { RegisterUseCase } from "../../application/useCases/auth/RegisterUseCase";
import { Login } from "../../domain/entities/Login";
import { IDecodedToken } from "../../infrastructure/interfaces/IDecodedToken";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase
  ) { }

  login = async (req: Request, res: Response) => {
    const { email, password }: Login = req.body;
    const result = await this.loginUseCase.execute(email, password);
    if (result) {
      res.json(result);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  };

  register = async (req: Request, res: Response) => {
    const { email, name, password, role } = req.body;
    const userId = await this.registerUseCase.execute(email, name, password, role);
    res.status(201).json({ message: "User created successfully", userId });
  };

  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await this.refreshTokenUseCase.execute(refreshToken);
    if (result) {
      res.json(result);
    } else {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  };

  verifyToken = async (token: string): Promise<IDecodedToken> => {
    return await this.refreshTokenUseCase.verityToken(token);
  }
}
