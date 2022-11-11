import type { Map } from "$lib/map/map";

import MvtImageryProvider from "$lib/module/provider/mvt-imagery-provider";

export class TestLayer {
    private map: Map;

    constructor(map: Map) {
        this.map = map;
        this.addToMap();
    }

    public addToMap(): void {
        const mvtProvider = new MvtImageryProvider('https://services.beta.geodan.nl/cache/tileserv/basiskaart.getmvt/{z}/{x}/{y}.pbf');
        this.map.viewer.imageryLayers.addImageryProvider(mvtProvider);
    }
}