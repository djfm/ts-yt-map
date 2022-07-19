enum ChannelType {
  C = '/c/',
  Channel = '/channel/',
  User = '/user/'
}

class ScrapedChannelData {
  constructor(
    public channelURL: string,
    public htmlLang: string,
    public channelType: ChannelType,
    public shortName: string,
    public humanName: string,
    public youtubeId: string,
    public rawSubscriberCount: string,
    public description: string,
  ) {}
}

export default ScrapedChannelData;
