from fastapi import APIRouter, Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import SearchRequest, SearchResponse
from app.services import get_carriers

app = FastAPI(
    title="Genlogs Logistics Search API",
    version="1.0.0",
    description="API for fetching logistics carriers and truck data based on specified routes.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

search_router = APIRouter(
    prefix="/v1",
    tags=["Logistics Search"],
    responses={404: {"description": "Not found"}},
)


def validate_search_payload(payload: SearchRequest):
    """
    Dependency that validates the search payload before processing.
    Ensures that both cities are provided.
    """
    if not payload.from_city or not payload.to_city:
        raise HTTPException(
            status_code=400,
            detail="The 'from_city' and 'to_city' fields are required for the search.",
        )
    return payload


@app.get("/health", tags=["System"])
def health():
    """Simple endpoint to verify if the API is running."""
    return {"status": "ok", "service": app.title}


@search_router.post("/search", response_model=SearchResponse)
def search_routes(payload: SearchRequest = Depends(validate_search_payload)):
    """
    ## Search Active Carriers Between Two Cities

    Retrieves a list of available carriers that service the specified route,
    including dynamically generated data for their active trucks.

    **Path:** `/v1/search`

    **Inputs:**
    - `from_city`: The departure city (e.g., "New York").
    - `to_city`: The destination city (e.g., "Washington D.C.").

    **Returns:** A structured JSON object containing the route details and the list of carriers.
    """
    try:
        carriers_data = get_carriers(payload.from_city, payload.to_city)

        print(
            f"INFO: Found {len(carriers_data)} carriers for route: {payload.from_city} -> {payload.to_city}"
        )

        return SearchResponse(
            from_city=payload.from_city,
            to_city=payload.to_city,
            carriers=carriers_data,
        )

    except Exception as e:
        print(f"ERROR: An internal server error occurred during search: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing the request.",
        )


app.include_router(search_router)
