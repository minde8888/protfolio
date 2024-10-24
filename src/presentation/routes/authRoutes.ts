import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware';
import { container } from "../../infrastructure/di/container";
import { loginSchema, registerSchema } from "../middlewares/validateRequest";
import { IContainerResult } from "../../infrastructure/interfaces/IContainerResult";

export default async (router: Router): Promise<void> => {

  const { authController }: IContainerResult = await container();
  const validateBody = (schema: any) => expressYupMiddleware({
    schemaValidator: {
      schema: schema
    },
  });

  router.post(
    "/v1/login",
    validateBody(loginSchema),
    authController.login
  );

  router.post(
    "/v1/register",
    validateBody(registerSchema),
    authController.register
  );

  router.post("/v1/refresh-token", authController.refreshToken);
};