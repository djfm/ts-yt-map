import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Recommendation {
  @PrimaryGeneratedColumn()
  public id: number = -1;

  @Column()
  public from_id: number = -1;

  @Column()
  public to_id: number = -1;

  @Column()
  public rank: number = -1;

  @Column()
  public created_at: Date = new Date();

  @Column()
  public updated_at: Date = new Date();
}

export default Recommendation;
