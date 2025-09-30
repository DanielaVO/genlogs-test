import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../Header";

// Mock del ícono de Material-UI para evitar errores en el entorno de prueba
jest.mock("@mui/icons-material/LocalShipping", () => () => (
  <div data-testid="shipping-icon" />
));

describe("Header Component", () => {
  test("renderiza el branding y el texto correctamente", () => {
    render(<Header />);

    // Verificar el branding principal
    expect(screen.getByText("Genlogs")).toBeInTheDocument();
    expect(screen.getByText("Truck Carrier Tracking")).toBeInTheDocument();

    // Verificar el ícono (a través de su data-testid del mock)
    expect(screen.getByTestId("shipping-icon")).toBeInTheDocument();

    // Verificar el texto a la derecha
    expect(screen.getByText("Every Truck. Every Shipper. Every Lane.")).toBeInTheDocument();
  });
});