/**
 * Rewrite from https://github.com/mapbox/vector-tile-js
 * File: https://github.com/mapbox/vector-tile-js/blob/master/lib/vectortilelayer.js
 * License: BSD 3-Clause "New" or "Revised" License
 */

import { VectorTileFeature } from "$lib/module/vector-tile/vector-tile-feature";

// @ts-ignore
import type PBF from "pbf";

export class VectorTileLayer {
    private pbf: PBF;
    private keys: Array<any>;
    private values: Array<any>;
    private features: Array<any>;

    public version: number;
    public name: string;
    public extent: number;
    public amountOfFeatures: number

    constructor(pbf: PBF, end: number) {
        this.pbf = pbf;
        this.keys = new Array<any>();
        this.values = new Array<any>();
        this.features = new Array<any>();

        this.version = 1;
        this.name = "";
        this.extent = 4096;
        this.amountOfFeatures = 0;

        pbf.readFields((tag: number) => { this.readLayer(tag); }, this, end);
        this.amountOfFeatures = this.features.length;
    }

    public readLayer(tag: number): void {
        if (tag === 15) this.version = this.pbf.readVarint();
        else if (tag === 1) this.name = this.pbf.readString();
        else if (tag === 5) this.extent = this.pbf.readVarint();
        else if (tag === 2) this.features.push(this.pbf.pos);
        else if (tag === 3) this.keys.push(this.pbf.readString());
        else if (tag === 4) this.values.push(this.readValueMessage());
    }

    public readValueMessage(): void {
        var value = null,
            end = this.pbf.readVarint() + this.pbf.pos;

        while (this.pbf.pos < end) {
            var tag = this.pbf.readVarint() >> 3;

            switch (tag) {
                case 1: {
                    value = this.pbf.readString();
                    break;
                }
                case 2: {
                    value = this.pbf.readFloat();
                    break;
                }
                case 3: {
                    value = this.pbf.readDouble();
                    break;
                }
                case 4: {
                    value = this.pbf.readVarint64();
                    break;
                }
                case 5: {
                    value = this.pbf.readVarint();
                    break;
                }
                case 6: {
                    value = this.pbf.readSVarint();
                    break;
                }
                case 7: {
                    value = this.pbf.readBoolean();
                    break;
                }
            }
        }

        return value;
    }

    public getFeature(i: number): VectorTileFeature {
        if (i < 0 || i >= this.features.length) throw new Error('feature index out of bounds');

        this.pbf.pos = this.features[i];

        var end = this.pbf.readVarint() + this.pbf.pos;
        return new VectorTileFeature(this.pbf, end, this.extent, this.keys, this.values);
    };
}
