import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

import { Type } from "class-transformer";

class TestCaseDto {
  @IsString()
  id!: string;

  @IsString()
  @MaxLength(20_000)
  input!: string;

  @IsString()
  @MaxLength(20_000)
  expectedOutput!: string;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  @IsOptional()
  @IsNumber()
  marks?: number;
}

export class ValidateCodeDto {
  @IsString()
  @IsIn(["c"])
  language!: "c";

  @IsString()
  @MaxLength(100_000)
  code!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  testCases!: TestCaseDto[];
}