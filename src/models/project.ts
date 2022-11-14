import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

export class CreateProjectPayload {
  @Length(1)
  public name: string = '';

  public description: string = '';

  public urls: string[] = [];
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  public id: number = -1;

  @Column()
  public name: string = '';

  @Column()
  public description: string = '';

  @Column()
  public createdAt: Date = new Date();

  @Column()
  public updatedAt: Date = new Date();
}

export default Project;
