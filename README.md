# gym-reservation-system
## TODO:
- finish reverse proxy set up for local dev
- finish clerk auth
- fix colors on frontend
- finish other endpoints



## Update APR 01. 2024
* Refactored the whole backend to typescript
* Split Reservation to multiple components on the fe
* the rest in commit msgs

## Update Feb 06. 2024
* Adding WrkOutPlanTypes and WrkOutPlanMachine endpoints
* Adding requests to Reservations endpoint
* Refractoring models and controllers

## Update Feb 05. 2024
* Adding MachineExerciseTypes and ExerciseType endpoints
* Adding requests to WrkOutMachine and Address endpoints

## Update Dec 23. 2023
* Added remote databse
* Started writing the docs
* Refractoring FE to use composition API

## Update Nov 30. 2023
* Refractored the whole backend
* Fixed some issues in frontend

## Update Nov 21. 2023
* Optimising frontend components
* fixed footer links
* Made a logo

## Update Nov 20. 2023
* Refractoring -> Implemented models, which represent endpoint data. I also Access db with these models. Might put to a separate class later (for now I have 2 requests that work like this. get all Addresses and get reservation by ip)
* Fetching db key names from json

## Update Nov 17. 2023
* Added more functionality to db - canDisturb, TimeTaken etc.
* Fetching data from separate files

## Update Nov 5. 2023
* Added HeroBanner, Footer and Appheader Components
* Added basic Admin, AboutUs, Contacts, Home and Reservation Views
* Dynamicaly changing content

## Update Oct 24. 2023
* Init Vue.js frontend
* Added ```run.sh``` bash script that runs api and frontend at the same time

## Update Oct 22. 2023
* Added AddCredits Procedure
* Added DatabaseValidators class where all the validation is going to be in
* Added get specific reservation endpoint
  
## Update Oct 18. 2023
* Added WrkOutTime to WekOutPlanMachine table for time suggestion
* Added presets to db
* Created a ReduceCredits procedure

## Update Oct 16. 2023
* Added one more endpoint with an id parameter that suggests a Machine
* Refractoring
* UseCase Model

## Update Oct 2. 2023

* Added a get request for a reservation endpoint
* Connected to the DB
