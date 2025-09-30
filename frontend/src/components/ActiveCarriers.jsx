import React from "react";
import {
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Collapse,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function ActiveCarriers({ carriers }) {
  const [expanded, setExpanded] = React.useState(null);

  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const hasResults = carriers && carriers.length > 0;
  const totalTrucks = carriers.reduce((acc, c) => acc + c.trucks_per_day, 0);
  const avgPerCarrier = hasResults ? Math.round(totalTrucks / carriers.length) : 0;

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
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PeopleAltIcon color="action" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Active Carriers
        </Typography>
      </Box>

      {!hasResults ? (
        <Box textAlign="center" color="text.secondary" py={6}>
          <PeopleAltIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="subtitle1">No Results Yet</Typography>
          <Typography variant="body2">
            Search for a route to see active carriers
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {totalTrucks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Trucks/Day
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {avgPerCarrier}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg per Carrier
              </Typography>
            </Box>
            <Box>
              <Chip
                label={`${carriers.length} carriers found`}
                size="small"
              />
            </Box>
          </Box>

          <Divider />

          <Box sx={{ mt: 3 }}>
            {carriers.map((carrier, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{ mb: 2, borderRadius: 2 }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={carrier.logo}>
                        <LocalShippingIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {carrier.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {carrier.trucks_per_day} trucks/day
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={() => handleToggle(index)}>
                      {expanded === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                    <List dense sx={{ mt: 2 }}>
                      {carrier.trucks.map((truck) => (
                        <ListItem key={truck.id}>
                          <ListItemAvatar>
                            <Avatar src={truck.logo}>
                              <LocalShippingIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`Truck ${truck.id} • Plate: ${truck.plate}`}
                            secondary={`Driver: ${truck.driver} | Capacity: ${truck.capacity_tons} tons | Status: ${truck.status}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}
