import pytest
import requests
BASE_URL = "http://localhost:7000"


ENDPOINTS = [
    "/api/address",
    "/api/address/1",
    "/api/plan",
    "/api/plan/1",
    "/api/plan/1/machines",
    "/api/plan/1/types",
    "/api/machine",
    "/api/machine/1",
    "/api/reservation",
    "/api/reservation/1",
    "/api/account/1",
    "/api/account/clerk/user_2mcZZtJs0f4vZVWv8qIaqSLsoa4",
    "/api/exercise-type/",
    "/api/exercise-type/1",
    "/api/exercise-type/machine/1",

]

class TestGet:
    @pytest.mark.parametrize("endpoint", ENDPOINTS)
    def test_endpoint_status_2xx(self, endpoint):
        """
        Test that each endpoint returns a 2xx status code.
        """
        url = f"{BASE_URL}{endpoint}"
        print(url)
        response = requests.get(url)
        assert response.status_code >= 200 and response.status_code < 300, f"{url} returned {response.status_code}"

