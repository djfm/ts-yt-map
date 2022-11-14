import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('url')
export class URLModel {
  @PrimaryGeneratedColumn()
  public id: number = -1;

  @Column()
  public projectId: number = -1;

  @Column()
  public url: string = '';

  @Column()
  public scraped: boolean = false;

  @Column()
  public latestCrawlAttemptedAt: Date = new Date(0);

  @Column()
  public crawlAttemptCount: number = 0;

  @Column()
  public createdAt: Date = new Date();

  @Column()
  public updatedAt: Date = new Date();
}

export default URLModel;
