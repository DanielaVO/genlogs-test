import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function CityAutocomplete({
  label,
  value,
  onChange,
  onValidChange,
}) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!value) {
      setOptions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: value,
        types: ["(cities)"],
        componentRestrictions: { country: "us" },
      },
      (predictions) => {
        if (predictions && predictions.length > 0) {
          setOptions(
            predictions.map((p) => ({
              label: p.description,
              placeId: p.place_id,
            }))
          );
        } else {
          setOptions([]);
          onValidChange?.(false);
        }
      }
    );
  }, [value]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label || ""}
      value={options.find((o) => o.label === value) || null}
      onChange={(event, newValue) => {
        if (newValue) {
          onChange(newValue.label);
          onValidChange?.(true);
        } else {
          onChange("");
          onValidChange?.(false);
        }
      }}
      onInputChange={(event, newValue) => {
        onChange(newValue);
      }}
      noOptionsText="No cities found"
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
