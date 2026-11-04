# Strollo

Rutas a pie con audioguía, mapa, navegación y dónde comer. Web app publicada en https://strollo-app.github.io

## Estructura

- `index.html`: la app completa (pantalla de inicio, rutas, mapa, comer e info).
- `data/countries.json`: lista de países y sus ciudades, con lo que se muestra en la pantalla de inicio.
- `data/<país>.json`: todo lo de un país. Se carga solo cuando el usuario lo elige.
  - A nivel de país: idioma, moneda, frases (con audio), platos, consejos sin gluten, ayuda y emergencias.
  - En `cities`: cada ciudad con sus rutas, zonas, restaurantes, sitios sin gluten, fotos, transporte e historia.
- `audio/`: audios de las paradas (`audio/<parada>.mp3`) y pronunciación (`audio/tr/…`).
- `sw.js`: modo sin conexión.

## Añadir un país

1. Crear `data/<id>.json` con la misma forma que `data/tr.json`.
2. Añadir el país y sus ciudades a `data/countries.json`.
3. Subir los audios a `audio/`.
