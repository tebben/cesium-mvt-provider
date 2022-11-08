# cesium-mvt-provider

Trying to create a Mapbox Vector Tile Imagery Provider for CesiumJS by drawing mvt features onto a canvas. Project is currently a bit of a mess but got something working.  
[Demo](https://tebben.github.io/cesium-mvt-provider/) - working ok on my windows machine but has a lot of rendering errors on linux and android.

## ToDo

- Points, lines, labeling
- Offscreen rendering in worker
- Implement some styling
- Create NPM package of module folder
- ...

## Run

Install deps and run svelte-kit app

```sh
npm install
npm run dev
```