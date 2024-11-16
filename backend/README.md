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


## Recommend algorithm
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
