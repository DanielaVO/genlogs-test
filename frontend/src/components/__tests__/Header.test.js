import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../Header";

jest.mock("@mui/icons-material/LocalShipping", () => () => (
  <div data-testid="shipping-icon" />
));

describe("Header Component", () => {
  test("renders the branding and text correctly", () => {
    render(<Header />);

    expect(screen.getByText("Genlogs")).toBeInTheDocument();
    expect(screen.getByText("Truck Carrier Tracking")).toBeInTheDocument();
    expect(screen.getByTestId("shipping-icon")).toBeInTheDocument();
    expect(
      screen.getByText("Every Truck. Every Shipper. Every Lane.")
    ).toBeInTheDocument();
  });
});
