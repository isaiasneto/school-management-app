import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonEntity } from './lesson.entity';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.input';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
  ) {}

  async getLessons(): Promise<LessonEntity[]> {
    return this.lessonRepository.find();
  }

  async getLesson(id: string): Promise<LessonEntity> {
    return this.lessonRepository.findOne({ id });
  }

  async createLesson(
    createLessonInput: CreateLessonInput,
  ): Promise<LessonEntity> {
    const { name, startDate, endDate, students } = createLessonInput;
    const lesson = this.lessonRepository.create({
      id: uuid(),
      name,
      startDate,
      endDate,
      students,
    });

    return this.lessonRepository.save(lesson);
  }

  async assignStudentsToLesson(
    lessonId: string,
    studentsIds: string[],
  ): Promise<LessonEntity> {
    const lesson = await this.lessonRepository.findOne({ id: lessonId });
    lesson.students = [...lesson.students, ...studentsIds];

    return this.lessonRepository.save(lesson);
  }
}
