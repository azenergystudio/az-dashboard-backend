import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateParameterDto {
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}