# Datos — ¿El tipo de boleta importa? / Does ballot type matter?

Dataset abierto del Trabajo Final de Grado de Gonzalo Sagarraga (Lic. en Ciencia
Política, Facultad de Ciencias Sociales, Universidad Nacional de Córdoba, 2026).
Reconstruye el Anexo II del TFG: 24 elecciones provinciales (4 provincias × 6
años) en Argentina, 2003–2023.

Open dataset from Gonzalo Sagarraga's undergraduate thesis (Political Science,
School of Social Sciences, Universidad Nacional de Córdoba, 2026). It
reproduces Appendix II of the thesis: 24 provincial elections (4 provinces × 6
years) in Argentina, 2003–2023.

## Archivo / File

`tfg-boletas-datos.csv` — 24 filas (una por elección provincial) · 24 rows (one per provincial election).

## Columnas / Columns

| Columna / Column | Descripción (ES) | Description (EN) |
|---|---|---|
| `province_es` / `province_en` | Provincia | Province |
| `year` | Año de la elección | Election year |
| `ballot_type` | Tipo de boleta vigente ese año: `BP` (Boleta Partidaria), `BUS` (Boleta Única de Sufragio, Córdoba), `BUT` (Boleta Única por Tramos, Santa Fe), `BUE` (Boleta Única Electrónica, Neuquén) | Ballot type in force that year: `BP` (party-printed ballot), `BUS` (single ballot, Córdoba), `BUT` (ballot-by-section, Santa Fe), `BUE` (electronic ballot, Neuquén) |
| `blank_vote_executive_pct` | % de voto en blanco, categoría ejecutiva (gobernador y vice) | % blank vote, executive category (governor & vice) |
| `blank_vote_legislative_pct` | % de voto en blanco, categoría legislativa | % blank vote, legislative category |
| `null_vote_executive_pct` | % de voto nulo, categoría ejecutiva | % null/invalid vote, executive category |
| `null_vote_legislative_pct` | % de voto nulo, categoría legislativa | % null/invalid vote, legislative category |
| `crossover_vote_between_parties_idx` | Índice de voto cruzado entre partidos (Pedersen adaptado) | Cross-party split-ticket voting index (adapted Pedersen index) |
| `crossover_vote_with_blank_idx` | Índice de voto cruzado entre partido y blanco | Split-ticket index between party vote and blank vote |
| `turnout_pct` | % de participación electoral | % electoral turnout |

## Fuente / Source

Elaboración propia a partir de datos oficiales (Anexo II del TFG).

Own elaboration based on official data (Appendix II of the thesis).

## Cómo citar / How to cite

Sagarraga, G. (2026). *¿El tipo de boleta importa? Análisis descriptivo de las
relaciones existentes entre los tipos de boletas electorales y los resultados
electorales en cuatro provincias argentinas (2003-2023)* [Trabajo Final de
Grado, Universidad Nacional de Córdoba, Facultad de Ciencias Sociales].

## Licencia / License

[Creative Commons Atribución 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.es).
Se puede copiar, redistribuir y adaptar, incluso con fines comerciales, citando la fuente.

[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
You may copy, redistribute and adapt the data, including commercially, as long as you give credit.

## Dónde está / Where to find it

- Sitio / Site: https://gsagarraga.github.io/eltipodeboleta.importa/
- CSV: https://gsagarraga.github.io/eltipodeboleta.importa/tfg-boletas-datos.csv
- TFG completo / Full thesis: https://rdu.unc.edu.ar/items/b8fe7c5a-3a95-4fec-8158-7202b0d90041
