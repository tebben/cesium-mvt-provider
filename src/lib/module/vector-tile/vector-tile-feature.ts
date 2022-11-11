/**
 * Rewrite from https://github.com/mapbox/vector-tile-js
 * File: https://github.com/mapbox/vector-tile-js/blob/master/lib/vectortilefeature.js
 * License: BSD 3-Clause "New" or "Revised" License
 */

import { Point } from "$lib/module/vector-tile/point";

// @ts-ignore
import type PBF from "pbf";

export enum VectorTileFeaturTypes {'Unknown', 'Point', 'LineString', 'Polygon'};

export class VectorTileFeature {
    private pbf: PBF; 
    private geometry: number;   
    private keys: Array<number>;
    private values: Array<any>;

    public id: number;    
    public properties: any;
    public extent: number;
    public type: number;

    constructor(pbf: PBF, end: number, extent: number, keys: Array<number>, values: Array<any>) {
        this.pbf = pbf;
        this.geometry = -1;
        this.keys = keys;
        this.values = values;

        this.id = -1;
        this.properties = {};
        this.extent = extent;
        this.type = 0;

        this.pbf.readFields((tag: number) => { this.readFeature(tag) }, this, end);
    }

    public readFeature(tag: number): void {
        if (tag == 1) this.id = this.pbf.readVarint();
        else if (tag == 2) this.readTag();
        else if (tag == 3) this.type = this.pbf.readVarint();
        else if (tag == 4) this.geometry = this.pbf.pos;
    }

    public readTag(): void {
        var end = this.pbf.readVarint() + this.pbf.pos;

        while (this.pbf.pos < end) {
            var key = this.keys[this.pbf.readVarint()], value = this.values[this.pbf.readVarint()];
            this.properties[key] = value;
        }
    }

    public loadGeometry() {
        this.pbf.pos = this.geometry;

        var end = this.pbf.readVarint() + this.pbf.pos,
            cmd = 1,
            length = 0,
            x = 0,
            y = 0,
            lines = [],
            line: Point[] | undefined;

        while (this.pbf.pos < end) {
            if (length <= 0) {
                var cmdLen = this.pbf.readVarint();
                cmd = cmdLen & 0x7;
                length = cmdLen >> 3;
            }

            length--;

            if (cmd === 1 || cmd === 2) {
                x += this.pbf.readSVarint();
                y += this.pbf.readSVarint();

                if (cmd === 1) { // moveTo
                    if (line) lines.push(line);
                    line = [];
                }

                line?.push(new Point(x, y));
            } else if (cmd === 7) {
                // Workaround for https://github.com/mapbox/mapnik-vector-tile/issues/90                
                if (line) {
                    line.push(new Point(line[0].x, line[1].y)); // closePolygon
                }
            } else {                
                throw new Error('unknown command ' + cmd);
            }
        }

        if (line) lines.push(line);

        return lines;
    }

/*     getGeometryType(type, numEnds) {
        let geometryType;
        if (type === 1) {
            geometryType = numEnds === 1 ? 'Point' : 'MultiPoint';
        } else if (type === 2) {
            geometryType = numEnds === 1 ? 'LineString' : 'MultiLineString';
        } else if (type === 3) {
            geometryType = 'Polygon';
            // MultiPolygon not relevant for rendering - winding order determines
            // outer rings of polygons.
        }
        return geometryType;
    } */

    get bbox(): Array<number> {
        var pbf = this.pbf;
        pbf.pos = this.geometry;

        var end = pbf.readVarint() + pbf.pos,
            cmd = 1,
            length = 0,
            x = 0,
            y = 0,
            x1 = Infinity,
            x2 = -Infinity,
            y1 = Infinity,
            y2 = -Infinity;

        while (pbf.pos < end) {
            if (length <= 0) {
                var cmdLen = pbf.readVarint();
                cmd = cmdLen & 0x7;
                length = cmdLen >> 3;
            }

            length--;

            if (cmd === 1 || cmd === 2) {
                x += pbf.readSVarint();
                y += pbf.readSVarint();
                if (x < x1) x1 = x;
                if (x > x2) x2 = x;
                if (y < y1) y1 = y;
                if (y > y2) y2 = y;

            } else if (cmd !== 7) {
                throw new Error('unknown command ' + cmd);
            }
        }

        return [x1, y1, x2, y2];
    };

    // classifies an array of rings into polygons with outer rings and holes
    public classifyRings(rings: Array<any>): Array<any> {
        var len = rings.length;

        if (len <= 1) return [rings];

        var polygons = [],
            polygon: any[] | undefined,
            ccw;

        for (var i = 0; i < len; i++) {
            var area = this.signedArea(rings[i]);
            if (area === 0) continue;

            if (ccw === undefined) ccw = area < 0;

            if (ccw === area < 0) {
                if (polygon) polygons.push(polygon);
                polygon = [rings[i]];

            } else {
                polygon?.push(rings[i]);
            }
        }
        if (polygon) polygons.push(polygon);

        return polygons;
    }

    public signedArea(ring: Array<any>): number {
        var sum = 0;
        for (var i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
            p1 = ring[i];
            p2 = ring[j];
            sum += (p2.x - p1.x) * (p1.y + p2.y);
        }

        return sum;
    }
}
