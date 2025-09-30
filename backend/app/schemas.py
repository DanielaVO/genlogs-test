from pydantic import BaseModel
from typing import List

class Truck(BaseModel):
    id: int
    driver: str
    plate: str
    status: str
    logo: str
    capacity_tons: int

class Carrier(BaseModel):
    name: str
    trucks_per_day: int
    logo: str
    trucks: List[Truck]

class SearchRequest(BaseModel):
    from_city: str
    to_city: str

class SearchResponse(BaseModel):
    from_city: str
    to_city: str
    carriers: List[Carrier]