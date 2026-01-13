import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1) // TODO: En un futuro, cuando no esté en pruebas, se modificará a un valor mínimo más alto por seguridad
  password!: string;
}
