import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RouteVisualization from "../RouteVisualization";

// Mock de los íconos de Material-UI
jest.mock("@mui/icons-material/Route", () => () => <div data-testid="route-icon" />);
jest.mock("@mui/icons-material/DirectionsCar", () => () => <div data-testid="car-icon" />);
jest.mock("@mui/icons-material/Timeline", () => () => <div data-testid="timeline-icon" />);

// Mock del paquete @react-google-maps/api
const mockUseJsApiLoader = jest.fn();
jest.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => mockUseJsApiLoader(),
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  DirectionsRenderer: () => <div data-testid="directions-renderer" />,
}));

// Mock del servicio de direcciones de Google Maps
const mockRoute = jest.fn();
beforeAll(() => {
  global.window.google = {
    maps: {
      DirectionsService: jest.fn(() => ({
        route: mockRoute,
      })),
      TravelMode: {
        DRIVING: "DRIVING",
      },
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockRoutesResult = {
  routes: [
    {
      legs: [
        {
          distance: { text: "1,000 mi" },
          duration: { text: "1 day 5 hours" },
        },
      ],
    },
    {
      legs: [
        {
          distance: { text: "1,050 mi" },
          duration: { text: "1 day 7 hours" },
        },
      ],
    },
  ],
};

describe("RouteVisualization Component", () => {
  test("no renderiza nada si faltan las props 'from' o 'to'", () => {
    const { container } = render(<RouteVisualization from="City A" />);
    expect(container.firstChild).toBeNull();
  });

  test("muestra el estado de carga mientras la API no está lista", () => {
    mockUseJsApiLoader.mockReturnValue({ isLoaded: false });
    render(<RouteVisualization from="City A" to="City B" />);

    expect(screen.getByText("Loading map...")).toBeInTheDocument();
    expect(screen.queryByTestId("google-map")).not.toBeInTheDocument();
  });

  test("muestra un error si la API de direcciones no encuentra rutas", async () => {
    mockUseJsApiLoader.mockReturnValue({ isLoaded: true });
    mockRoute.mockImplementation((request, callback) => {
      callback({ routes: [] }, "ZERO_RESULTS");
    });

    render(<RouteVisualization from="City A" to="City B" />);

    // Esperamos a que el estado de error se actualice y se renderice
    await waitFor(() => {
      expect(screen.getByText("No routes found")).toBeInTheDocument();
    });

    expect(mockRoute).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("google-map")).not.toBeInTheDocument();
  });

  test("renderiza el mapa y la lista de rutas en una respuesta exitosa", async () => {
    mockUseJsApiLoader.mockReturnValue({ isLoaded: true });
    mockRoute.mockImplementation((request, callback) => {
      callback(mockRoutesResult, "OK");
    });

    render(<RouteVisualization from="City A" to="City B" />);

    // Esperamos a que el componente procese la respuesta de la API
    await waitFor(() => {
      // Verificar que el mapa y los renderizadores de direcciones se muestren
      expect(screen.getByTestId("google-map")).toBeInTheDocument();
      expect(screen.getAllByTestId("directions-renderer")).toHaveLength(
        mockRoutesResult.routes.length
      );
    });

    // Verificar que el título de la sección de rutas esté presente
    expect(screen.getByText("Available Routes")).toBeInTheDocument();

    // Verificar que los detalles de la primera ruta se muestren
    expect(screen.getByText("Route 1")).toBeInTheDocument();
    const route1Details = mockRoutesResult.routes[0].legs[0];
    expect(
      screen.getByText(
        (content, element) =>
          element.textContent ===
          `${route1Details.distance.text}${route1Details.duration.text}`
      )
    ).toBeInTheDocument();

    // Verificar que los detalles de la segunda ruta se muestren
    expect(screen.getByText("Route 2")).toBeInTheDocument();
    const route2Details = mockRoutesResult.routes[1].legs[0];
    expect(
      screen.getByText(
        (content, element) =>
          element.textContent ===
          `${route2Details.distance.text}${route2Details.duration.text}`
      )
    ).toBeInTheDocument();

    // Verificar que los íconos se rendericen
    expect(screen.getAllByTestId("route-icon")).toHaveLength(2);
  });
});