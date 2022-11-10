import { ImageryProvider, SplitDirection, TextureMagnificationFilter, TextureMinificationFilter } from "cesium";

import type { Color, Rectangle } from "cesium";
import type { MvtProvider } from "./mvt-provider";

export class MvtLayer {
    public provider: MvtProvider;

    public alpha: number;
    public nightAlpha: number;    
    public dayAlpha: number;
    public brightness: number;
    public contrast: number;
    public hue: number;
    public saturation: number;
    public gamma: number;
    public splitDirection: SplitDirection;
    public minificationFilter: TextureMinificationFilter;
    public magnificationFilter: TextureMagnificationFilter;
    public show: boolean;

    constructor(mvtProvider: MvtProvider, options?: {
        rectangle?: Rectangle;
        alpha?: number;
        nightAlpha?: number;
        dayAlpha?: number;
        brightness?: number;
        contrast?: number;
        hue?: number;
        saturation?: number;
        gamma?: number;
        splitDirection?: SplitDirection;
        minificationFilter?: TextureMinificationFilter;
        magnificationFilter?: TextureMagnificationFilter;
        show?: boolean;
        maximumAnisotropy?: number;
        minimumTerrainLevel?: number;
        maximumTerrainLevel?: number;
        cutoutRectangle?: Rectangle;
        colorToAlpha?: Color;
        colorToAlphaThreshold?: number;
    }) {
        this.provider = mvtProvider;
        this.alpha = options?.alpha ?? 1.0;
        this.nightAlpha = options?.nightAlpha ?? 1.0;
        this.dayAlpha = options?.dayAlpha ?? 1.0;
        this.brightness = options?.brightness ?? 1.0;
        this.contrast = options?.contrast ?? 1.0;
        this.hue = options?.hue ?? 0.0;
        this.saturation = options?.saturation ?? 1.0;
        this.gamma = options?.gamma ?? 1.0;
        this.splitDirection = options?.splitDirection ?? SplitDirection.NONE;
        this.minificationFilter = options?.minificationFilter ?? TextureMinificationFilter.LINEAR;
        this.magnificationFilter = options?.magnificationFilter ?? TextureMagnificationFilter.LINEAR;
        this.show = options?.show ?? true;
        //this.maximumAnisotropy = options?.maximumAnisotropy ?? 1.0;
        //this.cutoutRectangle = options?.cutoutRectangle ??
    };
    
    public cutoutRectangle: Rectangle;
    public colorToAlpha: Color;
    public colorToAlphaThreshold: number;
    readonly imageryProvider: ImageryProvider = this.provider;
    readonly rectangle: Rectangle;
    static DEFAULT_BRIGHTNESS: number;
    static DEFAULT_CONTRAST: number;
    static DEFAULT_HUE: number;
    static DEFAULT_SATURATION: number;
    static DEFAULT_GAMMA: number;
    static DEFAULT_SPLIT: SplitDirection;
    static DEFAULT_MINIFICATION_FILTER: TextureMinificationFilter;
    static DEFAULT_MAGNIFICATION_FILTER: TextureMagnificationFilter;
    static DEFAULT_APPLY_COLOR_TO_ALPHA_THRESHOLD: number;

    /**
     * Gets a value indicating whether this layer is the base layer in the
     * {@link ImageryLayerCollection}.  The base layer is the one that underlies all
     * others.  It is special in that it is treated as if it has global rectangle, even if
     * it actually does not, by stretching the texels at the edges over the entire
     * globe.
     * @returns true if this is the base layer; otherwise, false.
     */
    isBaseLayer(): boolean;
    /**
     * Returns true if this object was destroyed; otherwise, false.
     * <br /><br />
     * If this object was destroyed, it should not be used; calling any function other than
     * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
     * @returns True if this object was destroyed; otherwise, false.
     */
    isDestroyed(): boolean;
    /**
     * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
     * release of WebGL resources, instead of relying on the garbage collector to destroy this object.
     * <br /><br />
     * Once an object is destroyed, it should not be used; calling any function other than
     * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
     * assign the return value (<code>undefined</code>) to the object as done in the example.
     * @example
     * imageryLayer = imageryLayer && imageryLayer.destroy();
     */
    destroy(): void;
    /**
     * Computes the intersection of this layer's rectangle with the imagery provider's availability rectangle,
     * producing the overall bounds of imagery that can be produced by this layer.
     * @example
     * // Zoom to an imagery layer.
     * imageryLayer.getViewableRectangle().then(function (rectangle) {
     *     return camera.flyTo({
     *         destination: rectangle
     *     });
     * });
     * @returns A promise to a rectangle which defines the overall bounds of imagery that can be produced by this layer.
     */
    getViewableRectangle(): Promise<Rectangle>;
}
