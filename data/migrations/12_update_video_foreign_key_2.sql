alter table video drop constraint video_project_id_fkey;
alter table video add constraint video_project_id_fkey foreign key (project_id) references project(id) on delete cascade;
