drop index idx_ip;
create unique index idx_ip on client (ip, name);
