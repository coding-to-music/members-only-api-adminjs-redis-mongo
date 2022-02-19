import { Router } from "express";
import { CustomIRouter } from "@interfaces/routes.interface";
import { get_verification_code, put_reset_password } from "@controllers/passwordController";

const passwordRouter: CustomIRouter = Router();

passwordRouter.get('/verification_code', get_verification_code);

passwordRouter.put('/reset_password', put_reset_password);

export default passwordRouter;