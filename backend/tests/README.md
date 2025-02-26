# API Tests
Ideally do some testing in this folder

To use venv use this command:
```
source myenv/bin/activate
```

## Test coverage

### Address

- [x] POST - `/api/address/`
- [x] GET - `/api/address/`
- [x] GET - `/api/address/:id`
- [x] PATCH - `/api/address/:id`
- [ ] DELETE - `/api/address/:id`

### Auth
- [x] POST - `/api/auth/new-account`

### Account

- [x] GET - `/api/account/`
- [x] GET - `/api/account/:id`
- [x] GET - `/api/account/:id/reservations`
- [x] GET - `/api/account/clerk/:id`
- [x] PATCH - `/api/account/:id/address/set`
- [x] PATCH - `/api/account/:id`
- [ ] DELETE - `/api/account/:id`

### exercise-category 

- [x] POST - `/api/exercise-category/`
- [x] GET - `/api/exercise-category/`
- [x] GET - `/api/exercise-category/:id`
- [x] PATCH - `/api/exercise-category/:id`
- [ ] DELETE - `/api/exercise-category/:id`

### exercise-type
- [x] POST - `/api/exercise-type/`
- [x] GET - `/api/exercise-type/`
- [x] GET - `/api/exercise-type/:id`
- [x] GET - `/api/exercise-type/machine/:id`
- [x] PATCH - `/api/exercise-type/:id`
- [ ] DELETE - `/api/exercise-type/:id`

### Machine

- [x] POST - `/api/machine/`
- [ ] POST - `/api/machine/:id/type/:typeId`
- [x] GET - `/api/machine/`
- [x] GET - `/api/machine/:id`
- [x] GET - `/api/machine/recommend/:id`
- [ ] GET - `/api/machine/usage/:id`
- [x] PATCH - `/api/machine/:id`
- [ ] DELETE - `/api/machine/:id`

### Plan
- [x] GET - `/api/plan/`
- [x] GET - `/api/plan/:id`
- [x] POST - `/api/plan/`
- [ ] DELETE - `/api/plan/:id`
- [x] PATCH - `/api/plan/:id`
- [x] GET - `/api/plan/:id/machines`
- [x] GET - `/api/plan/:id/types`
- [ ] POST - `/api/plan/:planId/machine/:machineId`
- [ ] POST - `/api/plan/:planId/type/:typeId`
- [ ] DELETE - `/api/plan/:planId/machine/:machineId`
- [ ] PATCH - `/api/plan/:planId/machine/:machineId`
- [ ] DELETE - `/api/plan/:planId/type/:typeId`

### Plan generator

- [x] POST - `/api/plan-generator/generate`

### Reservation

- [x] GET - `/api/reservation/`
- [x] GET - `/api/reservation/:id`
- [x] POST - `/api/reservation/`
- [x] POST - `/api/reservation/full`
- [ ] DELETE - `/api/reservation/:id`
- [x] PATCH - `/api/reservation/:id`

