import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";

import { ExecutionService } from "./execution.service.js";
import { RunCodeDto } from "./dto/run-code.dto.js";
import { ValidateCodeDto } from "./dto/validate-code.dto.js";

@Controller("execution")
export class ExecutionController {
  constructor(
    private readonly executionService: ExecutionService,
  ) {}

  @Post("run")
  async run(
    @Body() dto: RunCodeDto,
  ) {
    return this.executionService.run(dto);
  }

  @Post("validate")
  async validate(
    @Body() dto: ValidateCodeDto,
  ) {
    return this.executionService.validate(dto);
  }
}