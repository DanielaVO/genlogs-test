import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CityAutocomplete from "./CityAutocomplete";

export default function SearchForm({ onSearch, onClear }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (from.trim() && to.trim()) {
      onSearch({ from, to });
    }
  };

  useEffect(() => {
    if (!from.trim() && !to.trim()) {
      onClear?.();
    }
  }, [from, to]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mt: 4,
        mb: 4,
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "center" }}>
        <SearchIcon color="action" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Route Search
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Find carriers and optimal routes between any two cities
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <CityAutocomplete label="From City" value={from} onChange={setFrom} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CityAutocomplete label="To City" value={to} onChange={setTo} />
        </Grid>
      </Grid>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            size="medium"
            startIcon={<SearchIcon />}
            disabled={!from.trim() || !to.trim()}
            sx={{ px: 3, py: 1, borderRadius: 2 }}
          >
            Search Routes & Carriers
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
