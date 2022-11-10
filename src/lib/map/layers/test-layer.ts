import * as Cesium from "cesium";
import { MvtLayer } from "$lib/module/mvt-layer";
import { MvtProvider } from "$lib/module/mvt-provider";

import type { Map } from "$lib/map/map";

export class TestLayer {
    private map: Map;

    constructor(map: Map) {
        this.map = map;
        this.addToMap();
    }

    public addToMap(): void {
        const mvtProvider = new MvtProvider();
        console.log("mvt provider created");

        const layer = new MvtLayer(mvtProvider);

        this.map.viewer.imageryLayers.add(layer);
    }
}