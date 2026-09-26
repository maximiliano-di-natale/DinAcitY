import React, { useState, useEffect } from 'react';
import { X, CreditCard, Split, CheckCircle2, Info, ArrowRight, ShieldCheck, Calculator } from 'lucide-react';

export function FinancingModal({ isOpen, onClose, item }) {
  const [activeTab, setActiveTab] = useState('installments'); // 'installments' | 'split'
  const [installments, setInstallments] = useState([]);
  const [splitData, setSplitData] = useState(null);
  
  const totalPrice = item?.totalPrice || 0;
  const [card1Amount, setCard1Amount] = useState(Math.round(totalPrice / 2));
  const [card1Installments, setCard1Installments] = useState(1);
  const [card2Installments, setCard2Installments] = useState(6);

  useEffect(() => {
    if (isOpen && totalPrice > 0) {
      setCard1Amount(Math.round(totalPrice / 2));
      fetchFinancing(Math.round(totalPrice / 2), 1, 6);
    }
  }, [isOpen, totalPrice]);

  const fetchFinancing = async (c1Amt, c1Inst, c2Inst) => {
    try {
      const res = await fetch(
        `/api/financing/calculate?totalPrice=${totalPrice}&card1Amount=${c1Amt}&card1Installments=${c1Inst}&card2Installments=${c2Inst}`
      );
      const data = await res.json();
      setInstallments(data.standardInstallments || []);
      setSplitData(data.splitPayment || null);
    } catch (err) {
      console.error('Error calculando financiación:', err);
    }
  };

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setCard1Amount(val);
    fetchFinancing(val, card1Installments, card2Installments);
  };

  const handleCard1InstChange = (e) => {
    const val = Number(e.target.value);
    setCard1Installments(val);
    fetchFinancing(card1Amount, val, card2Installments);
  };

  const handleCard2InstChange = (e) => {
    const val = Number(e.target.value);
    setCard2Installments(val);
    fetchFinancing(card1Amount, card1Installments, val);
  };

  if (!isOpen || !item) return null;

  const formattedMoney = (val) => {
    if (!val && val !== 0) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white text-red-700 shadow-xs">
                  Financiación & Cuotas
                </span>
                <span className="text-[11px] font-bold text-red-100">
                  Valores de referencia para Argentina
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                Calculadora de Planes y Pago Dividido
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Part Info Banner */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
              {item.title}
            </h4>
            <span className="text-xs text-gray-500">
              Vendido por: <strong>{item.sellerName}</strong> • {item.partBrand}
            </span>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Precio de Contado</span>
            <span className="text-lg sm:text-xl font-black text-gray-900">
              {formattedMoney(totalPrice)}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-100/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('installments')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'installments'
                ? 'bg-white text-red-700 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Planes de Cuotas Fijas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'split'
                ? 'bg-white text-blue-700 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <Split className="w-4 h-4" />
            <span>Pago Dividido (2 Tarjetas)</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-800">NUEVO</span>
          </button>
        </div>

        {/* Tab 1: Standard Installments */}
        {activeTab === 'installments' && (
          <div className="p-4 sm:p-6 space-y-3 max-h-[60vh] overflow-y-auto">
            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Tasas de referencia habituales en Mercado Pago, Cuota Simple y comercios de repuestos:
              </span>
            </div>

            <div className="space-y-2">
              {installments.map((plan) => {
                const isHighlight = plan.installments === 3 || plan.installments === 6;
                return (
                  <div
                    key={plan.installments}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      isHighlight
                        ? 'bg-red-50/50 border-red-200 hover:border-red-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
                        isHighlight ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {plan.installments}x
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-gray-900">
                            {plan.label}
                          </h5>
                          {plan.interestFree && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                              Sin recargo
                            </span>
                          )}
                          {isHighlight && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-800">
                              Más elegido
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 block">
                          {plan.note}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-black text-base sm:text-lg text-gray-900">
                        {formattedMoney(plan.installmentAmount)}
                        <span className="text-xs font-semibold text-gray-500"> /mes</span>
                      </div>
                      <span className="text-[11px] text-gray-500 block">
                        Total final: {formattedMoney(plan.totalFinanced)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Split Payment Simulator */}
        {activeTab === 'split' && splitData && (
          <div className="p-4 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
              <Calculator className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong>¿No te alcanza el límite de una sola tarjeta?</strong> En DinAcitY podés simular la división del pago entre 2 tarjetas de crédito distintas (o pagar una parte al contado/débito y el resto en cuotas).
              </div>
            </div>

            {/* Range Slider for Splitting Amount */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Distribuir monto a pagar:</span>
                <span className="text-xs font-semibold text-gray-500">Total: {formattedMoney(totalPrice)}</span>
              </div>

              <input
                type="range"
                min="0"
                max={totalPrice}
                step="1000"
                value={card1Amount}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />

              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-red-700">Tarjeta 1: {formattedMoney(card1Amount)} ({Math.round((card1Amount / (totalPrice || 1)) * 100)}%)</span>
                <span className="text-blue-700">Tarjeta 2: {formattedMoney(splitData.card2.amountOriginal)} ({Math.round((splitData.card2.amountOriginal / (totalPrice || 1)) * 100)}%)</span>
              </div>
            </div>

            {/* Two Cards Config Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1 */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs font-black">
                      1
                    </div>
                    <span className="text-xs font-black text-gray-900 uppercase">Tarjeta 1</span>
                  </div>
                  <span className="font-extrabold text-sm text-red-700">
                    {formattedMoney(splitData.card1.amountOriginal)}
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    Cuotas para Tarjeta 1:
                  </label>
                  <select
                    value={card1Installments}
                    onChange={handleCard1InstChange}
                    className="w-full text-xs font-semibold p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="1">1 cuota (Sin recargo)</option>
                    <option value="3">3 cuotas fijas</option>
                    <option value="6">6 cuotas fijas</option>
                    <option value="9">9 cuotas fijas</option>
                    <option value="12">12 cuotas fijas</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-red-200/60 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pagas por mes:</span>
                    <span className="font-black text-gray-900">
                      {card1Installments}x de {formattedMoney(splitData.card1.installmentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[11px] text-gray-500">
                    <span>Total financiado:</span>
                    <span>{formattedMoney(splitData.card1.totalFinanced)}</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                      2
                    </div>
                    <span className="text-xs font-black text-gray-900 uppercase">Tarjeta 2</span>
                  </div>
                  <span className="font-extrabold text-sm text-blue-700">
                    {formattedMoney(splitData.card2.amountOriginal)}
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    Cuotas para Tarjeta 2:
                  </label>
                  <select
                    value={card2Installments}
                    onChange={handleCard2InstChange}
                    className="w-full text-xs font-semibold p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="1">1 cuota (Sin recargo)</option>
                    <option value="3">3 cuotas fijas</option>
                    <option value="6">6 cuotas fijas</option>
                    <option value="9">9 cuotas fijas</option>
                    <option value="12">12 cuotas fijas</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-blue-200/60 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pagas por mes:</span>
                    <span className="font-black text-gray-900">
                      {card2Installments}x de {formattedMoney(splitData.card2.installmentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[11px] text-gray-500">
                    <span>Total financiado:</span>
                    <span>{formattedMoney(splitData.card2.totalFinanced)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Split Summary Footer */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-emerald-900 uppercase block">
                  Resumen Combinado de Pago Dividido
                </span>
                <span className="text-xs text-emerald-800">
                  Total financiado sumando ambas tarjetas: <strong>{formattedMoney(splitData.combinedTotalFinanced)}</strong>
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-200 font-bold shrink-0">
                ✅ Soportado en mostrador y Mercado Pago
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Los intereses dependen del banco emisor y la pasarela de cobro del vendedor</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}
