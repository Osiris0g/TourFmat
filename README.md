# TourFmat

> Recorre la Facultad de Matemáticas de la UADY desde el aire, edificio por edificio.

<table>
  <tr>
    <td width="50%"><img src="assets/portada.png" alt="Portada del recorrido" /></td>
    <td width="50%"><img src="assets/mapa.png" alt="Mapa interactivo con zonas" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Portada</sub></td>
    <td align="center"><sub>Mapa con zonas</sub></td>
  </tr>
</table>

**[Abrir el recorrido](https://osiris0g.github.io/TourFmat/)**

## La idea

La UADY no tenía un recorrido virtual de sus facultades, y la FMAT es difícil de entender con solo un plano. TourFmat parte de una foto aérea real: cada edificio es un polígono trazado a mano, que se ilumina al pasar el cursor y abre su información al hacer clic.

Es un proyecto estudiantil, hecho con HTML, CSS y JavaScript, sin frameworks ni dependencias.

## Qué puedes explorar

| Tipo | Zonas |
|---|---|
| Edificios | A (Administrativo), B (Centro de Cómputo), C, D, E y H |
| Plazas y exteriores | Plaza de acceso, Plaza central, Plaza Roja, mini teatro al aire libre, estacionamiento |
| Espacios con nombre propio | El Cheto de FMAT, Biblioteca |

## Cómo se usa

1. Pulsa **Comenzar recorrido** en la portada.
2. Pasa el cursor por la foto: la imagen se mueve contigo y cada zona se ilumina.
3. Haz clic en una zona, o elígela desde **Explorar zonas**, para ver su información.
4. El botón **Zonas** (arriba a la derecha) te lleva a cualquier espacio o de vuelta a la portada.

## Un detalle de diseño

El logo de la FMAT tiene ejes cartesianos, y el proyecto parte de ahí. En la portada, dos líneas punteadas siguen al cursor y muestran sus coordenadas sobre la foto. Esas mismas coordenadas son las que definen cada zona del mapa.

## Cómo trazar una zona

Cada zona es una lista de puntos `x,y` sobre la foto.

1. Activa **Modo trazo** en la página.
2. Haz clic en las esquinas del edificio, en orden.
3. Copia las coordenadas que se generan.
4. Pégalas en la zona correspondiente de `script.js`:

```js
{ id: "ejemplo", name: "Nombre de la zona", pts: "100,200 180,200 180,260 100,260" }
```

## Hoja de ruta

- [x] Mapa con zonas iluminadas y panel de información
- [x] Portada y pantalla de carga
- [ ] Fotos 360° de cada espacio, enlazadas entre sí
- [ ] Descripción y fotos por zona
- [ ] Otras facultades de la UADY, empezando por Ingeniería Química

## Estructura del repositorio

```
TourFmat/
├── index.html
├── styles.css
├── script.js
├── assets/
├── LICENSE
└── README.md
```

## Créditos y aviso

TourFmat es un proyecto estudiantil y **no es un sitio oficial** de la Universidad Autónoma de Yucatán ni de la Facultad de Matemáticas. El código usa licencia MIT. Los logos, escudos y fotografías pertenecen a la UADY y a la FMAT, y no están cubiertos por esa licencia.

## Autor

Osiris Karim Aguirre Coli, estudiante de Ingeniería en Software en la UADY.
[GitHub](https://github.com/Osiris0g) · [LinkedIn](https://www.linkedin.com/in/OsirisAguirre)
