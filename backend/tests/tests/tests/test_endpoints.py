import pytest
import requests
from faker import Faker
fake = Faker()

BASE_URL = "http://localhost:7000"


def get_latest_id(table_name, id_name):
    url = f"{BASE_URL}/api/db-lts?table_name={table_name}&id_name={id_name}"
    response = requests.get(url)
    try:
        data = response.json()
        print(data)
        return data['id']
    except requests.JSONDecodeError:
        raise Exception(f'{BASE_URL}/db-lts?table_name={table_name}&id_name={id_name}')


GET_ENDPOINTS = [
    "/api/address",
    "/api/address/1",
    "/api/plan",
    "/api/plan/1",
    "/api/plan/1/machines",
    "/api/plan/1/types",
    "/api/machine",
    "/api/machine/1",
    "/api/machine/recommend/1",
    "/api/machine/usage/1?desired_date=2025-03-28&desired_start_time=9:00&desired_end_time=9:05:&amount_of_people=1&can_disturb=false",
    "/api/reservation",
    "/api/reservation/1",
    "/api/account?role=trainer",
    "/api/account/1",
    "/api/account/1/reservations",
    "/api/account/clerk/user_2mcZZtJs0f4vZVWv8qIaqSLsoa4",
    "/api/exercise-type/",
    "/api/exercise-type/1",
    "/api/exercise-type/machine/1",
    "/api/exercise-category/",
    "/api/exercise-category/1",
]

POST_ENDPOINTS = {
    "/api/address": {  
      "Street": "Spořilov",
      "City": "Praha",
      "PostalCode": "73292",
      "Country": "CZE",
      "BuildingNumber": "832/2",
      "ApartmentNumber": "11"
    },
    "/api/plan": {
        "PlanName":"TEST-PLAN1233",
        "AccountId": 1
    },
    "/api/machine": {
        "MachineName": "Stepping Machine",
        "MaxWeight": 0,
        "MinWeight": 0,
        "MaxPeople": 1,
        "AvgTimeTaken": 300
    },
    # "/api/machine/fetch;machine,machine_id/type/2": {
    # },
    # "/api/plan/fetch;plan,plan_id/type/2": {
    # },
    "/api/reservation": {
        "AmountOfPeople": 1,
        "ReservationTime": "2023-10-01T10:00:00",
        "CustomerId": 1,
        "TrainerId": 4,
        "PlanId": 1
    },
    "/api/reservation/full": {
       "AmountOfPeople":2,
       "ReservationTime":"2025-02-23T23:00:00.000Z",
       "Plan":{
          "PlanName":"Esketit",
          "Machines":[
             {
                "MachineId":25,
                "Reps":6,
                "Sets":4,
                "StartTime":"9:0",
                "EndTime":"9:5",
                "CanDisturb":False
             },
             {
                "MachineId":30,
                "Reps":6,
                "Sets":4,
                "StartTime":"9:5",
                "EndTime":"9:10",
                "CanDisturb":False
             },
             {
                "MachineId":36,
                "Reps":6,
                "Sets":4,
                "StartTime":"9:10",
                "EndTime":"9:15",
                "CanDisturb":False
             }
          ],
          "ExerciseCategories":[
             {
                "CategoryId":2,
                "CategoryName":"Lower body"
             }
          ],
          "AccountId":1
       },
       "CustomerId":1
    },
    "/api/auth/new-account" : {
        "FirstName": "Test",
        "LastName": "Testovic",
        "Login": fake.user_name(),
        "Email": fake.email(),
        "ClerkId": fake.uuid4()
    },
    "/api/plan-generator/generate": {
        "amount_of_people": 1,
        "start_time": {
            "hour": 0,
            "minute": 0
        },
        "machine_ids": [
            25,
            28,
            32
        ],
        "reservation_date": "2025-02-19"
    },
    "/api/exercise-category": {
        "CategoryName": "Bickules"
    },
    "/api/exercise-type": {
        "TypeName": "Some type",
        "CategoryId": 1,
        "BodyPart": "Arm"
    },
    # "/api/plan/1/machine/2": {
    #     
    # }
}

