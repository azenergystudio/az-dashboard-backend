import { PartialType } from "@nestjs/mapped-types";
import { CreateDeviceRoomMappingDto } from "./create-device-room-mapping.dto";

export class UpdateDeviceRoomMappingDto extends PartialType(CreateDeviceRoomMappingDto) {

}