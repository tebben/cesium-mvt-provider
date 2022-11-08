import type { Map } from "$lib/map/map";
import { VectorTileStyle } from "$lib/module/vector-tile/vector-tile-style";
import MvtImageryProvider from "$lib/module/provider/mvt-imagery-provider";

export class TestLayer {
    private map: Map;

    constructor(map: Map) {
        this.map = map;
        this.addToMap();
    }

    public addToMap(): void {
        //const osm = "https://saturnus.geodan.nl/openmaptiles/data/v3/{z}/{x}/{y}.pbf";

        //https://fileserv.beta.geodan.nl/mapbox/styles/basiskaart_style.json
        const basiskaartStyle = new VectorTileStyle("class", {
            "bebouwd": "#e4e9ed",
            "gras": "#d2eccf",
            "water":"#c9e1ef",
            "wetland":"#f1f4c7",
            "groenvoorziening":"#d2eccf",
            "landbouw":"#f9f9f9",
            "zand":"#f8f7db",
            "bos":"#b0deaa",
            "weg":"#f9f9f9",
            "fietspad":"#f3eae7",
            "voetpad":"#e4e9ed",
            "berm":"#ebf0e9",
            "kunstwerk":"#c9c9c9"
        });

        const basiskaart = "https://services.beta.geodan.nl/cache/tileserv/basiskaart.getmvt/{z}/{x}/{y}.pbf";
        const mvtProvider = new MvtImageryProvider(basiskaart, basiskaartStyle);
        this.map.viewer.imageryLayers.addImageryProvider(mvtProvider);
    }
}