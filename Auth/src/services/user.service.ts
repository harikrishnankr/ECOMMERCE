import { AppDataSource } from '../dataSource';
import { User, UserTypes } from '../entity/User';
import { CreateUserInput } from '../validations/user.validation';
import redisClient from '../utils/connectRedis';
import config from 'config';
import { signJwt } from '../utils/jwt';

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: CreateUserInput) => {
    return (await AppDataSource.manager.save(
        AppDataSource.manager.create(User, input)
    )) as User;
};

export const findUserByEmail = async ({ email }: { email: string }) => {
    return await userRepository.findOneBy({ email });
};

export const findUserById = async (userId: number) => {
    return await userRepository.findOneBy({ userId });
};

export const findUser = async (query: Object) => {
    return await userRepository.findOneBy(query);
};

export const signTokens = async (user: User) => {
    // 1. Create Session
    redisClient.set(user.userId.toString(), JSON.stringify(user), {
      EX: config.get<number>('redisCacheExpiresIn') * 60,
    });
  
    // 2. Create Access and Refresh tokens
    const access_token = signJwt({ sub: user.userId }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });
  
    const refresh_token = signJwt({ sub: user.userId }, 'refreshTokenPrivateKey', {
      expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });
  
    return { access_token, refresh_token };
  };
