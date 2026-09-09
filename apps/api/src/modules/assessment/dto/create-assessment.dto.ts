import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateAssessmentDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsString()
  @MaxLength(100)
  code!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  assessmentType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  technology?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  difficulty?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  plannedQuestions?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalMarks?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @IsString()
  organizationId!: string;

  @IsString()
  createdByUserId!: string;
}