PATCH_ENDPOINTS = {
    "/api/account/4/address/set": {  
        "AddressId": "fetch;address,address_id"
    },
    "/api/address/fetch;address,address_id": {  
        "Street": "Perun"
    },
    "/api/account/4": {  
        "FirstName": "Veles"
    },
    "/api/exercise-category/fetch;exercise_category,category_id": {  
        "CategoryName": "Radegast"
    },
    "/api/exercise-type/fetch;exercise_type,exercise_type_id": {  
        "TypeName": "Chernobog"
    },
    "/api/plan/fetch;plan,plan_id": {  
        "PlanName": "Bielobog"
    },
    "/api/reservation/fetch;reservation,reservation_id": {  
        "AmountOfPeople": 2
    },
}

DELETE_ENDPOINTS = {
    "/api/account/fetch;account,account_id",
    # "/api/address/fetch;address,address_id",
    "/api/exercise-category/fetch;exercise_category,category_id",
    "/api/exercise-type/fetch;exercise_type,exercise_type_id",
    "/api/machine/fetch;machine,machine_id",
    "/api/reservation/fetch;reservation,reservation_id",
    # "/api/plan/fetch;plan,plan_id",
}


class TestPost:
    @pytest.mark.parametrize("endpoint,payload", POST_ENDPOINTS.items())
    def test_endpoint_status_2xx(self, endpoint, payload):
        """
        Test that each endpoint returns a 2xx status code.
        """

        ep=endpoint
        if "fetch;" in endpoint:
            keys = endpoint.split(';')[1].split(',')
            e = "/".join(endpoint.split('/')[:-1])
            print(keys)
            print(e)
            ep = f"{e}/{get_latest_id(keys[0], keys[1].split('/')[0])}"
            
        url = f"{BASE_URL}{ep}"
        response = requests.post(url, json=payload)
        assert response.status_code >= 200 and response.status_code < 300, f"{url} returned {response.status_code}"

class TestGet:
    @pytest.mark.parametrize("endpoint", GET_ENDPOINTS)
    def test_endpoint_status_2xx(self, endpoint):
        """
        Test that each endpoint returns a 2xx status code.
        """
        url = f"{BASE_URL}{endpoint}"
        response = requests.get(url)
        assert response.status_code >= 200 and response.status_code < 300, f"{url} returned {response.status_code}"


class TestPatch:
    @pytest.mark.parametrize("endpoint,payload", PATCH_ENDPOINTS.items())
    def test_endpoint_status_2xx(self, endpoint, payload):
        """
        Test that each endpoint returns a 2xx status code.
        """
        pl = {}

        ep = endpoint
        if "fetch;" in endpoint:
            keys = endpoint.split(';')[1].split(',')
            e = "/".join(endpoint.split('/')[:-1])
            ep = f"{e}/{get_latest_id(keys[0], keys[1])}"
        for key, val in payload.items():
            v = val
            k = key
            if isinstance(val, str) and "fetch;" in val:
                values = val.split(';')[1].split(',')
                v = get_latest_id(values[0], values[1])
            pl[k] = v

        url = f"{BASE_URL}{ep}"
        response = requests.patch(url, json=pl)
        assert response.status_code >= 200 and response.status_code < 300, f"{url} returned {response.status_code}"

class TestDelete:
    @pytest.mark.parametrize("endpoint", DELETE_ENDPOINTS)
    def test_endpoint_status_2xx(self, endpoint):
        """
        Test that each endpoint returns a 2xx status code.
        """
        ep = endpoint
        if "fetch;" in endpoint:
            keys = endpoint.split(';')[1].split(',')
            e = "/".join(endpoint.split('/')[:-1])
            ep = f"{e}/{get_latest_id(keys[0], keys[1])}"

        url = f"{BASE_URL}{ep}"
        response = requests.delete(url)
        assert response.status_code >= 200 and response.status_code < 300, f"{url} returned {response.status_code}"
