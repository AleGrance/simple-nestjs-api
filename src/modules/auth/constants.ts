// constants.ts
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const jwtConstants = {
  secret: configService.get<string>('JWT_SECRET') || 'default_secret_key', // Asegúrate de que JWT_SECRET esté definido en tu archivo .env
};
