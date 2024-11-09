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

