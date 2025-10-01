import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActiveCarriers from "../ActiveCarriers";

jest.mock("@mui/icons-material/PeopleAlt", () => () => (
  <div data-testid="people-icon" />
));
jest.mock("@mui/icons-material/LocalShipping", () => () => (
  <div data-testid="shipping-icon" />
));
jest.mock("@mui/icons-material/ExpandMore", () => () => (
  <div data-testid="expand-more-icon" />
));
jest.mock("@mui/icons-material/ExpandLess", () => () => (
  <div data-testid="expand-less-icon" />
));

const mockCarriers = [
  {
    name: "Carrier A",
    logo: "logoA.png",
    trucks_per_day: 15,
    trucks: [
      {
        id: 101,
        plate: "TRK-001",
        driver: "John Doe",
        capacity_tons: 20,
        status: "On-route",
        logo: "truck1.png",
      },
    ],
  },
  {
    name: "Carrier B",
    logo: "logoB.png",
    trucks_per_day: 10,
    trucks: [
      {
        id: 202,
        plate: "TRK-002",
        driver: "Jane Smith",
        capacity_tons: 25,
        status: "Available",
        logo: "truck2.png",
      },
    ],
  },
];

describe("ActiveCarriers Component", () => {
  test("shows 'No Results Yet' state when there are no carriers", () => {
    render(<ActiveCarriers carriers={[]} />);

    expect(screen.getByText("No Results Yet")).toBeInTheDocument();
    expect(
      screen.getByText("Search for a route to see active carriers")
    ).toBeInTheDocument();
    expect(screen.queryByText("Total Trucks/Day")).not.toBeInTheDocument();
  });

  test("renders the list of carriers and statistics correctly", () => {
    render(<ActiveCarriers carriers={mockCarriers} />);
    expect(screen.getByText("Active Carriers")).toBeInTheDocument();

    const totalTrucks = mockCarriers.reduce(
      (sum, c) => sum + c.trucks_per_day,
      0
    );
    const avgPerCarrier = Math.round(totalTrucks / mockCarriers.length);

    expect(screen.getByText(totalTrucks.toString())).toBeInTheDocument();
    expect(screen.getByText("Total Trucks/Day")).toBeInTheDocument();

    expect(screen.getByText(avgPerCarrier.toString())).toBeInTheDocument();
    expect(screen.getByText("Avg per Carrier")).toBeInTheDocument();

    expect(screen.getByText("2 carriers found")).toBeInTheDocument();
    expect(screen.getByText("Carrier A")).toBeInTheDocument();
    expect(screen.getByText("Carrier B")).toBeInTheDocument();
  });
  test("expands and collapses carrier details on click", async () => {
    render(<ActiveCarriers carriers={mockCarriers} />);

    expect(screen.queryByText(/Plate: TRK-001/)).not.toBeInTheDocument();
    const expandButtons = screen.getAllByRole("button");
    fireEvent.click(expandButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Plate: TRK-001/)).toBeInTheDocument();
      expect(
        screen.getByText(
          /Driver: John Doe | Capacity: 20 tons | Status: On-route/
        )
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/Plate: TRK-002/)).not.toBeInTheDocument();
    fireEvent.click(expandButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText(/Plate: TRK-001/)).not.toBeInTheDocument();
    });
  });
});
