import { select, selectAll, setActiveButton } from './utils.js';

const CALCULATOR_CONFIG = Object.freeze({
  daysPerMonth: 30,
  plnTariffPerKwh: 1444.70,
  co2Factor: 0.80,
  treeAbsorptionFactor: 1.73
});

function calculateEnergy(state) {
  const actualDailyKwh = (
    state.computeWatt * state.computeHours * state.chargerFactor
    + state.coolingWatt * state.coolingHours * state.tempFactor
  ) / 1000;
  const optimalCoolingHours = Math.max(1, state.coolingHours - 1);
  const optimalDailyKwh = (
    state.computeWatt * state.computeHours
    + state.coolingWatt * optimalCoolingHours
  ) / 1000;
  const actualKwh = actualDailyKwh * CALCULATOR_CONFIG.daysPerMonth;
  const optimalKwh = optimalDailyKwh * CALCULATOR_CONFIG.daysPerMonth;
  const actualCo2 = actualKwh * CALCULATOR_CONFIG.co2Factor;
  const optimalCo2 = optimalKwh * CALCULATOR_CONFIG.co2Factor;
  const actualCost = actualKwh * CALCULATOR_CONFIG.plnTariffPerKwh;
  const optimalCost = optimalKwh * CALCULATOR_CONFIG.plnTariffPerKwh;
  const savedKwh = Math.max(0, actualKwh - optimalKwh);
  const savedCo2 = Math.max(0, actualCo2 - optimalCo2);
  const savedCost = Math.max(0, actualCost - optimalCost);

  return {
    actualKwh,
    actualCo2,
    actualCost,
    optimalKwh,
    optimalCo2,
    optimalCost,
    savedKwh,
    savedCo2,
    savedCost,
    savedPercentage: actualKwh > 0 ? (savedKwh / actualKwh) * 100 : 0,
    treeEquivalent: savedCo2 / CALCULATOR_CONFIG.treeAbsorptionFactor
  };
}

const formatCurrency = value => `Rp ${Math.round(value).toLocaleString('id-ID')}`;
const formatNumber = value => value.toFixed(1);

function renderResult(result) {
  const values = {
    'res-actual-kwh': formatNumber(result.actualKwh),
    'res-actual-co2': `${formatNumber(result.actualCo2)} kg`,
    'res-actual-cost': formatCurrency(result.actualCost),
    'res-optimal-kwh': formatNumber(result.optimalKwh),
    'res-optimal-co2': `${formatNumber(result.optimalCo2)} kg`,
    'res-optimal-cost': formatCurrency(result.optimalCost),
    'res-saved-kwh': formatNumber(result.savedKwh),
    'res-saved-co2': `${formatNumber(result.savedCo2)} kg CO2`,
    'res-saved-cost': formatCurrency(result.savedCost),
    'res-saved-pct': `${result.savedPercentage.toFixed(1)}%`,
    'res-tree-count': result.treeEquivalent.toFixed(1)
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

export function initCalculator() {
  const state = {
    computeWatt: 50,
    computeHours: 8,
    chargerFactor: 1.2,
    coolingWatt: 750,
    coolingHours: 9,
    tempFactor: 1.35
  };

  const update = () => renderResult(calculateEnergy(state));

  const bindSelectors = (selector, stateKey, valueKey, afterUpdate) => {
    selectAll(selector).forEach(button => {
      button.addEventListener('click', () => {
        setActiveButton(button, selector);
        state[stateKey] = Number(button.dataset[valueKey]);
        afterUpdate?.(state[stateKey]);
        update();
      });
    });
  };

  bindSelectors('.calc-device-btn', 'computeWatt', 'watt', value => {
    select('#label-device-watt').textContent = `${value} W`;
  });
  bindSelectors('.calc-habit-btn', 'chargerFactor', 'factor');
  bindSelectors('.calc-cooling-btn', 'coolingWatt', 'watt', value => {
    select('#label-cooling-watt').textContent = `${value} W`;
  });
  bindSelectors('.calc-temp-btn', 'tempFactor', 'factor');

  const bindRange = (id, stateKey, outputId) => {
    const slider = document.getElementById(id);
    const output = document.getElementById(outputId);
    if (!slider || !output) return;

    slider.addEventListener('input', event => {
      const value = Math.max(0, Number(event.target.value));
      state[stateKey] = value;
      output.textContent = `${value} Jam / hari`;
      update();
    });
  };

  bindRange('slider-compute-hours', 'computeHours', 'val-compute-hours');
  bindRange('slider-cooling-hours', 'coolingHours', 'val-cooling-hours');
  update();
}
