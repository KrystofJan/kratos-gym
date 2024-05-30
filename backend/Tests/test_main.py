import pytest
import json
import random
from utils import PORT, URL, BodyParts, Categories, WrkOutMachineNames
from faker import Faker
import http.client

class BaseRequest:
    def __init__(self, endpoint) -> None:
        self.conn = http.client.HTTPConnection(URL, PORT)
        self.endpoint = endpoint 
    
    def get_all(self):
        self.conn.request("GET", self.endpoint)
        return self.conn.getresponse()

    def get_by_id(self, id):
        self.conn.request("GET", f"{self.endpoint}/{id}")
        return self.conn.getresponse()
    
    def post(self, body):
        headers = {'Content-type': 'application/json'}
        self.conn.request("POST", self.endpoint, json.dumps(body), headers) 
        return self.conn.getresponse()

class TestAddress:

    @pytest.fixture
    def address_client(self):
        return BaseRequest("/api/address")

    @pytest.fixture
    def address_body(self):
        fake = Faker()
        return {
            "Street": fake.street_name(),
            "City": fake.city(),
            "PostalCode": fake.postcode(),
            "Country": fake.country(),
            "BuildingNumber": fake.building_number(),
            "ApartmentNumber": fake.pyint()
        }

    def test_all_address(self, address_client):
        response = address_client.get_all()
        assert response.status == 200
    
    def test_id_address(self, address_client):
        response = address_client.get_by_id(1)
        assert response.status == 200

    def test_post_address(self, address_client, address_body):
        print(address_body)
        response = address_client.post(address_body)
        assert response.status == 201

    
class TestExerciseType:

    @pytest.fixture
    def exercise_type_client(self):
        return BaseRequest("/api/exercise-type")

    @pytest.fixture
    def exercise_type_body(self):
        return {
            "ExerciseTypeName": random.choice(WrkOutMachineNames),
            "Category": random.choice(Categories),
            "BodyPart": random.choice(BodyParts)
        }
    def test_all_exercise_type(self, exercise_type_client):
        response = exercise_type_client.get_all()
        assert response.status == 200
    
    def test_id_exercise_type(self, exercise_type_client):
        response = exercise_type_client.get_by_id(1)
        assert response.status == 200

    def test_post_exercise_type(self, exercise_type_client, exercise_type_body):
        print(exercise_type_body)
        response = exercise_type_client.post(exercise_type_body)
        assert response.status == 201

class TestReservation:
    
    @pytest.fixture
    def reservation_client(self):
        return BaseRequest("/api/reservation")

    @pytest.fixture
    def reservation_body(self):
        return {
            "AmmoutOfPeople": 1,
            "ReservationTime": "2024-02-03T12:32:32",
            "CustomerId": 2,
            "TrainerId": 3,
            "WrkOutPlanId": 12
        }

    def test_all_reservation(self, reservation_client):
        response = reservation_client.get_all()
        assert response.status == 200
    
    def test_id_reservation(self, reservation_client):
        response = reservation_client.get_by_id(46)
        assert response.status == 200

    def test_post_reservation(self, reservation_client, reservation_body):
        response = reservation_client.post(reservation_body)
        assert response.status == 201

class TestMachine:
    # TODO: Add add occupied and recommend 

    @pytest.fixture
    def machine_client(self):
        return BaseRequest("/api/machine")

    @pytest.fixture
    def machine_body(self):
        return {
            "MachineName":random.choice(WrkOutMachineNames),
            "MaxWeight": 150,
            "MinWeight": 15,
            "MaxPeople": 3,
            "AvgTimeTaken": 300,
            "PopularityScore": 0 
        }

    def test_all_machine(self, machine_client):
        response = machine_client.get_all()
        assert response.status == 200

    def test_id_machine(self, machine_client):
        response = machine_client.get_by_id(46)
        assert response.status == 200

    def test_post_machine(self, machine_client, machine_body):
        response = machine_client.post(machine_body)
        assert response.status == 201

class TestUserAuth:
    # TODO: Add add occupied and recommend 

    @pytest.fixture
    def auth_client(self):
        return BaseRequest("/api/userauth")

    @pytest.fixture
    def auth_log_body(self):
        return {
            "LoginOrEmail": "CHANGE-ME",
            "EncodedPassword": "hashed_password"
        }

    @pytest.fixture
    def auth_reg_body(self):
        return {
            "FirstName": "Test",
            "LastName": "Testovic",
            "AddressId": 3,
            "Email": "example@example.com",
            "PhoneNumber": "+420 732 123 545",
            "Password": "samplePass",
            "Login": "tester"
        }

    def test_login(self, auth_client, auth_log_body):
        headers = {'Content-type': 'application/json'}
        auth_client.conn.request("POST",f'{auth_client.endpoint}/login', json.dumps(auth_log_body), headers) 
        response = auth_client.conn.getresponse()
        assert response.status == 200

    def test_register(self, auth_client, auth_reg_body):
        headers = {'Content-type': 'application/json'}
        auth_client.conn.request("POST",f'{auth_client.endpoint}/register', json.dumps(auth_reg_body), headers) 
        response = auth_client.conn.getresponse()
        assert response.status == 200

