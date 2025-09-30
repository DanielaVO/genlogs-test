import unittest
from unittest.mock import patch
import io
from fastapi.testclient import TestClient
from app.main import app

class TestMainAPI(unittest.TestCase):

    def setUp(self):
        """Sets up the test client before each test."""
        self.client = TestClient(app)

    def test_health_check(self):
        """
        Tests that the /health endpoint works correctly.
        """
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "service": "Genlogs Logistics Search API"})

    def test_search_routes_missing_payload_fields(self):
        """
        Tests the dependency validation: it should fail if fields are missing.
        """
        response_1 = self.client.post("/v1/search", json={"from_city": "NYC"})
        self.assertEqual(response_1.status_code, 422)

        response_2 = self.client.post("/v1/search", json={"from_city": "", "to_city": "WDC"})
        self.assertEqual(response_2.status_code, 400)
        self.assertEqual(response_2.json()["detail"], "The 'from_city' and 'to_city' fields are required for the search.")

    @patch('app.main.get_carriers')
    def test_search_routes_success(self, mock_get_carriers):
        """
        Tests a success case for the /v1/search endpoint.
        """
        mock_carriers_data = [
            {
                "name": "Test Carrier",
                "trucks_per_day": 5,
                "logo": "http://example.com/logo.png",
                "trucks": [
                    {"id": 1, "driver": "Driver 1", "plate": "ABC-1234", "status": "On Route", "logo": "http://example.com/logo.png", "capacity_tons": 15}
                ]
            }
        ]
        mock_get_carriers.return_value = mock_carriers_data
        
        payload = {"from_city": "New York", "to_city": "Washington"}
        response = self.client.post("/v1/search", json=payload)
  
        self.assertEqual(response.status_code, 200)
        mock_get_carriers.assert_called_once_with("New York", "Washington")
        
        response_data = response.json()
        self.assertEqual(response_data["from_city"], "New York")
        self.assertEqual(response_data["to_city"], "Washington")
        self.assertEqual(response_data["carriers"], mock_carriers_data)

    @patch('app.main.get_carriers')
    def test_search_routes_internal_error(self, mock_get_carriers):
        """
        Tests the handling of 500 errors in the /v1/search endpoint.
        """
        mock_get_carriers.side_effect = Exception("Database connection failed")

        with patch('sys.stdout', new_callable=io.StringIO):
            payload = {"from_city": "New York", "to_city": "Washington"}
            response = self.client.post("/v1/search", json=payload)

            self.assertEqual(response.status_code, 500)
            self.assertEqual(response.json()["detail"], "An unexpected error occurred while processing the request.")

if __name__ == '__main__':
    unittest.main()