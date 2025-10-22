// ===== f1 lekérés =====
function getF1Value(type, soilT, rho, lf) {
  const temps = (typeof f1Data !== 'undefined') ? f1Data[type] : null;
  if (!temps) return null;

  const tKey = findClosestKey(Object.keys(temps), Number(soilT));
  if (!tKey) return null;

  const rhoData = temps[tKey];
  const rKey = findFloorKey(Object.keys(rhoData), rho);
  if (!rKey) return null;

  const lfData = rhoData[rKey];
  if ('any' in lfData) return lfData['any'];
  if (lf in lfData) return lfData[lf];

  const lfs = Object.keys(lfData).map(parseFloat).sort((a,b)=>a-b);
  const lfNum = parseFloat(lf);
  for (let i = lfs.length - 1; i >= 0; i--) {
    if (lfNum >= lfs[i]) return lfData[lfKeyF1(lfs[i])];
  }
  return null;
}

// ===== f2 lekérés =====
function getF2Value(arr, type, systems, rho, lf) {
  const table = (typeof f2Data !== 'undefined') ? f2Data[arr] : null;
  if (!table) return null;

  const typeData = table[type];
  if (!typeData) return null;

  const sysKey = findFloorKey(Object.keys(typeData), systems);
  if (!sysKey) return null;

  const rhoData = typeData[sysKey];
  const rKey = findFloorKey(Object.keys(rhoData), rho);
  if (!rKey) return null;

  const lfData = rhoData[rKey];
  if (lf in lfData) return lfData[lf];

  const lfNorm = lfKeyF2(parseFloat(lf));
  if (lfNorm in lfData) return lfData[lfNorm];

  const lfs = Object.keys(lfData).map(parseFloat).sort((a,b)=>a-b);
  const lfNum = parseFloat(lf);
  for (let i = lfs.length - 1; i >= 0; i--) {
    if (lfNum >= lfs[i]) return lfData[lfKeyF2(lfs[i])];
  }
  return null;
}

// ===== opcionális: duplázott f2-k merge =====
["triangle7","triangle25","flat7","3core"].forEach(k => {
  const extra = (typeof f2Data !== 'undefined') ? f2Data[k + "b"] : null;
  if (extra) {
    f2Data[k] = { ...(f2Data[k] || {}), ...extra };
    delete f2Data[k + "b"];
  }
});

// ===== háromfázisú áram =====
function computeSystemCurrent(U_volt, PkW) {
  if (!U_volt || !PkW || U_volt <= 0 || PkW < 0) return null;
  return (PkW * 1000) / (Math.sqrt(3) * U_volt);
}

// ===== feszültségesés számítás =====
function computeVoltageDrop(U_nominal, I_current, R_resistance, X_reactance, length_km, powerFactor = 0.8) {
  if (!U_nominal || !I_current || !R_resistance || !X_reactance || !length_km || 
      U_nominal <= 0 || I_current <= 0 || R_resistance <= 0 || X_reactance < 0 || length_km <= 0) {
    return null;
  }
  
  // Feszültségesés számítása: ΔU = √3 × I × L × (R × cosφ + X × sinφ)
  const cosPhi = powerFactor;
  const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
  
  const voltageDrop = Math.sqrt(3) * I_current * length_km * (R_resistance * cosPhi + X_reactance * sinPhi);
  
  return {
    voltageDrop: voltageDrop,
    percentage: (voltageDrop / U_nominal) * 100
  };
}

// ===== kábel paraméterek lekérése (egyszerűsített táblázat) =====
function getCableParameters(cableType, crossSection) {
  // Egyszerűsített táblázat a gyakori kábel típusokhoz
  const cableData = {
    'XLPE': {
      '25': { R: 0.727, X: 0.08 },
      '35': { R: 0.524, X: 0.08 },
      '50': { R: 0.387, X: 0.08 },
      '70': { R: 0.268, X: 0.08 },
      '95': { R: 0.193, X: 0.08 },
      '120': { R: 0.153, X: 0.08 },
      '150': { R: 0.124, X: 0.08 },
      '185': { R: 0.0991, X: 0.08 },
      '240': { R: 0.0754, X: 0.08 },
      '300': { R: 0.0601, X: 0.08 }
    },
    'PE': {
      '25': { R: 0.727, X: 0.08 },
      '35': { R: 0.524, X: 0.08 },
      '50': { R: 0.387, X: 0.08 },
      '70': { R: 0.268, X: 0.08 },
      '95': { R: 0.193, X: 0.08 },
      '120': { R: 0.153, X: 0.08 },
      '150': { R: 0.124, X: 0.08 },
      '185': { R: 0.0991, X: 0.08 },
      '240': { R: 0.0754, X: 0.08 },
      '300': { R: 0.0601, X: 0.08 }
    },
    'PVC': {
      '25': { R: 0.727, X: 0.08 },
      '35': { R: 0.524, X: 0.08 },
      '50': { R: 0.387, X: 0.08 },
      '70': { R: 0.268, X: 0.08 },
      '95': { R: 0.193, X: 0.08 },
      '120': { R: 0.153, X: 0.08 },
      '150': { R: 0.124, X: 0.08 },
      '185': { R: 0.0991, X: 0.08 },
      '240': { R: 0.0754, X: 0.08 },
      '300': { R: 0.0601, X: 0.08 }
    }
  };
  
  if (!cableData[cableType] || !cableData[cableType][crossSection]) {
    return null;
  }
  
  return cableData[cableType][crossSection];
}