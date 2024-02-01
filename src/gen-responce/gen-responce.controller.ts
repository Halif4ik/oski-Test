import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenResponceService } from './gen-responce.service';

@Controller('/')
export class GenResponceController {
  constructor(private readonly genResponceService: GenResponceService) {}

  @Get()
  async findAll(): Promise<GeneralResponse<string>> {
    return this.genResponceService.findAll();
  }
}
