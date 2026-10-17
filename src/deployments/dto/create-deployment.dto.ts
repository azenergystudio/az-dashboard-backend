import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDeploymentDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsString()
  @MaxLength(100)
  slug!: string;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  environment?: string;
}