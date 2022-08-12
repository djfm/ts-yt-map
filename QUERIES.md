# Interesting queries to run against the database

## Random

### This one is interesting but hard to interpret:

```sql
SELECT count (DISTINCT from_id) as num_from,
count (DISTINCT to_id) as num_to
FROM recommendation as r
inner join video as v_from on r.from_id = v_from.id
inner join video as v_to on r.to_id=v_to.id
where v_from.crawled = true and v_to.crawled = true
```

This yields:

| num_from | num_to|
| ---------| ------|
| 3122     | 3319  |

later:

| num_from | num_to|
| ---------| ------|
| 5129     | 5443  |

Does it mean the recommendations form a circle?

## Sanity checks

### Do all crawled videos have 10 recommendations?

```sql
select from_id, count(to_id)
from recommendation
group by from_id
having count(to_id) > 10
order by count(to_id) desc
LIMIT 50
```
