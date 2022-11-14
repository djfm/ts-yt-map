import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Recommendation {
  @PrimaryGeneratedColumn()
  public id: number = -1;

  @Column()
  public fromId: number = -1;

  @Column()
  public toId: number = -1;

  @Column()
  public rank: number = -1;

  @Column()
  public createdAt: Date = new Date();

  @Column()
  public updatedAt: Date = new Date();
}

export default Recommendation;
