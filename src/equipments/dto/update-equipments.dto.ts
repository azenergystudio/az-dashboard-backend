import { PartialType } from "@nestjs/mapped-types";
import { CreateEquipmentDto } from "./create-equipments.dto";

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto){}