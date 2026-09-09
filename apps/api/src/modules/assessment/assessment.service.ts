import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { db } from "../../prisma/db.js";
import { CreateAssessmentDto } from "./dto/create-assessment.dto.js";
import { UpdateAssessmentDto } from "./dto/update-assessment.dto.js";

@Injectable()
export class AssessmentService {
  async create(dto: CreateAssessmentDto) {
    const assessment =
      await db.orm.public.Assessment.create({
        organizationId: dto.organizationId,
        title: dto.title,
        code: dto.code,
        assessmentType: dto.assessmentType,
        description: dto.description,
        instructions: dto.instructions,
        technology: dto.technology,
        difficulty: dto.difficulty,
        plannedQuestions: dto.plannedQuestions,
        totalMarks: dto.totalMarks,
        durationMinutes: dto.durationMinutes,

        status: "DRAFT",
        builderStep: "QUESTIONS",
        currentVersion: 1,

        createdByUserId: dto.createdByUserId,
      });

    return assessment;
  }

  async findAll() {
    return db.orm.public.Assessment.all();
  }

  async findOne(id: string) {
    const assessment =
      await db.orm.public.Assessment
        .where((fields, operators) =>
          operators.eq(fields.id, id),
        )
        .first();

    if (!assessment) {
      throw new NotFoundException(
        `Assessment with ID ${id} not found`,
      );
    }

    return assessment;
  }

  async update(
    id: string,
    dto: UpdateAssessmentDto,
  ) {
    await this.findOne(id);

    const assessment =
      await db.orm.public.Assessment
        .where((fields, operators) =>
          operators.eq(fields.id, id),
        )
        .update({
          ...(dto.title !== undefined && {
            title: dto.title,
          }),

          ...(dto.code !== undefined && {
            code: dto.code,
          }),

          ...(dto.assessmentType !== undefined && {
            assessmentType: dto.assessmentType,
          }),

          ...(dto.description !== undefined && {
            description: dto.description,
          }),

          ...(dto.instructions !== undefined && {
            instructions: dto.instructions,
          }),

          ...(dto.technology !== undefined && {
            technology: dto.technology,
          }),

          ...(dto.difficulty !== undefined && {
            difficulty: dto.difficulty,
          }),

          ...(dto.plannedQuestions !== undefined && {
            plannedQuestions: dto.plannedQuestions,
          }),

          ...(dto.totalMarks !== undefined && {
            totalMarks: dto.totalMarks,
          }),

          ...(dto.durationMinutes !== undefined && {
            durationMinutes: dto.durationMinutes,
          }),

          ...(dto.builderStep !== undefined && {
            builderStep: dto.builderStep as
              | "SETUP"
              | "QUESTIONS"
              | "SCORING"
              | "DELIVERY"
              | "REVIEW"
              | "PUBLISH",
          }),

          ...(dto.updatedByUserId !== undefined && {
            updatedByUserId: dto.updatedByUserId,
          }),
        });

    return assessment;
  }
}