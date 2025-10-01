import React, { useState, useCallback } from "react";
import { Container, Typography, Box } from "@mui/material";
import SearchForm from "./components/SearchForm";
import Header from "./components/Header";
import RouteVisualization from "./components/RouteVisualization";
import ActiveCarriers from "./components/ActiveCarriers";
import { searchRoutes } from "./services/api";

export default function App() {
  const [routeQuery, setRouteQuery] = useState(null);
  const [carriers, setCarriers] = useState([]);

  const handleSearch = async ({ from, to }) => {
    setRouteQuery({ from, to });
    try {
      const data = await searchRoutes(from, to);
      setCarriers(data.carriers || []);
    } catch (err) {
      console.error("Error fetching carriers:", err);
    }
  };

  const handleClear = useCallback(() => {
    setRouteQuery(null);
    setCarriers([]);
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Move Freight on Cheat Mode
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Freight Intelligence on every carrier, shipper, and asset via a
            nationwide sensor network
          </Typography>
        </Box>

        <SearchForm onSearch={handleSearch} onClear={handleClear} />

        <RouteVisualization from={routeQuery?.from} to={routeQuery?.to} />

        {carriers.length > 0 && routeQuery && (
          <ActiveCarriers
            carriers={carriers}
            from={routeQuery?.from}
            to={routeQuery?.to}
          />
        )}
      </Container>
    </>
  );
}
