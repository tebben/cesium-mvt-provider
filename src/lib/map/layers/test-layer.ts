import type { Map } from "$lib/map/map";
import MvtProvider from "$lib/module/mvt-provider";
import ImageryLayer from "cesium/Source/Scene/ImageryLayer";

export class TestLayer {
    private map: Map;

    constructor(map: Map) {
        this.map = map;
        this.addToMap();
    }

    public addToMap(): void {
        const mvtProvider = new MvtProvider();
        //console.log("mvt provider created");

        //const layer = new ImageryLayer(mvtProvider);
        this.map.viewer.imageryLayers.addImageryProvider(mvtProvider);
    }
}