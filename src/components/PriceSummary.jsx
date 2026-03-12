import { formatCurrency } from "../utils/formatCurrency";
import "./PriceSummary.css";

export default function PriceSummary({ result, accommodation }) {
  if (!result || !accommodation) return null;

  return (
    <section className="summary">
      <div className="summary-header">
        <h2>{accommodation.name}</h2>
        <p>Resumo da simulação da reserva</p>
      </div>

      <div className="summary-list">
        <div className="summary-item">
          <span>Número de noites</span>
          <strong>{result.nights}</strong>
        </div>

        <div className="summary-item">
          <span>Valor das diárias</span>
          <strong>{formatCurrency(result.dailyTotal)}</strong>
        </div>

        <div className="summary-item">
          <span>Taxa de limpeza</span>
          <strong>{formatCurrency(result.cleaningFee)}</strong>
        </div>
      </div>

      <div className="summary-total">
        <span>Total final</span>
        <span>{formatCurrency(result.total)}</span>
      </div>
    </section>
  );
}