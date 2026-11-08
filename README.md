# Análisis complejo

Materiales de estudio basados en **Análisis Complejo**, Diego Jauré, Primavera 2026, Universidad de Montevideo. El PDF original está en la raíz del repositorio.

## Abrir los materiales

Abrí [materiales/index.html](materiales/index.html) en tu navegador. Funciona directamente como archivo local, sin instalación, conexión ni compilación.

Para servirlo por HTTP y conservar una dirección estable para el progreso, ejecutá desde la raíz del repo:

```sh
python -m http.server 8000
```

Luego entrá a **http://localhost:8000/materiales/**. Usá siempre el mismo navegador y la misma dirección para retomar el progreso.

## Qué incluye

- **205 flashcards** de definiciones, hipótesis y teoremas, con ejemplos y filtro de pendientes. Cubren las 18 secciones de los cuatro capítulos e incluyen preguntas de hipótesis, ejemplos, contraejemplos y cálculos breves. Incluyen **28 diagramas explicativos** en el dorso, con etiquetas y una descripción breve. Clic para girar; arrastrar a la derecha para marcar como aprendida o a la izquierda para revisar después. Al presionar aparecen los indicadores. También se pueden usar Enter/espacio y las flechas del teclado.
- **31 preguntas**: 14 verdaderos/falsos, 4 de opción múltiple teórica y 13 de cálculo. Corrección inmediata, explicación y rondas aleatorias.
- **20 ejercicios** con dificultad, pistas, soluciones, notas personales y seguimiento. El botón de impresión produce una lista sin soluciones.
- **6 laboratorios interactivos**: residuos e índice (8 funciones para comparar, centro complejo ajustable arrastrando el círculo o usando los controles, radio, orientación, vueltas y tabla de residuos e índices); fórmula integral de Cauchy; conformidad local de z²; convergencia de zⁿ; Rouché; propiedad de la media y módulo máximo.

Los materiales siguen los cuatro capítulos del apunte. Cada actividad enlaza su sección y página física del PDF (distinta de la numeración impresa). Las actividades son material original de práctica: no transcriben una guía de ejercicios del autor. Se usan enunciados matemáticos con sus hipótesis explícitas; no se reproducen posibles erratas del apunte. Los apéndices aparecen sin desarrollo en el PDF y no se incluyen como unidades de estudio.

El detalle de cobertura está en [materiales/cobertura-flashcards.md](materiales/cobertura-flashcards.md).

## Recorrido sugerido

1. Leé una sección del PDF y recuperá sus definiciones con las tarjetas sin mirar la respuesta.
2. Explorá el laboratorio correspondiente, anticipando el resultado antes de mover cada control.
3. Completá preguntas teóricas y de cálculo. Usá las explicaciones para revisar las hipótesis que omitiste.
4. Resolvé los ejercicios en papel. Consultá primero la pista y luego la solución; marcá los que puedas justificar por tu cuenta.

El progreso y las notas se guardan en `localStorage` de este navegador, cuando está disponible. No se envían a un servidor ni se sincronizan entre dispositivos. El modo privado, borrar datos del navegador o cambiar de dirección puede hacer que no se conserven. Si el almacenamiento está bloqueado, el progreso dura solo la sesión.

## Archivos

- `materiales/content.js`: tarjetas, preguntas, ejercicios y referencias al apunte.
- `materiales/app.js`: navegación, evaluación, almacenamiento y visualizaciones SVG.
- `materiales/card-diagrams.js`: dibujos SVG y explicaciones para las tarjetas.
- `materiales/math.js`: composición de fórmulas, notación y formato de resultados.
- `materiales/residue-model.js`: funciones de ejemplo y cálculo del índice y la integral por residuos.
- `materiales/vendor/katex/`: renderizador y fuentes locales.
- `materiales/style.css`: interfaz adaptable e impresión.

Las fórmulas se componen con **KaTeX 0.19.1**, incluido junto a sus fuentes y su licencia MIT en `materiales/vendor/katex/`. No usa CDN ni requiere instalar paquetes. El registro de notación de `materiales/math.js` conserva los textos originales para accesibilidad y separa las fórmulas del contenido ingresado en las notas.

Para comprobar la sintaxis:

```sh
node --check materiales/app.js
node --check materiales/content.js
node --check materiales/card-diagrams.js
node --check materiales/math.js
node --test tests/math.test.cjs tests/residues.test.cjs
```
