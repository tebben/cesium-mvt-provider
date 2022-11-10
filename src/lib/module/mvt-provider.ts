
import { WebMercatorTilingScheme, TilingScheme, TextureMinificationFilter, TextureMagnificationFilter } from "cesium";

import type { ImageryProvider, Proxy, ImageryTypes, Request, Credit, ImageryLayerFeatureInfo, Rectangle } from "cesium";

export class MvtProvider implements ImageryProvider {
    public _tilingScheme: TilingScheme = new WebMercatorTilingScheme();

    public defaultAlpha: number | undefined;
    public defaultNightAlpha: number | undefined;
    public defaultDayAlpha: number | undefined;
    public defaultBrightness: number | undefined;
    public defaultContrast: number | undefined;
    public defaultHue: number | undefined;
    public defaultSaturation: number | undefined;
    public defaultGamma: number | undefined;
    public defaultMinificationFilter: TextureMinificationFilter;
    public defaultMagnificationFilter: TextureMagnificationFilter;


    readonly ready: boolean = true;
    readonly readyPromise: Promise<boolean> = this._readyPromise();
    readonly rectangle: Rectangle = this._tilingScheme.rectangle;
    readonly tileWidth: number = 512;
    readonly tileHeight: number = 512;
    readonly maximumLevel: number | undefined = undefined;
    readonly minimumLevel: number = 0;
    readonly tilingScheme: TilingScheme = this._tilingScheme;
    readonly tileDiscardPolicy: TileDiscardPolicy = undefined;
    readonly errorEvent: Event = undefined;
    readonly credit: Credit = undefined;
    readonly proxy: Proxy = undefined;
    readonly hasAlphaChannel: boolean = true;

    constructor() {
        console.log("creating mvt provider");
        this.defaultAlpha = undefined;
        this.defaultNightAlpha = undefined;
        this.defaultDayAlpha = undefined;
        this.defaultBrightness = undefined;
        this.defaultContrast = undefined;
        this.defaultHue = undefined;
        this.defaultSaturation = undefined;
        this.defaultGamma = undefined;
        this.defaultMinificationFilter = TextureMinificationFilter.LINEAR;
        this.defaultMagnificationFilter = TextureMagnificationFilter.LINEAR;
        //this._tilingScheme = new WebMercatorTilingScheme();
    }

    public async _readyPromise(): Promise<boolean> {
        return true;
    }

    public async requestImage(x: number, y: number, level: number, request?: Request): Promise<ImageryTypes> {
        console.log(x, y, level, request);

        var canvas = document.createElement('canvas');
        return canvas;
    }

    public getTileCredits(x: number, y: number, level: number): Credit[] {
        return new Array<Credit>();
    }

    public async pickFeatures(x: number, y: number, level: number, longitude: number, latitude: number): Promise<ImageryLayerFeatureInfo[]> {
        console.log("pickFeatures");
        return new Array<ImageryLayerFeatureInfo>();
    }

    //public _reload;

    /* public _reload() {
        console.log("RELOAD CALLED");
    } */

    //static loadImage(imageryProvider: ImageryProvider, url: Resource | string): Promise<ImageryTypes | CompressedTextureBuffer> | undefined;
}