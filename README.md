<div align="center" style="background: black; color: white;">

# Kratos gym
##### A gym reservation system

[//]: <> (Gonna need to change picture based on the theme later on :D)
<img alt="Kratos" height="280" src="./frontend/public/logo-vert-cropped.svg" />

[![Typescript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/)
[![Postgres](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
</div>

## Table of contents
- [Installation](#installation)
  - [Using docker](#using-docker)
  - [Manual installation](#manual-installation)
- [Data](#data)

## Installation

> [!NOTE]
    To verify that you have successfully set up the api, you can try to make a GET request on the `http://localhost:7000/api/test/version` endpoint. You shoud get a 200 status code with this response body: `{"version": "1.0}`
> 

### Using docker

#### Dependencies
- **Docker engine**
    - To install **Docker Engine**, follow steps in [Docker Engine installation guide](https://docs.docker.com/engine/install/)
    - You can also use **Docker Desktop**, if you prefer it. [Docker Desktop installation guide](https://docs.docker.com/get-started/get-docker/)

- **Docker compose**
    - To install **Docker Compose**, follow steps in [Overview of installing Docker Compose](https://docs.docker.com/compose/install/)

#### Setup
Using docker you'll need to do 2 steps

1. Run docker compose to start all `api`, `frontend` and the `postgres` database
```
docker compose up -d
```
> [!NOTE]
    docker compose is the new `GO` implementation of the old `python` docker-compose.
    docker-compose is a standalone app, but docker compose is a plugin. Depending on your installation this step may change
> 

2. <a id="docker-db-setup">After starting all the necessary containers, you need to run the sql script that will create the database, create the tables and insert data in</a>

```
cat ./backend/db/setup_script.sql | docker exec -i {{POSTGRES_CONTAINER_ID}} psql -U postgres -d kratos-dev
```

> [!WARNING]
    You'll need to substiture the `{{POSTGRES_CONTAINER_ID}}` with the actual postgres `CONTAINER ID`
    You can find `CONTAINER ID` using: `docker ps` and look for the `postgres` container
> 

> [!WARNING]
    The database script will be changed in the future to contain more suitable data, for now it contains random data :)
> 

At this point you should be able to visit `http://localhost:5173/` and be on the site, you can access the api `http://localhost:7000`.


### Manual installation

#### Dependencies
You can skip dependencies if you want to use nix ;)

- **Node.js 22**
- **Postgres**/Or Docker
    - I won't be going over the steps on how to set up the database, you can use the one provided in `docker-compose.yml`
```
docker compose up postgres -d
```

##### Nix
You can use [Nix](https://nixos.org/) to the needed versions of node, etc. A `nix shell` is provided. If you didn't hear about nix yet, go check it out it's really cool!
Here's an installation guide: [Download Nix | NixOs](https://nixos.org/download/#download-nix)

To open a nix shell use
```
nix develop
```
This should install typescript, ts language server, node 22 etc.

If you do not use nix, you can refer to packages section in `flake.nix` and install everything except harlequin (you dont need that one)


#### Setup

##### DB
1. Run the script in `backend/db/setup_script.sql`
To run using docker refer to [docker db setup](#docker-db-setup)

##### Backend
1. Go to the backend folder and install packages:
```
cd backend
npm i
```

2. After you successfully install packages, you can start the HTTP server using
```
npm run dev
```

##### Frontend
1. Go to the frontend folder and install packages:
```
cd frontend
npm i
```

2. After you successfully install packages, you can start the HTTP server using
```
npm run dev
```
At this point you should be able to visit `http://localhost:5173/` and be on the site, you can access the api `http://localhost:7000`.

## Data

There are data to showcase the functionality of the system already in the setup sql script. There are 30 machines, 12 exercise categories, 50 exercise types (exercises you can do on the machines), and multiple reservations.


### Accounts

#### Admin (Employee)
- username: "admin"
- password: "SuperSecretPassword123."

#### Trainer

- username: "trainer01"
- password: "SuperSecretTrainerPassword123."

#### Customers

__Customer01__
- username: "customer01"
- password: "SuperSecretCustomerPassword123."

__Customer02__
- username: "customer02"
- password: "SuperSecretCustomerPassword123."

### Reservations

There are 3 reservations, which are done for different machines. All of these are done by the same account (**customer01**), and are happening on the same date (**May 25th, 2026**).

Here are the reservation plans with their time windows:

#### Plan name: PPL - Push

- Focus Categories: Chest, Shoulders, Biceps
- Time Block: 09:00 – 09:37
- Machines used:
  - Bench Press – 09:00 to 09:08 (Chest)
  - Cable Machine – 09:08 to 09:14 (Chest/Biceps)
  - Dumbbells – 09:14 to 09:19 (Biceps/Shoulders)
  - Incline Press Machine – 09:19 to 09:26 (Upper Chest)
  - Pec Deck – 09:26 to 09:31 (Inner Chest)
  - Shoulder Press Machine – 09:31 to 09:37 (Deltoids)

#### Plan name: PPL - Pull

- Focus Categories: Back, Triceps, Shoulders
- Time Block: 11:00 – 11:29
- Machines used:
  - Dip Station – 11:00 to 11:05 (Triceps, Shoulders)
  - Dumbbells – 11:05 to 11:10 (Accessory lifts)
  - Kettlebells – 11:10 to 11:15 (Accessory/back)
  - Tricep Pushdown Station – 11:15 to 11:20 (Triceps)
  - Smith Machine – 11:20 to 11:29 (Pulling variations, rows, etc.)

#### Plan name: PPL - Legs

- Focus Categories: Legs, Cardio
- Time Block: 13:00 – 13:47
- Machines used:
  - Squat Rack – 13:00 to 13:10 (Barbell Squats)
  - Hack Squat Machine – 13:10 to 13:19 (Quad-dominant leg press)
  - Leg Press – 13:19 to 13:27 (Glutes, hamstrings, quads)
  - Leg Extension Machine – 13:27 to 13:32 (Isolated quad work)
  - Treadmill – 13:32 to 13:47 (Cardio/leg burnout)

## Secrets
If you'd like to recieve secrets to run this manually, please contact me on jendazah@gmail.com
