import ResetPasswordService from "@modules/users/services/ResetPasswordService";
import { Response, Request } from "express";
import { container } from 'tsyringe';
export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {

    const { password, token } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({
      token,
      password,
    });

    return response.status(204).json();
  }
}