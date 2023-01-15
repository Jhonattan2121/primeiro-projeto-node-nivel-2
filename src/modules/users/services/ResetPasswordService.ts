import {inject, injectable} from 'tsyringe';


import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';


interface IRequest {
  token: string;
  password: string;
  
}

@injectable()
  class ResetPasswordService { 
  constructor( 
  @inject('UsersRepository')
  private usersRepository: IUsersRepository,
  

  @inject('UserTokensRepository')
  private userTokensRepository: IUserTokensRepository,

  ) {}

  public async execute({token, password }: IRequest): Promise<void> { 
    const userToken = await this.userTokensRepository.findByToken(token);
    
    if (!userToken) {
      throw new AppError('User token does not exists');
    }
    const user = await  this.usersRepository.findById(userToken.user_id)
    
    if (!user) {
      throw new AppError('User does not exists');
    }
    (await user).password = password;
    await this.usersRepository.save(user);
  }

}

export default ResetPasswordService;