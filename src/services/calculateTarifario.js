import { parseDate } from "../utils/parseDate";

export function calculateTarifario({ checkIn, checkOut, accommodation /*,adults*/ }) {
  if (!checkIn || !checkOut) {
    throw new Error("Informe check-in e check-out.");
  }

  if (!accommodation) {
    throw new Error("Acomodação inválida.");
  }
  /*
  if (!adults || adults < 1) {
    throw new Error("Informe pelo menos 1 adulto.");
  }
  */
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);

  const diffTime = end.getTime() - start.getTime();
  const nights = diffTime / (1000 * 60 * 60 * 24);

  if (nights <= 0) {
    throw new Error("Check-out deve ser após o check-in.");
  }

  if (nights < accommodation.minNights) {
    throw new Error(`Estadia mínima de ${accommodation.minNights} noites.`);
  }

  let dailyTotal = 0;

  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    const day = currentDate.getDay();
    const isWeekend = day === 0 || day === 6;

    let price = accommodation.basePrice;

    /*
    const extraAdults = Math.max(adults - accommodation.includedAdults, 0);
    const extraAdultsTotal = extraAdults * accommodation.extraAdultPrice;

    price += extraAdultsTotal;
    */

    if (isWeekend) {
      price *= 1.2;
    }

    dailyTotal += price;
  }

  const subtotal = dailyTotal + accommodation.cleaningFee;
  const discountApplied = nights > 7;
  const discountAmount = discountApplied ? subtotal * 0.1 : 0;
  const total = discountApplied ? subtotal * 0.9 : subtotal;

  return {
    nights,
    dailyRate: accommodation.basePrice,
    dailyTotal,
    cleaningFee: accommodation.cleaningFee,
    discountApplied,
    discountAmount,
    total,
  };
}