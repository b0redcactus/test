# cablecalc – Földkábel terhelhetőség

Egyszerű, offline földkábel terhelhetőség kalkulátor.  
Végső áramterhelhetőség képlete: **A = Alap × f1 × f2 × (védőcső esetén 0,85)**

---

## Tartalomjegyzék

- [Funkciók](#funkciók)
- [Telepítés és futtatás](#telepítés-és-futtatás)
- [Használat](#használat)
- [Rendszer adatai és megfelelőség-ellenőrzés](#rendszer-adatai-és-megfelelőség-ellenőrzés)
- [XLSX export (projektlap)](#xlsx-export-projektlap)
- [Bemenetek és logika](#bemenetek-és-logika)
- [Adatszerkezetek](#adatszerkezetek)
- [Hibakezelés](#hibakezelés)
- [Bővítés–karbantartás](#bővítés–karbantartás)
- [Ismert korlátok](#ismert-korlátok)
- [Kapcsolat–hozzájárulás](#kapcsolat–hozzájárulás)

---

## Funkciók

- **f1** és **f2** korrekciós tényezők számítása.
- Paraméterek: *kábel típusa*, *talajhőmérséklet*, *talaj fajlagos hőellenállás (ρ)*, *terhelési tényező (LF)*, *elrendezés*, *rendszerek száma*.
- **Védőcső opció**: ha *Igen*, a végeredmény további **0,85** szorzót kap.
- **Rendszer adatai (opcionális)**: feszültség (22 kV / 11 kV / 0,4 kV) és teljesítmény (kW) → számított áram **I = P / (√3·U)** → összevetés a kábel terhelhetőségével:
  - zöld: **„Kábel megfelelő”** (A ≥ I)
  - piros: **„Kábel nem megfelelő”** (A < I)
- **XLSX export** gomb: a megadott bemeneteket és az eredményeket Excel fájlba menti (üres „Projekt címe” és „Kábel fajtája” sorokkal).
- 100% **offline** – csak egy HTML fájl, külső szerver nem szükséges.

---

## Telepítés és futtatás

1) Klónozd vagy töltsd le a repót.  
2) Nyisd meg az `index.html` fájlt bármely modern böngészőben.

Parancssoros lokális kiszolgáló (opcionális):

    git clone <REPO_URL>
    cd <REPO_MAPPÁJA>
    python -m http.server 5500
    # majd böngészőben: http://localhost:5500

---

## Használat

1. **Alap**: add meg az *alapterhelhetőséget (A)* amperben.
2. **f1**:
   - Kábel típusa: `XLPE90`, `PVC70`, `PE70`, `PAPER65`, `PAPER60`
   - Talaj hőmérséklete: `5`, `10`, `15`, `20`, `25` °C
   - Talaj fajlagos hőellenállása ρ: `0.7`, `1.0`, `1.5`, `2.5`
   - Terhelési tényező (LF): `0.50`, `0.60`, `0.70`, `0.85`, `1.00`
3. **f2**:
   - Elrendezés: `triangle7`, `triangle25`, `flat7`, `3core`
   - Kábel típusa: `XLPE`, `PE`, `PVC`, `Paper`
   - Kábelrendszerek száma: `1`–`10`
   - Talaj fajlagos hőellenállása ρ: `0.7`, `1.0`, `1.5`, `2.5`
   - Terhelési tényező (LF): `0.5`, `0.6`, `0.7`, `0.85`, `1.0`
4. **Védőcső**: válaszd ki, hogy *van-e védőcső* (`Igen/Nem`). Ha *Igen*, a végeredmény szorzódik `0.85`-tel.
5. Kattints a **Számítás** gombra → megjelenik az **f1**, **f2** és a **végső A**.

---

## Rendszer adatai és megfelelőség-ellenőrzés

- **Névleges feszültség (U)**: 22 kV / 11 kV / 0,4 kV (V-ben: 22000 / 11000 / 400)
- **Teljesítmény (P)**: tetszőleges kW
- Számítás: **I = P / (√3 · U)**
- Összevetés: ha **A ≥ I** → `Kábel megfelelő` (zöld), különben `Kábel nem megfelelő` (piros).
- Opcionális mezők – a kalkulátor a rendszeradatok nélkül is működik.

---

## XLSX export (projektlap)

- A felületen található **„XLSX import”** gomb (név szerint import, valójában *export*) Excel fájlba menti:
  - az összes megadott **bemenetet**,
  - a számolt **f1**, **f2**, **védőcső szorzó** és **végső A** értékeket,
  - opcionálisan a rendszeradatokból számolt áramot és a megfelelőség-eredményt.
- A munkalapon előkészített, üresen hagyott sorok:
  - **Projekt címe**
  - **Kábel fajtája**

**Használati sorrend:**
1) először **Számítás**,  
2) utána **„XLSX import”** a friss eredmények exportálásához.

**Mentés (alapértelmezés):**
- Fájlnév: `kabel_terheles_<timestamp>.xlsx`
- Munkalap: `Számítás`

---

## Bemenetek és logika

- **f1**: a **12.a–12.b** táblák alapján (*talajhőmérséklet*, *ρ*, *LF*).
- **f2**: a **13.a–16.b** táblák alapján (*elrendezés*, *kábel-típus*, *rendszám*, *ρ*, *LF*).
- **Védőcső**: ha *Igen*, a végeredmény további `0.85` szorzót kap.

> A kalkulátor **pontosan** a táblapontokhoz illeszt; ha egy kombináció hiányzik (pl. 25 °C és ρ = 0,7 nincs definiálva), akkor **„Nincs adat”** és **„Nem számolható az adott adatokkal”** jelenik meg. Nincs automatikus közelítés másik ρ/LF értékhez.

---

## Adatszerkezetek

### `f1Data`
- 1. szint: kábel-típus (`XLPE90`, `PVC70`, `PE70`, `PAPER65`, `PAPER60`)
- 2. szint: talajhőmérséklet kulcsok (`5`, `10`, `15`, `20`, `25`)
- 3. szint: ρ kulcsok (stringek: `"0.7"`, `"1.0"`, `"1.5"`, `"2.5"`)
- 4. szint: terhelési tényező kulcsok (stringek: `"0.50"`, `"0.60"`, `"0.70"`, `"0.85"`, `"1.00"`)
- Érték: szám (korrekciós tényező)

### `f2Data`
- 1. szint: elrendezés (`triangle7`, `triangle25`, `flat7`, `3core`)
- 2. szint: kábel-típus (`XLPE`, `PE`, `PVC`, `Paper`)
- 3. szint: rendszám (string: `"1"`, `"2"`, …, `"10"`)
- 4. szint: ρ kulcsok (string: `"0.7"`, `"1.0"`, `"1.5"`, `"2.5"`)
- 5. szint: terhelési tényező kulcsok (string: `"0.5"`, `"0.6"`, `"0.7"`, `"0.85"`, `"1.0"`)
- Érték: szám (korrekciós tényező)

---

## Hibakezelés

- Ha valamelyik kombináció **hiányzik**:
  - az adott f-értéknél **„Nincs adat”** látszik,
  - a végeredménynél pedig **„Nem számolható az adott adatokkal”**.
- A logika **nem** választ „közeli” ρ- vagy LF-értéket.

---

## Bővítés–karbantartás

- **Adatok frissítése**: az `f1Data` és `f2Data` objektumokban.
- **Új opciók**:
  - Elrendezés bővítése: új top-szintű kulcs az `f2Data`-ban + UI-ba `<option>`.
  - Új kábel-típus: `f1Data` és/vagy `f2Data` bővítése + UI `<option>`.
- **Védőcső logika**: a `duct` mező (Igen/Nem) alapján a végeredmény `× 0.85` vagy `× 1`.
- **Stílus**: a `<style>` blokkban módosítható (színek, grid, gombok).
- **XLSX export**: a SheetJS (xlsx) könyvtárat a HTML-ben a saját `<script>` **elé** töltsd be CDN-ről, hogy az `XLSX` elérhető legyen.

---

## Ismert korlátok

- A kalkulátor a bevitt táblázat-pontokkal dolgozik; ha egy kombináció **nincs a szabványban** vagy még **nincs felvive**, a rendszer nem számol.
- A szabványban szereplő értékek sajátosságai miatt a felhasználó felelőssége az eredmény **ellenőrzése és műszaki jóváhagyása**.

---

## Kapcsolat–hozzájárulás

- Hibát találtál vagy bővítenéd a táblázatokat? Nyiss **issue**-t vagy küldj **pull request**-et.
- Használat közben javasolt sorrend: **először Számítás**, majd **„XLSX import”** (export) a projektlap mentéséhez.
