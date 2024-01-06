import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class DeleteTransactionsPayloadDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  entries: string[];
}
