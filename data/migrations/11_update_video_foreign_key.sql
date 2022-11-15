alter table video drop constraint fk_video_channel;
alter table video add constraint fk_video_channel foreign key (channel_id) references channel(id) on delete cascade;
