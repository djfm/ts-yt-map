create table url (
    id serial not null
        constraint url_pkey
            primary key,
    project_id integer not null,
    url text not null,
    scraped boolean not null default false,

    latest_crawl_attempted_at TIMESTAMP NOT NULL,
    crawl_attempt_count INTEGER NOT NULL DEFAULT 0,

    created_at timestamp not null,
    updated_at timestamp not null
);

alter table url
    add constraint url_project_id_fkey
        foreign key (project_id) references project (id);

alter table url
    add constraint url_url_project_id_key
        unique (url, project_id);
