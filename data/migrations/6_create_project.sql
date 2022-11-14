create table project
(
    id serial not null
        constraint project_pkey
            primary key,
    name text not null unique,
    description text null,
    created_at timestamp not null,
    updated_at timestamp not null
);

insert into project (name, description, created_at, updated_at) values ('exploration', 'Random walk of the youtube graph from a given seed', now(), now());

alter table video add column project_id integer null;
update video set project_id = 1;
alter table video alter column project_id set not null;
alter table video add constraint video_project_id_fkey foreign key (project_id) references project (id);

create unique index idx_url_project_id on video (url, project_id);
drop index idx_url;
