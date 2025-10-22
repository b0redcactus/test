// DOM hivatkozások
const $ = (id) => document.getElementById(id);

const elBase = $('base');
const elF1t = $('f1type');
const elSoilT = $('soilT');
const elRho = $('rho');
const elLf = $('lf');

const elArr = $('arr');
const elF2t = $('f2type');
const elSys = $('systems');
const elRho2 = $('rho2');
const elLf2 = $('lf2');
const elDuct = $('duct');

const outF1 = $('f1v');
const outF2 = $('f2v');
const outTotal = $('total');

const elSysU = $('sysU');
const elSysP = $('sysP');
const outSysI = $('sysI');
const outCheck = $('sysCheck');

// Feszültségesés elemek
const elVdCableType = $('vdCableType');
const elVdCrossSection = $('vdCrossSection');
const elVdLength = $('vdLength');
const elVdPowerFactor = $('vdPowerFactor');
const outVdResult = $('vdResult');
const outVdPercentage = $('vdPercentage');

const btnCalc = $('calc');

let lastResult = null;

function performCalculationAndUpdateUI() {
  const base = Number(elBase.value);
  if (!base || base <= 0) {
    outF1.textContent = '–';
    outF2.textContent = '–';
    outTotal.textContent = 'Nem számolható az adott adatokkal';
    const Ionly = computeSystemCurrent(elSysU?.value, elSysP?.value);
    if (outSysI) outSysI.textContent = Ionly ? Ionly.toFixed(1) + ' A' : '–';
    if (outCheck) { outCheck.textContent = '–'; outCheck.className = 'mono'; }
    lastResult = null;
    return null;
  }

  const f1 = getF1Value(elF1t.value, elSoilT.value, elRho.value, elLf.value);
  const f2 = getF2Value(elArr.value, elF2t.value, elSys.value, elRho2.value, elLf2.value);

  outF1.textContent = (f1 == null) ? 'Nincs adat' : f1.toFixed(3);
  outF2.textContent = (f2 == null) ? 'Nincs adat' : f2.toFixed(3);

  if (f1 == null || f2 == null) {
    outTotal.textContent = 'Nem számolható az adott adatokkal';
    const Ionly = computeSystemCurrent(elSysU.value, elSysP.value);
    if (outSysI) outSysI.textContent = Ionly ? Ionly.toFixed(1) + ' A' : '–';
    if (outCheck) { outCheck.textContent = '–'; outCheck.className = 'mono'; }
    lastResult = { base, f1, f2, total: null, duct: elDuct?.value === 'yes',
                   sysU: elSysU.value, sysP: elSysP.value, I: Ionly, ok: null };
    return lastResult;
  }

  const ductFactor = (elDuct && elDuct.value === 'yes') ? 0.85 : 1.0;
  const total = base * f1 * f2 * ductFactor;
  outTotal.textContent = total.toFixed(1) + ' A';

  const I = computeSystemCurrent(elSysU.value, elSysP.value);
  if (outSysI) outSysI.textContent = I ? I.toFixed(1) + ' A' : '–';

  if (I && total) {
    if (total >= I) { outCheck.textContent = 'Kábel megfelelő'; outCheck.className = 'mono ok'; }
    else            { outCheck.textContent = 'Kábel nem megfelelő'; outCheck.className = 'mono bad'; }
  } else {
    outCheck.textContent = '–';
    outCheck.className = 'mono';
  }

  // Feszültségesés számítás
  let voltageDropResult = null;
  if (I && elVdLength?.value && elVdCableType?.value && elVdCrossSection?.value) {
    const cableParams = getCableParameters(elVdCableType.value, elVdCrossSection.value);
    if (cableParams) {
      voltageDropResult = computeVoltageDrop(
        Number(elSysU.value) || 400, // Default 400V ha nincs megadva
        I,
        cableParams.R,
        cableParams.X,
        Number(elVdLength.value),
        Number(elVdPowerFactor?.value || 0.8)
      );
    }
  }

  // Feszültségesés eredmények megjelenítése
  if (outVdResult && outVdPercentage) {
    if (voltageDropResult) {
      outVdResult.textContent = voltageDropResult.voltageDrop.toFixed(1) + ' V';
      outVdPercentage.textContent = voltageDropResult.percentage.toFixed(2) + ' %';
    } else {
      outVdResult.textContent = '–';
      outVdPercentage.textContent = '–';
    }
  }

  lastResult = { base, f1, f2, total,
                 duct: elDuct?.value === 'yes',
                 sysU: elSysU.value, sysP: elSysP.value, I,
                 ok: (I && total) ? (total >= I) : null,
                 voltageDrop: voltageDropResult };
  return lastResult;
}

btnCalc?.addEventListener('click', performCalculationAndUpdateUI);
[elSysU, elSysP, elVdCableType, elVdCrossSection, elVdLength, elVdPowerFactor].forEach(el => el?.addEventListener('input', () => {
  if (lastResult) performCalculationAndUpdateUI();
}));
