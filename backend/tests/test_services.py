import unittest
from unittest.mock import patch, MagicMock
from app import services

class TestServices(unittest.TestCase):

    @patch('random.choice')
    @patch('random.randint')
    def test_generate_truck_data(self, mock_randint, mock_choice):
        """
        Prueba que generate_truck_data genere correctamente los datos de un camión.
        """
        # Configuración de los mocks para obtener resultados predecibles
        mock_randint.return_value = 1234
        # Hacemos que choice devuelva valores específicos en orden
        mock_choice.side_effect = ["On Route", 15]

        truck_id = 1
        logo_url = "http://example.com/logo.png"
        
        expected_data = {
            "id": 1,
            "driver": "Driver 1",
            "plate": "ABC-1234",
            "status": "On Route",
            "logo": logo_url,
            "capacity_tons": 15
        }

        result = services.generate_truck_data(truck_id, logo_url)
        
        self.assertEqual(result, expected_data)
        mock_randint.assert_called_once_with(1000, 9999)
        self.assertEqual(mock_choice.call_count, 2)

    @patch('app.services.generate_truck_data')
    def test_generate_trucks_lazy(self, mock_generate_truck_data):
        """
        Prueba que generate_trucks_lazy genere una lista de camiones.
        """
        # Hacemos que la función mockeada devuelva un valor simple para verificar
        mock_generate_truck_data.return_value = {"id": 1, "driver": "Test Driver"}
        
        count = 5
        logo_url = "http://example.com/logo.png"
        
        result = services.generate_trucks_lazy(count, logo_url)
        
        # Verificamos que se haya llamado 'count' veces
        self.assertEqual(len(result), count)
        self.assertEqual(mock_generate_truck_data.call_count, count)
        # Verificamos que se llamó con los argumentos correctos en la última llamada
        mock_generate_truck_data.assert_called_with(count, logo_url)

    def test_normalize_city_input(self):
        """
        Prueba la normalización de los nombres de ciudades.
        """
        self.assertEqual(services._normalize_city_input("  New York  "), "new york")
        self.assertEqual(services._normalize_city_input("San Francisco"), "san francisco")
        self.assertEqual(services._normalize_city_input("LA"), "la")

    def test_get_route_config(self):
        """
        Prueba la obtención de configuración de rutas, incluyendo la bidireccionalidad.
        """
        # Ruta conocida
        route_1 = services._get_route_config("NYC", "Washington")
        self.assertIsNotNone(route_1)
        self.assertEqual(route_1[0]["name"], "Knight-Swift Transport Services")

        # Misma ruta, pero invertida
        route_2 = services._get_route_config("Washington", "NYC")
        self.assertEqual(route_1, route_2)

        # Ruta con mayúsculas/minúsculas y espacios
        route_3 = services._get_route_config("  san francisco ", "la")
        self.assertIsNotNone(route_3)
        self.assertEqual(route_3[0]["name"], "XPO Logistics")

        # Ruta no existente
        unknown_route = services._get_route_config("Boston", "Miami")
        self.assertIsNone(unknown_route)

    @patch('app.services.generate_trucks_lazy')
    def test_get_carriers_known_route(self, mock_generate_trucks):
        """
        Prueba get_carriers para una ruta conocida.
        """
        mock_generate_trucks.return_value = [{"id": 1, "status": "On Route"}]
        
        carriers = services.get_carriers("NYC", "WDC")
        
        self.assertEqual(len(carriers), 3)
        self.assertEqual(carriers[0]["name"], "Knight-Swift Transport Services")
        # Verifica que se haya añadido la clave 'trucks'
        self.assertIn("trucks", carriers[0])
        self.assertEqual(carriers[0]["trucks"], mock_generate_trucks.return_value)
        # Verifica que se llamó para cada carrier en la ruta
        self.assertEqual(mock_generate_trucks.call_count, 3)

    @patch('app.services.generate_trucks_lazy')
    def test_get_carriers_unknown_route(self, mock_generate_trucks):
        """
        Prueba get_carriers para una ruta desconocida, esperando los carriers por defecto.
        """
        mock_generate_trucks.return_value = [{"id": 1, "status": "Idle"}]
        
        carriers = services.get_carriers("Unknown", "City")
        
        self.assertEqual(len(carriers), len(services.DEFAULT_CARRIERS))
        self.assertEqual(carriers[0]["name"], "UPS Inc.")
        self.assertIn("trucks", carriers[0])
        self.assertEqual(mock_generate_trucks.call_count, len(services.DEFAULT_CARRIERS))

if __name__ == '__main__':
    unittest.main()