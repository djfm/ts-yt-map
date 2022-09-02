create table Client (
    id serial primary key,
    ip text NOT NULL,
    name TEXT NULL,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

create unique index idx_ip on Client (ip);
create unique index idx_name on Client (name);

insert into Client (ip, name) values ('192.168.0.254','fm@paris');

select id from Client where name = 'fm@paris' into @clientId;

alter table recommendation add column client_id integer null references Client(id) on delete cascade;
