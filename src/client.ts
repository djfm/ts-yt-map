import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import {
  Min, Length,
} from 'class-validator';

@Entity()
export class Client {
  @Min(0)
  @PrimaryGeneratedColumn()
  public id: number = 0;

  @Length(1, 255)
  @Column()
  public ip: string = '';

  @Length(1, 255)
  @Column()
  public name: string = '';

  @Length(1, 16)
  @Column()
  public country: string = '';

  @Length(1, 255)
  @Column()
  public city: string = '';

  @Length(1, 255)
  @Column()
  public seed: string = '';

  @Column()
  public createdAt: Date = new Date();

  @Column()
  public updatedAt: Date = new Date();

  constructor(data: Partial<Client> = {}) {
    Object.assign(this, data);
  }
}

export default Client;
