/**
 * Rewrite from https://github.com/mapbox/vector-tile-js
 * File: https://github.com/mapbox/vector-tile-js/blob/master/lib/vectortile.js
 * License: BSD 3-Clause "New" or "Revised" License
 */

import { VectorTileLayer } from "$lib/module/vector-tile/vector-tile-layer";

// @ts-ignore
import type PBF from "pbf";

export class VectorTile {
    private pbf: PBF;
    
    public layers: { [key: string]: VectorTileLayer };

    constructor(pbf: PBF, end: number) {        
        this.pbf = pbf;
        this.layers = {};
        this.pbf.readFields((tag: number) => {this.readTile(tag)}, this, end);
    }

    private readTile(tag: number): void {
        if (tag === 3) {            
            var layer = new VectorTileLayer(this.pbf, this.pbf.readVarint() + this.pbf.pos);
            if (layer.amountOfFeatures) {
                this.layers[layer.name] = layer;
            }
        }
    } 
}