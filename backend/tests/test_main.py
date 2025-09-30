import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app

class TestMainAPI(unittest.TestCase):

    def setUp(self):
        """Configura el cliente de prueba antes de cada test."""
        self.client = TestClient(app)

    def test_health_check(self):
        """
        Prueba que el endpoint /health funcione correctamente.
        """
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "service": "Genlogs Logistics Search API"})

    def test_search_routes_missing_payload_fields(self):
        """
        Prueba la validación de la dependencia: debe fallar si faltan campos.
        """
        # Caso 1: Falta 'to_city'
        response_1 = self.client.post("/v1/search", json={"from_city": "NYC"})
        self.assertEqual(response_1.status_code, 422) # FastAPI devuelve 422 para errores de validación de Pydantic

        # Caso 2: Campos vacíos
        response_2 = self.client.post("/v1/search", json={"from_city": "", "to_city": "WDC"})
        self.assertEqual(response_2.status_code, 400)
        self.assertEqual(response_2.json()["detail"], "The 'from_city' and 'to_city' fields are required for the search.")

    @patch('app.main.get_carriers')
    def test_search_routes_success(self, mock_get_carriers):
        """
        Prueba un caso de éxito para el endpoint /v1/search.
        """
        # Configuración del mock para simular la respuesta del servicio
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
        
        # Verificaciones
        self.assertEqual(response.status_code, 200)
        mock_get_carriers.assert_called_once_with("New York", "Washington")
        
        response_data = response.json()
        self.assertEqual(response_data["from_city"], "New York")
        self.assertEqual(response_data["to_city"], "Washington")
        self.assertEqual(response_data["carriers"], mock_carriers_data)

    @patch('app.main.get_carriers')
    def test_search_routes_internal_error(self, mock_get_carriers):
        """
        Prueba el manejo de errores 500 en el endpoint /v1/search.
        """
        # Configuramos el mock para que lance una excepción
        mock_get_carriers.side_effect = Exception("Database connection failed")
        
        payload = {"from_city": "New York", "to_city": "Washington"}
        response = self.client.post("/v1/search", json=payload)
        
        # Verificaciones
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json()["detail"], "An unexpected error occurred while processing the request.")

if __name__ == '__main__':
    unittest.main()