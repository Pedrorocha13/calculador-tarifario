import BookingForm from "./components/BookingForm";
import PriceSummary from "./components/PriceSummary";
import { accommodations } from "./data/accommodations";
import { useTarifario } from "./hooks/useTarifario";
import "./App.css";

function App() {
  const { result, error, selectedAccommodation, calculate } = useTarifario();

  return (
    <main className="app">
      <section className="hero">
        <span className="badge">Hospedin Challenge</span>
        <h1>Calculadora de Tarifário</h1>
        <p>
          Simule o valor total de uma reserva com base nas regras de hospedagem.
        </p>
      </section>

      <section className="content">
        <div className="card">
          <BookingForm
            accommodations={accommodations}
            onCalculate={calculate}
          />
        </div>

        {error && (
          <div className="feedback error">
            {error}
          </div>
        )}

        {result && selectedAccommodation && (
          <div className="card">
            <PriceSummary
              result={result}
              accommodation={selectedAccommodation}
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default App;