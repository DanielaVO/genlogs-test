import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function CarriersList({ carriers, from, to }) {
  if (!carriers || carriers.length === 0) {
    return (
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No Results Yet — Search for a route to see active carriers
        </Typography>
      </Box>
    );
  }

  const total = carriers.reduce((sum, c) => sum + c.trucks_per_day, 0);
  const avg = (total / carriers.length).toFixed(1);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Active Carriers
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Route: {from} → {to}
      </Typography>

      <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h4">{total}</Typography>
            <Typography color="text.secondary">Total Trucks/Day</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h4">{avg}</Typography>
            <Typography color="text.secondary">Avg per Carrier</Typography>
          </CardContent>
        </Card>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        {carriers.map((c, i) => (
          <Card key={i} variant="outlined">
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  #{i + 1} {c.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Route
                </Typography>
              </Box>
              <Chip
                icon={<LocalShippingIcon />}
                label={`${c.trucks_per_day} trucks/day`}
                color={c.trucks_per_day > 8 ? "success" : "warning"}
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
