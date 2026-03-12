import { useState } from "react";
import "./BookingForm.css";

export default function BookingForm({ accommodations, onCalculate }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [accommodation, setAccommodation] = useState("suiteJardim");
  const [adults, setAdults] = useState(2);

  function handleSubmit(event) {
    event.preventDefault();

    onCalculate({
      checkIn,
      checkOut,
      accommodation,
      adults: Number(adults)
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field full">
          <label className="label">Acomodação</label>
          <select
            className="select"
            value={accommodation}
            onChange={(e) => setAccommodation(e.target.value)}
          >
            {Object.entries(accommodations).map(([key, item]) => (
              <option key={key} value={key}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Check-in</label>
          <input
            className="input"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Check-out</label>
          <input
            className="input"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div className="field full">
          <label className="label">Número de adultos</label>
          <input
            className="input"
            type="number"
            min="1"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
          />
        </div>
      </div>

      <button className="button" type="submit">
        Calcular valor da estadia
      </button>
    </form>
  );
}