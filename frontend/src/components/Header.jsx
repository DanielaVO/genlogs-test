import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Branding */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Genlogs
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Truck Carrier Tracking
            </Typography>
          </Box>
        </Box>

        {/* Right text */}
        <Typography variant="body2" color="text.secondary">
          Every Truck. Every Shipper. Every Lane.
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
