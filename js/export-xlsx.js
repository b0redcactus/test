const btnXlsx = document.getElementById('exportXlsx');

btnXlsx?.addEventListener('click', () => {
  if (typeof XLSX === 'undefined') {
    alert('Hiányzik az XLSX könyvtár betöltése.');
    return;
  }
  // biztosítsuk, hogy friss értékek legyenek
  const res = (typeof performCalculationAndUpdateUI === 'function')
    ? performCalculationAndUpdateUI() : null;

  if (!res) { alert('Először töltsd ki az adatokat és nyomd meg a Számítás gombot.'); return; }
  if (res.f1 == null || res.f2 == null) { alert('Ezekkel az adatokkal nem számolható.'); return; }

  const f1typeEl = document.getElementById('f1type');
  const arrEl    = document.getElementById('arr');
  const f2typeEl = document.getElementById('f2type');
  const elSoilT  = document.getElementById('soilT');
  const elRho    = document.getElementById('rho');
  const elLf     = document.getElementById('lf');
  const elSys    = document.getElementById('systems');
  const elRho2   = document.getElementById('rho2');
  const elLf2    = document.getElementById('lf2');
  const elSysU   = document.getElementById('sysU');
  const elSysP   = document.getElementById('sysP');
  const elVdCableType = document.getElementById('vdCableType');
  const elVdCrossSection = document.getElementById('vdCrossSection');
  const elVdLength = document.getElementById('vdLength');
  const elVdPowerFactor = document.getElementById('vdPowerFactor');

  const rows = [
    ['Projekt címe',''],
    ['Kábel fajtája',''],
    ['',''],
    ['Bemenetek','Érték'],
    ['Alapterhelhetőség (A)', res.base ?? '—'],
    ['f1 – Kábel típusa', f1typeEl.selectedOptions[0].text + ` [${f1typeEl.value}]`],
    ['f1 – Talaj hőmérséklete (°C)', elSoilT.value],
    ['f1 – Talaj fajlagos hőellenállása ρ', elRho.value],
    ['f1 – Terhelési tényező', elLf.value],
    ['f2 – Elrendezés', arrEl.selectedOptions[0].text + ` [${arrEl.value}]`],
    ['f2 – Kábel típusa', f2typeEl.selectedOptions[0].text + ` [${f2typeEl.value}]`],
    ['f2 – Kábelrendszerek száma', elSys.value],
    ['f2 – Talaj fajlagos hőellenállása ρ', elRho2.value],
    ['f2 – Terhelési tényező', elLf2.value],
    ['Védőcső', res.duct ? 'Igen (0,85×)' : 'Nem'],
    ['',''],
    ['Eredmények','Érték'],
    ['f1', res.f1.toFixed(3)],
    ['f2', res.f2.toFixed(3)],
    ['Végső terhelhetőség (A)', res.total == null ? 'Nem számolható' : res.total.toFixed(1)],
    ['',''],
    ['Rendszer adatai (opcionális)','Érték'],
    ['Névleges feszültség (V)', elSysU.value || '—'],
    ['Teljesítmény (kW)', elSysP.value || '—'],
    ['Számított rendszeráram (A)', res.I ? res.I.toFixed(1) : '—'],
    ['Összehasonlítás', res.ok == null ? '—' : (res.ok ? 'Kábel megfelelő' : 'Kábel nem megfelelő')],
    ['',''],
    ['Feszültségesés számítás','Érték'],
    ['Kábel típusa', elVdCableType ? elVdCableType.selectedOptions[0].text + ` [${elVdCableType.value}]` : '—'],
    ['Keresztmetszet (mm²)', elVdCrossSection ? elVdCrossSection.value : '—'],
    ['Kábel hossza (km)', elVdLength ? elVdLength.value : '—'],
    ['Teljesítménytényező', elVdPowerFactor ? elVdPowerFactor.value : '—'],
    ['Feszültségesés (V)', res.voltageDrop ? res.voltageDrop.voltageDrop.toFixed(1) : '—'],
    ['Feszültségesés (%)', res.voltageDrop ? res.voltageDrop.percentage.toFixed(2) : '—'],
    ['',''],
    ['Szabvány','MSZ 13207:2020'],
    ['Export dátum/idő', new Date().toLocaleString()],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 38 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Számítás');
  XLSX.writeFile(wb, `kabel_terheles_${Date.now()}.xlsx`);
});
