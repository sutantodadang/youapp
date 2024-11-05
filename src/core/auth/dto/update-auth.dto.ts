import { PartialType } from '@nestjs/mapped-types';
import { LoginUserDTO } from './login.dto';

export class UpdateAuthDto extends PartialType(LoginUserDTO) { }
