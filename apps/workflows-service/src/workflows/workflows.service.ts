import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkflowDto, UpdateWorkflowDto } from '@app/workflows';
import { Workflow } from './entities/workflow.entity';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
  ) {}

  async create(createWorkflowDto: CreateWorkflowDto) {
    const workflow = this.workflowRepository.create(createWorkflowDto);
    const newWorkflowEntity = await this.workflowRepository.save(workflow);
    this.logger.debug(`Created workflow with id #${newWorkflowEntity.id}`);
    return newWorkflowEntity;
  }

  findAll() {
    return this.workflowRepository.find();
  }

  async findOne(id: number) {
    const workflow = await this.workflowRepository.findOne({ where: { id } });
    if (!workflow) {
      throw new NotFoundException(`Workflow #${id} does not exist`);
    }
    return workflow;
  }

  async update(id: number, updateWorkflowDto: UpdateWorkflowDto) {
    const workflow = await this.workflowRepository.preload({
      id: +id,
      ...updateWorkflowDto,
    });
    if (!workflow) {
      throw new NotFoundException(`Workflow #${id} does not exist`);
    }
    return this.workflowRepository.save(workflow);
  }

  async remove(id: number) {
    const workflow = await this.findOne(id);
    return this.workflowRepository.remove(workflow);
  }
}
