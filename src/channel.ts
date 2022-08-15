import { Page } from 'puppeteer';

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

import { convertNumber } from './util';

export enum ChannelType {
  C = '/c/',
  Channel = '/channel/',
  User = '/user/',
  Raw = '/',
}

export const asChannelType = (s: string): ChannelType => {
  if (s === 'c') {
    return ChannelType.C;
  }

  if (s === 'channel') {
    return ChannelType.Channel;
  }

  if (s === 'user') {
    return ChannelType.User;
  }

  return ChannelType.Raw;
};

@Entity()
export class ScrapedChannelData {
  @Column()
  @Length(1)
  public url: string = '';

  @Column()
  @Length(1)
  public htmlLang: string = 'en';

  @Column({ name: 'type' })
  public channelType: ChannelType = ChannelType.C;

  @Column()
  @Length(1)
  public shortName: string = '';

  @Column()
  @Length(1)
  public humanName: string = '';

  @Column()
  @Length(1)
  public youtubeId: string = '';

  @Column()
  @Length(1)
  public rawSubscriberCount: string = '';

  @Column()
  @Length(1)
  public description: string = '';
}

export default ScrapedChannelData;

@Entity()
export class Channel extends ScrapedChannelData {
  @PrimaryGeneratedColumn()
  public id: number = -1;

  @Column()
  public subscriberCount: number = -1;

  @Column()
  public createdAt: Date = new Date();

  @Column()
  public updatedAt: Date = new Date();

  constructor(channel?: ScrapedChannelData) {
    super();
    if (channel) {
      for (const [k, v] of Object.entries(channel)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[k] = v;
      }

      this.subscriberCount = convertNumber(this.rawSubscriberCount.split(' ')[0]);
    }
  }
}
