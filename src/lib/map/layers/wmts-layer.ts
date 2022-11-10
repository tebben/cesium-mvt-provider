import * as Cesium from "cesium";
import { writable, get } from "svelte/store";

import type { Map } from "$lib/map/map";
import type { ImageryLayer } from "cesium";
import type { Writable } from "svelte/store";
import type { Wmtsconfig } from "$lib/map/layers/wmts-config";

export class WmtsLayer {
    private map: Map;
    private config: Wmtsconfig;
    private _source: Writable<ImageryLayer>;
    
	constructor(map: Map, config: Wmtsconfig) {
        this.map = map;
        this.config = config;
        this._source = writable<ImageryLayer>(undefined);
		this._source.subscribe((source) => {			
			if (source !== undefined) {
				this.addToMap();
			}
		});

		this.createLayer();
        this.addToMap();
	}

    public get source(): ImageryLayer {
		return get(this._source);
	}

	public set source(newSource: ImageryLayer) {
		this._source.set(newSource);
	}

    public addToMap(): void {
		if (this.config.background) {
			this.map.viewer.imageryLayers.add(this.source, 0);
		} else {
			this.map.viewer.imageryLayers.add(this.source);
		}
	}

	public removeFromMap(): void {
		/* const idx = this.getSourceIndex();
		if (idx !== -1) {
			const p = this.map.viewer.imageryLayers.get(idx);
			this.map.viewer.imageryLayers.remove(p);
		} else {
			this.map.viewer.imageryLayers.remove(this.source);
		} */
	}

	public show(): void {
		if (this.source) {
			this.source.show = true;
			this.map.refresh();
		}
	}

	public hide(): void {
		if (this.source) {
			this.source.show = false;
			this.map.refresh();
		}
	}

	private createLayer() {
		const provider = new Cesium.WebMapTileServiceImageryProvider({
			url: this.config.url,
			layer: this.config.featureName,
			style: "default",
			format: this.config.contentType ?? "image/png",
			tileMatrixSetID: "EPSG:3857",
			tileMatrixLabels:  this.config.matrixIds ?? [
				"EPSG:3857:0",
				"EPSG:3857:1",
				"EPSG:3857:2",
				"EPSG:3857:3",
				"EPSG:3857:4",
				"EPSG:3857:5",
				"EPSG:3857:6",
				"EPSG:3857:7",
				"EPSG:3857:8",
				"EPSG:3857:9",
				"EPSG:3857:10",
				"EPSG:3857:11",
				"EPSG:3857:12",
				"EPSG:3857:13",
				"EPSG:3857:14",
				"EPSG:3857:15",
				"EPSG:3857:16",
				"EPSG:3857:17",
				"EPSG:3857:18",
				"EPSG:3857:19"
			],
			tilingScheme: new Cesium.WebMercatorTilingScheme({
				ellipsoid: Cesium.Ellipsoid.WGS84
			}),
			tileWidth: 256,
			tileHeight: 256,
			maximumLevel: 19
		});

		this.source = new Cesium.ImageryLayer(provider);
	}
}
