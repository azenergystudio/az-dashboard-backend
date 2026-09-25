import { IsString } from 'class-validator';

export class CreateDeviceRoomMappingDto {
  @IsString()
  deviceId!: string;

  @IsString()
  roomId!: string;
}