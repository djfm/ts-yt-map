alter table project add column project_type text;

update project set project_type = 'exploration' where id = 1;
update project set project_type = 'first level recommendations' where id != 1;

alter table project alter column project_type set not null;
