<div align="center" style="background: black; color: white;">

# Kratos gym
##### A gym reservation system

[//]: <> (Gonna need to change picture based on the theme later on :D)
<img alt="Kratos" height="280" src="./frontend/public/logo-vert-cropped.svg" />

[![Typescript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/)
[![Postgres](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
</div>

## Installation

### Dependencies

You can skip this step if you'll run things in docker

You can use [Nix](https://nixos.org/) to the needed versions of node, etc. A `nix shell` is provided. If you didn't hear about nix yet, go check it out it's really cool!
Here's an installation guide: [Download Nix | NixOs](https://nixos.org/download/#download-nix)

1. Open a nix shell
```
nix develop
```
This should install typescript, ts language server, node 22 etc.

If you do not use nix, you can refer to packages section in `flake.nix` and install everything except harlequin (you dont need that one)

### Using docker

Using docker you'll need to do 2 steps

1. Run docker compose to start all `api`, `frontend` and the `postgres` database
```
docker compose up -d
```
> [!NOTE]
    docker compose is the new `GO` implementation of the old `python` docker-compose and it is managed by docker itself
> 

2. After starting all the necessary containers, you need to run the sql script that will create the database, create the tables and insert data in

> [!WARNING]
    The database script will be changed in the future to contain more suitable data, for now it contains random data :)
> 
```
cat ./backend/db/full_db_neon.sql | docker exec -i 696159c0eb7b psql -U postgres -d kratos-dev
```
At this point you should be able to visit `http://localhost:5173/` and be on the site, you can access the api `http://localhost:7000`.
