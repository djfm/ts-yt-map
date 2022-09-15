create table client (
    id serial primary key,
    ip text NOT NULL,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    seed TEXT NOT NULL,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

create unique index idx_ip_name on Client (ip, name);

insert into client (ip, name, country, city, seed) values ('192.168.0.254','fm@paris', 'FR', 'Paris', 'https://www.youtube.com/watch?v=HqsIOTEbriY');

alter table video add column client_id integer not null default -1;
update video set client_id = (select id from client where name = 'fm@paris') where client_id = -1;
alter table video add constraint fk_client_id foreign key (client_id) references client (id) on delete cascade;
create index video_client_id_idx on video (client_id);
