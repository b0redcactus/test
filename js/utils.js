// ========== Segédfüggvények ==========
function findClosestKey(keys, value) {
  const rows = keys.map(k => ({ orig: k, val: (k === 'any' ? Infinity : parseFloat(k)) }))
                   .sort((a,b) => a.val - b.val);
  const numVal = (typeof value === 'number') ? value : parseFloat(value);
  if (!rows.length || Number.isNaN(numVal)) return null;
  for (const row of rows) if (numVal <= row.val) return row.orig;
  return rows[rows.length - 1].orig;
}

function findFloorKey(keys, value) {
  const rows = keys.filter(k => k !== 'any')
                   .map(k => ({ orig: k, val: parseFloat(k) }))
                   .filter(r => !Number.isNaN(r.val))
                   .sort((a,b) => a.val - b.val);
  const numVal = (typeof value === 'number') ? value : parseFloat(value);
  if (!rows.length || Number.isNaN(numVal)) return null;
  let candidate = null;
  for (const row of rows) { if (row.val <= numVal) candidate = row.orig; else break; }
  return candidate;
}

function getNested(obj, keys) {
  return keys.reduce((o,k) => (o && k in o) ? o[k] : null, obj);
}

function lfKeyF1(n) {
  if (n === 1) return "1.00";
  if (n === 0.85) return "0.85";
  return n.toFixed(2); // "0.50" stb.
}

function lfKeyF2(n) {
  if (n === 1) return "1.0";
  if (n === 0.85) return "0.85";
  return n.toString(); // "0.5" stb.
}
