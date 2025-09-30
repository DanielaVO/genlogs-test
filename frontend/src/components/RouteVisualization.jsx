import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TimelineIcon from "@mui/icons-material/Timeline";
import { ListItemIcon, Chip } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  overflow: "hidden",
};

export default function RouteVisualization({ from, to }) {
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (from && to && isLoaded) {
      const service = new window.google.maps.DirectionsService();
      service.route(
        {
          origin: from,
          destination: to,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
        },
        (result, status) => {
          if (status === "OK" && result.routes.length > 0) {
            setRoutes(result.routes.slice(0, 3));
          } else {
            setError("No routes found");
          }
        }
      );
    }
  }, [from, to, isLoaded]);

  if (!from || !to) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Route Visualization
      </Typography>

      {!isLoaded ? (
        <Typography variant="body2" color="text.secondary">
          Loading map...
        </Typography>
      ) : error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : (
        <>
          {/* Map */}
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: 39.5, lng: -98.35 }}
            zoom={5}
          >
            {routes.map((route, idx) => (
              <DirectionsRenderer
                key={idx}
                directions={{ routes: [route], request: {} }}
                options={{
                  polylineOptions: {
                    strokeColor: idx === 0 ? "blue" : idx === 1 ? "green" : "orange",
                    strokeOpacity: 0.7,
                    strokeWeight: 5,
                  },
                  suppressMarkers: false,
                }}
              />
            ))}
          </GoogleMap>

          {/* Routes */}
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Available Routes
            </Typography>
            <List>
              {routes.map((route, idx) => {
                const leg = route.legs[0];
                const icons = [<RouteIcon />, <DirectionsCarIcon />, <TimelineIcon />];
                const colors = ["primary", "success", "warning"];
                return (
                  <React.Fragment key={idx}>
                    <ListItem
                      sx={{
                        mb: 2,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        backgroundColor: "#fff",
                        boxShadow: "0px 2px 5px rgba(0,0,0,0.05)",
                      }}
                    >
                      <ListItemIcon sx={{ color: colors[idx] }}>
                        {icons[idx]}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="bold" color={`${colors[idx]}.main`}>
                            Route {idx + 1}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                            <Chip label={leg.distance.text} size="small" color={colors[idx]} />
                            <Chip label={leg.duration.text} size="small" variant="outlined" />
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        </>
      )}
    </Paper>
  );
}
