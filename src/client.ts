import {
  Min, Length,
} from 'class-validator';

export class Client {
  @Min(1)
  public id: number = 0;

  @Length(1, 255)
  public ip: string = '';

  @Length(1, 255)
  public name: string = '';

  public createdAt: Date = new Date();

  public updatedAt: Date = new Date();
}

export default Client;
