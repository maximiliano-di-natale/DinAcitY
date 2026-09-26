// Servicio de Financiación y Planes de Cuotas en Argentina
// Permite desglosar cuotas y calcular Pago Dividido con 2 tarjetas o medios de pago

export class FinancingService {
  constructor() {
    // Tasas de referencia habituales en el mercado argentino (Cuota Simple y bancarias)
    this.rates = {
      1: { coefficient: 1.0, label: 'Contado / Débito / Transferencia', note: 'Precio publicado sin recargo' },
      3: { coefficient: 1.14, label: '3 Cuotas fijas', note: 'Planes Cuota Simple / Bancarios' },
      6: { coefficient: 1.28, label: '6 Cuotas fijas', note: 'Tarjetas Visa / Mastercard bancarias' },
      9: { coefficient: 1.45, label: '9 Cuotas fijas', note: 'Financiación bancaria' },
      12: { coefficient: 1.62, label: '12 Cuotas fijas', note: 'Tarjetas bancarias / Naranja X' }
    };
  }

  // Calcula tabla de cuotas para un monto dado
  calculateInstallments(amount) {
    const total = Number(amount) || 0;
    if (total <= 0) return [];

    return Object.entries(this.rates).map(([installmentsCount, data]) => {
      const count = Number(installmentsCount);
      const totalFinanced = Math.round(total * data.coefficient);
      const installmentAmount = Math.round(totalFinanced / count);

      return {
        installments: count,
        installmentAmount: installmentAmount,
        totalFinanced: totalFinanced,
        label: data.label,
        note: data.note,
        interestFree: count === 1
      };
    });
  }

  // Simula Pago Dividido con 2 tarjetas o Tarjeta + Efectivo
  simulateSplitPayment({ totalPrice, card1Amount, card1Installments = 1, card2Installments = 6 }) {
    const total = Math.max(0, Number(totalPrice) || 0);
    const c1Amount = Math.min(total, Math.max(0, Number(card1Amount) || Math.round(total / 2)));
    const c2Amount = Math.max(0, total - c1Amount);

    const c1Rate = this.rates[card1Installments] || this.rates[1];
    const c2Rate = this.rates[card2Installments] || this.rates[6];

    const c1TotalFinanced = Math.round(c1Amount * c1Rate.coefficient);
    const c1InstallmentValue = Math.round(c1TotalFinanced / card1Installments);

    const c2TotalFinanced = Math.round(c2Amount * c2Rate.coefficient);
    const c2InstallmentValue = Math.round(c2TotalFinanced / card2Installments);

    return {
      totalOriginalPrice: total,
      card1: {
        amountOriginal: c1Amount,
        installments: Number(card1Installments),
        installmentAmount: c1InstallmentValue,
        totalFinanced: c1TotalFinanced
      },
      card2: {
        amountOriginal: c2Amount,
        installments: Number(card2Installments),
        installmentAmount: c2InstallmentValue,
        totalFinanced: c2TotalFinanced
      },
      combinedTotalFinanced: c1TotalFinanced + c2TotalFinanced
    };
  }
}
