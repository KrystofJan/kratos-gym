# HOW TO RUN
- You need to have the database runnning in the background on the normal port
- set the creds and you should, run the neon script in `db/` and run thee app
## DOCKER
```bash
docker pull krystofjan/kratos-gym-be
```

```bash
docker run -p 7000:7000 fca83ebbcc1 --network="host
```

There is also a PR tag with this format: ```PR-{{PR-NUMBEr}}```

### alternative
You can use docker compose


## Local dev
```bash
npm run dev
```


## Recommend Machines algorithm
* Most of this algoritm is in the database as a function

Here's the function:
```plpgsql
CREATE OR REPLACE FUNCTION get_machines_in_same_category(input_machine_id INT)
RETURNS TABLE(
    machine_id INT,
    machine_name VARCHAR,
    max_weight DOUBLE PRECISION,
    min_weight DOUBLE PRECISION,
    max_people INT,
    avg_time_taken INT,
    popularity_score INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT m.*
    FROM machine m
    JOIN machine_exercise_type met ON m.machine_id = met.machine_id
    JOIN exercise_type et ON met.exercise_type_id = et.exercise_type_id
    WHERE et.category_id = (
        SELECT et.category_id
        FROM machine_exercise_type met
        JOIN exercise_type et ON met.exercise_type_id = et.exercise_type_id
        WHERE met.machine_id = input_machine_id
        LIMIT 1
    )
    AND m.machine_id != input_machine_id
    ORDER BY m.popularity_score DESC; -- Sorting by popularity_score in descending order
END;
$$ LANGUAGE plpgsql;
```

## Recommend time algorithm

- Most of this algorithm is done with this sql function:
```plpgsql
CREATE OR REPLACE FUNCTION get_plan_machines_with_next_and_prev(input_machine_id INT, input_reservation_date DATE)
    RETURNS TABLE(
        plan_id INT,
        machine_id INT,
        start_time time,
        end_time time,
        previous_plan_id INT,
        previous_start_time time,
        previous_end_time time,
        next_plan_id INT,
        next_start_time time,
        next_end_time time
    ) AS $$
BEGIN
    RETURN QUERY
        SELECT
            pm.plan_id,
            pm.machine_id,
            pm.start_time AS current_start_time,
            pm.end_time AS current_end_time,
            LAG(pm.plan_id) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS previous_plan_id,
            LAG(pm.start_time) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS previous_start_time,
            LAG(pm.end_time) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS previous_end_time,
            LEAD(pm.plan_id) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS next_plan_id,
            LEAD(pm.start_time) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS next_start_time,
            LEAD(pm.end_time) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS next_end_time
        FROM
            plan_machine pm inner join reservation on pm.plan_id = reservation.plan_id
        WHERE
            pm.machine_id = input_machine_id
          and TO_CHAR(reservation_time, 'YYYY-MM-DD') = TO_CHAR(input_reservation_date, 'YYYY-MM-DD')
        ORDER BY
            current_start_time, current_end_time;
END;
$$ LANGUAGE plpgsql;
```
