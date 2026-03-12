import { useState } from "react";
import { calculateTarifario } from "../services/calculateTarifario";
import { accommodations } from "../data/accommodations";

export function useTarifario() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);

  function calculate(data) {
    try {
      const accommodation = accommodations[data.accommodation];

      const result = calculateTarifario({
        ...data,
        accommodation
      });

      setSelectedAccommodation(accommodation);
      setResult(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  }

  return {
    result,
    error,
    selectedAccommodation,
    calculate
  };
}