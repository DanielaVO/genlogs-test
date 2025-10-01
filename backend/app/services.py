import random
from typing import Any, Dict, List, Union

ROUTE_CONFIG = {
    "NYC-WDC": {
        "cities": [
            lambda val: "new york" in val or "nyc" in val,
            lambda val: "washington" in val,
        ],
        "carriers": [
            {
                "name": "Knight-Swift Transport Services",
                "trucks_per_day": 10,
                "logo": "https://logo.clearbit.com/knight-swift.com",
            },
            {
                "name": "J.B. Hunt Transport Services Inc",
                "trucks_per_day": 7,
                "logo": "https://logo.clearbit.com/jbhunt.com",
            },
            {
                "name": "YRC Worldwide",
                "trucks_per_day": 5,
                "logo": "https://logo.clearbit.com/yrcw.com",
            },
        ],
    },
    "SF-LA": {
        "cities": [
            lambda val: "san francisco" in val or val == "sf",
            lambda val: "los angeles" in val or val == "la",
        ],
        "carriers": [
            {
                "name": "XPO Logistics",
                "trucks_per_day": 9,
                "logo": "https://logo.clearbit.com/xpo.com",
            },
            {
                "name": "Schneider",
                "trucks_per_day": 6,
                "logo": "https://logo.clearbit.com/schneider.com",
            },
            {
                "name": "Landstar Systems",
                "trucks_per_day": 2,
                "logo": "https://logo.clearbit.com/landstar.com",
            },
        ],
    },
}

DEFAULT_CARRIERS = [
    {
        "name": "UPS Inc.",
        "trucks_per_day": 11,
        "logo": "https://logo.clearbit.com/ups.com",
    },
    {
        "name": "FedEx Corp",
        "trucks_per_day": 9,
        "logo": "https://logo.clearbit.com/fedex.com",
    },
]

TRUCK_STATUSES = ["On Route", "Idle", "Maintenance"]
TRUCK_CAPACITIES = [10, 15, 20]


def generate_truck_data(truck_id: int, logo_url: str) -> Dict[str, Any]:
    """
    Generates a single dictionary of data for a truck.

    Args:
        truck_id: The unique identifier for the truck.
        logo_url: The URL of the carrier's logo.

    Returns:
        A dictionary containing the simulated truck properties.
    """
    plate_number = f"ABC-{random.randint(1000, 9999)}"
    return {
        "id": truck_id,
        "driver": f"Driver {truck_id}",
        "plate": plate_number,
        "status": random.choice(TRUCK_STATUSES),
        "logo": logo_url,
        "capacity_tons": random.choice(TRUCK_CAPACITIES),
    }


def generate_trucks_lazy(count: int, logo_url: str) -> List[Dict[str, Any]]:
    """
    Generates a list of truck data using a list comprehension for efficiency.

    Args:
        count: The number of trucks to generate.
        logo_url: The logo URL to assign to all generated trucks.

    Returns:
        A list of dictionaries, where each dictionary represents a truck.
    """
    return [generate_truck_data(i, logo_url) for i in range(1, count + 1)]


def _normalize_city_input(city: str) -> str:
    """
    Normalizes the city input (strips whitespace and converts to lowercase)
    for consistent comparison against route configuration predicates.
    """
    return city.strip().lower()


def _get_route_config(
    from_city: str, to_city: str
) -> Union[List[Dict[str, Any]], None]:
    """
    Searches for the carrier configuration for a given route in ROUTE_CONFIG.

    The check is bidirectional (A->B or B->A).

    Args:
        from_city: The starting city name.
        to_city: The destination city name.

    Returns:
        A list of carrier dictionaries for the matched route, or None if no specific
        configuration is found.
    """
    f = _normalize_city_input(from_city)
    t = _normalize_city_input(to_city)

    for config in ROUTE_CONFIG.values():
        city_a_check, city_b_check = config["cities"]

        if (city_a_check(f) and city_b_check(t)) or (
            city_a_check(t) and city_b_check(f)
        ):
            return config["carriers"]

    return None


def get_carriers(from_city: str, to_city: str) -> List[Dict[str, Any]]:
    """
    Retrieves the available carriers for a specific route and generates
    simulated data for their active trucks.

    Args:
        from_city: The starting city name.
        to_city: The destination city name.

    Returns:
        A list of carrier dictionaries, each including a 'trucks' key
        with a list of generated truck data.
    """
    carriers_data = _get_route_config(from_city, to_city)

    if carriers_data is None:
        carriers = DEFAULT_CARRIERS
    else:
        carriers = carriers_data.copy()

    for carrier in carriers:
        truck_count = carrier.get("trucks_per_day", 0)
        logo = carrier.get("logo", "")

        carrier["trucks"] = generate_trucks_lazy(truck_count, logo)

    return carriers
