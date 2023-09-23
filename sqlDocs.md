# SQL Docs

## get_infusions_by_order_for_user

This will create the function which we use to get `Infusions` grouped by `Factor Order`. It returns a table with the columns: `order_id`, `infusion_id`, `user_id`, `infusion_date`.

We have set a default value for the latest `Factor Order` so that we can capture all 'current' infusions under the latest order.

```sql
create or replace function get_infusions_by_order_for_user(uid int)
  returns table (order_id int, infusion_id int, user_id int, infusion_date timestamp)
as
$body$
WITH
  DatePairs AS (
    SELECT
      fo1.id as order_id,
      fo1.order_placed_at as start_date,
      LEAD(fo1.order_placed_at, 1, '3000-01-01'::timestamp) OVER (
        ORDER BY
          fo1.order_placed_at
      ) as end_date
    FROM
      factor_order fo1
  )
SELECT
  dp.order_id as order_id,
  infusion.id as infusion_id,
  infusion.user_id as user_id,
  infusion.infusion_date as infusion_date
FROM
  DatePairs dp
  LEFT JOIN infusion ON infusion.infusion_date < dp.end_date
  AND infusion.infusion_date > dp.start_date
WHERE infusion.user_id = $1
$body$
language sql;
```
