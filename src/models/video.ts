import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

import ScrapedChannelData from './channel';
import { convertNumber } from '../util';

export class ScrapedVideoData {
  @Column()
  @Length(1)
  public url: string = '';

  @Column()
  @Length(1)
  public rawLikeCount: string = '';

  @Column()
  @Length(1)
  public title: string = '';

  @Column()
  @Length(1)
  public description: string = '';

  @Column()
  @Length(1)
  public rawPublishedOn: string = '';

  @Column()
  @Length(1)
  public rawViewCount: string = '';

  @Column()
  public clientId: number = 0;

  public channelURL: string = '';

  public channel?: ScrapedChannelData;

  public recommendationURLs: string[] = [];
}

@Entity()
export class Video extends ScrapedVideoData {
  @PrimaryGeneratedColumn()
  public id: number = -1;

  @Column()
  public projectId: number = -1;

  @Column()
  public crawled: boolean = false;

  @Column()
  public latestCrawlAttemptedAt: Date = new Date(0);

  @Column()
  public crawlAttemptCount: number = 0;

  @Column()
  public likeCount: number = -1;

  @Column()
  public publishedOn: Date = new Date(0);

  @Column()
  public channelId: number = -1;

  @Column()
  public viewCount: number = -1;

  @Column()
  public createdAt: Date = new Date();

  @Column()
  public updatedAt: Date = new Date();

  constructor(video?: ScrapedVideoData) {
    super();
    if (video) {
      for (const [k, v] of Object.entries(video)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[k] = v;
      }

      this.likeCount = convertNumber(this.rawLikeCount);
      this.viewCount = convertNumber(this.rawViewCount.split(' ')[0]);
      this.publishedOn = new Date(this.rawPublishedOn);
    }
  }
}

export default ScrapedVideoData;
