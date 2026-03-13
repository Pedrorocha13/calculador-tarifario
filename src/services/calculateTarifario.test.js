import { describe, it, expect } from "vitest";
import { calculateTarifario } from "./calculateTarifario";

const suiteJardim = {
  name: "Suíte Jardim",
  basePrice: 300,
  minNights: 2,
  cleaningFee: 80,
};

const chaleFamilia = {
  name: "Chalé Família",
  basePrice: 450,
  minNights: 2,
  cleaningFee: 100,
};

describe("calculateTarifario - validações", () => {
  it("lança erro quando check-in está ausente", () => {
    expect(() =>
      calculateTarifario({ checkIn: "", checkOut: "2026-03-18", accommodation: suiteJardim })
    ).toThrow("Informe check-in e check-out.");
  });

  it("lança erro quando check-out está ausente", () => {
    expect(() =>
      calculateTarifario({ checkIn: "2026-03-16", checkOut: "", accommodation: suiteJardim })
    ).toThrow("Informe check-in e check-out.");
  });

  it("lança erro quando acomodação é inválida", () => {
    expect(() =>
      calculateTarifario({ checkIn: "2026-03-16", checkOut: "2026-03-18", accommodation: null })
    ).toThrow("Acomodação inválida.");
  });

  it("lança erro quando check-out é antes do check-in", () => {
    expect(() =>
      calculateTarifario({ checkIn: "2026-03-18", checkOut: "2026-03-16", accommodation: suiteJardim })
    ).toThrow("Check-out deve ser após o check-in.");
  });

  it("lança erro quando estadia é menor que o mínimo", () => {
    // 1 noite, mínimo é 2
    expect(() =>
      calculateTarifario({ checkIn: "2026-03-16", checkOut: "2026-03-17", accommodation: suiteJardim })
    ).toThrow("Estadia mínima de 2 noites.");
  });
});

describe("calculateTarifario – dias de semana (sem acréscimo)", () => {
  it("calcula corretamente 2 noites em dias úteis na Suíte Jardim", () => {
    // Seg 16/03 → Qua 18/03 = 2 noites (Seg e Ter)
    const result = calculateTarifario({
      checkIn: "2026-03-16",
      checkOut: "2026-03-18",
      accommodation: suiteJardim,
    });

    expect(result.nights).toBe(2);
    expect(result.dailyRate).toBe(300);
    expect(result.dailyTotal).toBe(600);
    expect(result.cleaningFee).toBe(80);
    expect(result.total).toBe(680);
  });

  it("calcula corretamente 2 noites em dias úteis no Chalé Família", () => {
    const result = calculateTarifario({
      checkIn: "2026-03-16",
      checkOut: "2026-03-18",
      accommodation: chaleFamilia,
    });

    expect(result.nights).toBe(2);
    expect(result.dailyRate).toBe(450);
    expect(result.dailyTotal).toBe(900);
    expect(result.cleaningFee).toBe(100);
    expect(result.total).toBe(1000);
  });
});

describe("calculateTarifario – acréscimo de fim de semana (20%)", () => {
  it("aplica +20% em noites de sábado e domingo", () => {
    // Sáb 14/03 → Seg 16/03 = 2 noites (Sáb + Dom)
    const result = calculateTarifario({
      checkIn: "2026-03-14",
      checkOut: "2026-03-16",
      accommodation: suiteJardim,
    });

    // Sáb: 300 * 1.2 = 360, Dom: 300 * 1.2 = 360
    expect(result.dailyTotal).toBe(720);
    expect(result.total).toBe(800); // 720 + 80
  });

  it("aplica acréscimo apenas nas noites de fim de semana em estadia mista", () => {
    // Sex 13/03 → Seg 16/03 = 3 noites (Sex + Sáb + Dom)
    // Sex: 300, Sáb: 360, Dom: 360
    const result = calculateTarifario({
      checkIn: "2026-03-13",
      checkOut: "2026-03-16",
      accommodation: suiteJardim,
    });

    expect(result.dailyTotal).toBe(1020); // 300 + 360 + 360
    expect(result.total).toBe(1100); // 1020 + 80
  });
});

describe("calculateTarifario – desconto de 10% para estadia acima de 7 noites", () => {
  it("aplica 10% de desconto em estadia de 8 noites", () => {
    // Seg 16/03 → Ter 24/03 = 8 noites, todas úteis
    const result = calculateTarifario({
      checkIn: "2026-03-16",
      checkOut: "2026-03-24",
      accommodation: suiteJardim,
    });

    expect(result.nights).toBe(8);
    // 8 × 300 = 2400 (Seg a Seg, passando pelo fim de semana 21/22)
    // 21/03 Sáb: 360, 22/03 Dom: 360 → 6×300 + 2×360 = 1800 + 720 = 2520
    // total antes do desconto: 2520 + 80 = 2600
    // com 10%: 2600 * 0.9 = 2340
    expect(result.discountApplied).toBe(true);
    expect(result.discountAmount).toBeCloseTo(260, 2);
    expect(result.total).toBeCloseTo(2340, 2);
  });

  it("não aplica desconto em estadia de exatamente 7 noites", () => {
    // Seg 16/03 → Seg 23/03 = 7 noites
    const result = calculateTarifario({
      checkIn: "2026-03-16",
      checkOut: "2026-03-23",
      accommodation: suiteJardim,
    });

    expect(result.nights).toBe(7);
    // 16(Seg)+17(Ter)+18(Qua)+19(Qui)+20(Sex)+21(Sáb 360)+22(Dom 360)
    // = 5×300 + 2×360 = 1500 + 720 = 2220
    // sem desconto: 2220 + 80 = 2300
    expect(result.discountApplied).toBe(false);
    expect(result.discountAmount).toBe(0);
    expect(result.total).toBe(2300);
  });
});
