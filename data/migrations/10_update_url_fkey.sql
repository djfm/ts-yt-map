alter table url drop constraint url_project_id_fkey;
alter table url add constraint url_project_id_fkey foreign key (project_id) references project(id) on delete cascade;
