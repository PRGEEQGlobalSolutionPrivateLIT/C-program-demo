import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class RunCodeDto {
  @IsString()
  @IsIn(["c"])
  language!: "c";

  @IsString()
  @MaxLength(100_000)
  code!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20_000)
  input?: string;
}