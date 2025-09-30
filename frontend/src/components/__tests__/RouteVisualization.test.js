import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import RouteVisualization from "../RouteVisualization";

jest.mock("@mui/icons-material/Route", () => () => <div data-testid="route-icon" />);
jest.mock("@mui/icons-material/DirectionsCar", () => () => <div data-testid="car-icon" />);
jest.mock("@mui/icons-material/Timeline", () => () => <div data-testid="timeline-icon" />);

const mockUseJsApiLoader = jest.fn();
jest.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => mockUseJsApiLoader(),
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  DirectionsRenderer: () => <div data-testid="directions-renderer" />,
}));

const mockRoute = jest.fn();
beforeEach(() => {
  mockUseJsApiLoader.mockReturnValue({ isLoaded: true });
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
  test("renders nothing if 'from' or 'to' props are missing", () => {
    const { container } = render(<RouteVisualization from="City A" />);
    expect(container.firstChild).toBeNull();
  });

  test("shows loading state while the API is not ready", () => {
    mockUseJsApiLoader.mockReturnValue({ isLoaded: false });
    render(<RouteVisualization from="City A" to="City B" />);

    expect(screen.getByText("Loading map...")).toBeInTheDocument();
    expect(screen.queryByTestId("google-map")).not.toBeInTheDocument();
  });

  test("shows an error if the Directions API finds no routes", async () => {
    mockUseJsApiLoader.mockReturnValue({ isLoaded: true });
    mockRoute.mockImplementation((request, callback) => {
      callback({ routes: [] }, "ZERO_RESULTS");
    });

    render(<RouteVisualization from="City A" to="City B" />);

    await waitFor(() => {
      expect(screen.getByText("No routes found")).toBeInTheDocument();
    });

    expect(mockRoute).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("google-map")).not.toBeInTheDocument();
  });

  test("renders the map and route list on a successful response", async () => {
    mockUseJsApiLoader.mockReturnValue({ isLoaded: true });
    mockRoute.mockImplementation((request, callback) => {
      callback(mockRoutesResult, "OK");
    });

    render(<RouteVisualization from="City A" to="City B" />);

    await waitFor(() => {
      expect(screen.getByTestId("google-map")).toBeInTheDocument();
      expect(screen.getAllByTestId("directions-renderer")).toHaveLength(
        mockRoutesResult.routes.length
      );
    });

    expect(screen.getByText("Available Routes")).toBeInTheDocument();

    const route1Item = screen.getByText("Route 1").closest("li");
    expect(route1Item).toBeInTheDocument();
    expect(within(route1Item).getByText("1,000 mi")).toBeInTheDocument();
    expect(within(route1Item).getByText("1 day 5 hours")).toBeInTheDocument();

    const route2Item = screen.getByText("Route 2").closest("li");
    expect(route2Item).toBeInTheDocument();
    expect(within(route2Item).getByText("1,050 mi")).toBeInTheDocument();
    expect(within(route2Item).getByText("1 day 7 hours")).toBeInTheDocument();

    expect(screen.getByTestId("route-icon")).toBeInTheDocument();
    expect(screen.getByTestId("car-icon")).toBeInTheDocument();
  });
});