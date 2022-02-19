import { Router } from "express";
import { CustomIRouter } from "@interfaces/routes.interface";
import { get_logout_user, post_login_user, post_refresh_token } from "@controllers/authController";


const authRouter: CustomIRouter = Router();

authRouter.get('/logout', get_logout_user);

/**
 * @swagger
 * /login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *          description: Bad Request, invalid email or password
 *      404:
 *          description: User not found
 */

authRouter.post('/login', post_login_user);

authRouter.post('/refresh_token', post_refresh_token);

export default authRouter;