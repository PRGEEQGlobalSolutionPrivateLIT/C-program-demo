import { Module } from "@nestjs/common";
import { ExecutionModule } from "./modules/execution/execution.module.js";

@Module({
  imports: [
    ExecutionModule,
  ],
})
export class AppModule {}