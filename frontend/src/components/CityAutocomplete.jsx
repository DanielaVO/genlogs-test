import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function CityAutocomplete({
  label,
  value,
  onChange,
  fullWidth,
}) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!value) return;

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: value,
        types: ["(cities)"],
        componentRestrictions: { country: "us" },
      },
      (predictions) => {
        if (predictions) {
          setOptions(
            predictions.map((p) => ({
              label: p.description,
              placeId: p.place_id,
            }))
          );
        }
      }
    );
  }, [value]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => option.label || ""}
      inputValue={value}
      onInputChange={(e, newValue) => onChange(newValue)}
      fullWidth={fullWidth}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={`Enter ${label.toLowerCase()}...`}
          size="small"
          fullWidth
        />
      )}
    />
  );
}
