import { Color, defaultValue, defined, Event, WebMercatorTilingScheme, Ellipsoid, TextureMagnificationFilter, TextureMinificationFilter, TilingScheme } from "cesium";

//import { VectorTile } from "@mapbox/vector-tile";
import PBF from "pbf";

/**
 * @typedef {Object} TileCoordinatesImageryProvider.ConstructorOptions
 *
 * Initialization options for the TileCoordinatesImageryProvider constructor
 *
 * @property {TilingScheme} [tilingScheme=new WebMercatorTilingScheme()] The tiling scheme for which to draw tiles.
 * @property {Ellipsoid} [ellipsoid] The ellipsoid.  If the tilingScheme is specified,
 *                    this parameter is ignored and the tiling scheme's ellipsoid is used instead. If neither
 *                    parameter is specified, the WGS84 ellipsoid is used.
 * @property {Color} [color=Color.YELLOW] The color to draw the tile box and label.
 * @property {Number} [tileWidth=256] The width of the tile for level-of-detail selection purposes.
 * @property {Number} [tileHeight=256] The height of the tile for level-of-detail selection purposes.
 */

/**
 * An {@link ImageryProvider} that draws a box around every rendered tile in the tiling scheme, and draws
 * a label inside it indicating the X, Y, Level coordinates of the tile.  This is mostly useful for
 * debugging terrain and imagery rendering problems.
 *
 * @alias MvtProvider
 * @constructor
 *
 * @param {TileCoordinatesImageryProvider.ConstructorOptions} [options] Object describing initialization options
 */
function MvtProvider(options) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
    this.url = "https://services.beta.geodan.nl/cache/tileserv/basiskaart.getmvt/{z}/{x}/{y}.pbf";
    this._tilingScheme = defined(options.tilingScheme)
        ? options.tilingScheme
        : new WebMercatorTilingScheme({ ellipsoid: options.ellipsoid });
    this._color = defaultValue(options.color, Color.YELLOW);
    this._errorEvent = new Event();
    this._tileWidth = defaultValue(options.tileWidth, 256);
    this._tileHeight = defaultValue(options.tileHeight, 256);
    this._readyPromise = Promise.resolve(true);

    /**
     * The default alpha blending value of this provider, with 0.0 representing fully transparent and
     * 1.0 representing fully opaque.
     *
     * @type {Number|undefined}
     * @default undefined
     */
    this.defaultAlpha = undefined;

    /**
     * The default alpha blending value on the night side of the globe of this provider, with 0.0 representing fully transparent and
     * 1.0 representing fully opaque.
     *
     * @type {Number|undefined}
     * @default undefined
     */
    this.defaultNightAlpha = undefined;

    /**
     * The default alpha blending value on the day side of the globe of this provider, with 0.0 representing fully transparent and
     * 1.0 representing fully opaque.
     *
     * @type {Number|undefined}
     * @default undefined
     */
    this.defaultDayAlpha = undefined;

    /**
     * The default brightness of this provider.  1.0 uses the unmodified imagery color.  Less than 1.0
     * makes the imagery darker while greater than 1.0 makes it brighter.
     *
     * @type {Number|undefined}
     * @default undefined
     */
    this.defaultBrightness = undefined;

    /**
     * The default contrast of this provider.  1.0 uses the unmodified imagery color.  Less than 1.0 reduces
     * the contrast while greater than 1.0 increases it.
     *
     * @type {Number|undefined}
     * @default undefined
     */
    this.defaultContrast = undefined;

    /**
     * The default hue of this provider in radians. 0.0 uses the unmodified imagery color.
     *
     * @type {Number|undefined}
     * @default undefined
     */
    this.defaultHue = undefined;

    /**
     * The default saturation of this provider. 1.0 uses the unmodified imagery color. Less than 1.0 reduces the
     * saturation while greater than 1.0 increases it.
     *
     * @type {Number|undefined}
     * @default undefined
     */
    this.defaultSaturation = undefined;

    /**
     * The default gamma correction to apply to this provider.  1.0 uses the unmodified imagery color.
     *
     * @type {Number|undefined}
     * @default undefined
     */
    this.defaultGamma = undefined;

    /**
     * The default texture minification filter to apply to this provider.
     *
     * @type {TextureMinificationFilter}
     * @default undefined
     */
    this.defaultMinificationFilter = undefined;

    /**
     * The default texture magnification filter to apply to this provider.
     *
     * @type {TextureMagnificationFilter}
     * @default undefined
     */
    this.defaultMagnificationFilter = undefined;
}

Object.defineProperties(MvtProvider.prototype, {
    /**
     * Gets the proxy used by this provider.
     * @memberof MvtProvider.prototype
     * @type {Proxy}
     * @readonly
     */
    proxy: {
        get: function () {
            return undefined;
        },
    },

    /**
     * Gets the width of each tile, in pixels. This function should
     * not be called before {@link MvtProvider#ready} returns true.
     * @memberof MvtProvider.prototype
     * @type {Number}
     * @readonly
     */
    tileWidth: {
        get: function () {
            return this._tileWidth;
        },
    },

    /**
     * Gets the height of each tile, in pixels.  This function should
     * not be called before {@link MvtProvider#ready} returns true.
     * @memberof MvtProvider.prototype
     * @type {Number}
     * @readonly
     */
    tileHeight: {
        get: function () {
            return this._tileHeight;
        },
    },

    /**
     * Gets the maximum level-of-detail that can be requested.  This function should
     * not be called before {@link MvtProvider#ready} returns true.
     * @memberof MvtProvider.prototype
     * @type {Number|undefined}
     * @readonly
     */
    maximumLevel: {
        get: function () {
            return 19;
        },
    },

    /**
     * Gets the minimum level-of-detail that can be requested.  This function should
     * not be called before {@link MvtProvider#ready} returns true.
     * @memberof MvtProvider.prototype
     * @type {Number}
     * @readonly
     */
    minimumLevel: {
        get: function () {
            return undefined;
        },
    },

    /**
     * Gets the tiling scheme used by this provider.  This function should
     * not be called before {@link MvtProvider#ready} returns true.
     * @memberof MvtProvider.prototype
     * @type {TilingScheme}
     * @readonly
     */
    tilingScheme: {
        get: function () {
            return this._tilingScheme;
        },
    },

    /**
     * Gets the rectangle, in radians, of the imagery provided by this instance.  This function should
     * not be called before {@link MvtProvider#ready} returns true.
     * @memberof MvtProvider.prototype
     * @type {Rectangle}
     * @readonly
     */
    rectangle: {
        get: function () {
            return this._tilingScheme.rectangle;
        },
    },

    /**
     * Gets the tile discard policy.  If not undefined, the discard policy is responsible
     * for filtering out "missing" tiles via its shouldDiscardImage function.  If this function
     * returns undefined, no tiles are filtered.  This function should
     * not be called before {@link MvtProvider#ready} returns true.
     * @memberof MvtProvider.prototype
     * @type {TileDiscardPolicy}
     * @readonly
     */
    tileDiscardPolicy: {
        get: function () {
            return undefined;
        },
    },

    /**
     * Gets an event that is raised when the imagery provider encounters an asynchronous error.  By subscribing
     * to the event, you will be notified of the error and can potentially recover from it.  Event listeners
     * are passed an instance of {@link TileProviderError}.
     * @memberof MvtProvider.prototype
     * @type {Event}
     * @readonly
     */
    errorEvent: {
        get: function () {
            return this._errorEvent;
        },
    },

    /**
     * Gets a value indicating whether or not the provider is ready for use.
     * @memberof MvtProvider.prototype
     * @type {Boolean}
     * @readonly
     */
    ready: {
        get: function () {
            return true;
        },
    },

    /**
     * Gets a promise that resolves to true when the provider is ready for use.
     * @memberof MvtProvider.prototype
     * @type {Promise.<Boolean>}
     * @readonly
     */
    readyPromise: {
        get: function () {
            return this._readyPromise;
        },
    },

    /**
     * Gets the credit to display when this imagery provider is active.  Typically this is used to credit
     * the source of the imagery.  This function should not be called before {@link MvtProvider#ready} returns true.
     * @memberof MvtProvider.prototype
     * @type {Credit}
     * @readonly
     */
    credit: {
        get: function () {
            return undefined;
        },
    },

    /**
     * Gets a value indicating whether or not the images provided by this imagery provider
     * include an alpha channel.  If this property is false, an alpha channel, if present, will
     * be ignored.  If this property is true, any images without an alpha channel will be treated
     * as if their alpha is 1.0 everywhere.  Setting this property to false reduces memory usage
     * and texture upload time.
     * @memberof MvtProvider.prototype
     * @type {Boolean}
     * @readonly
     */
    hasAlphaChannel: {
        get: function () {
            return true;
        },
    },
});

/**
 * Gets the credits to be displayed when a given tile is displayed.
 *
 * @param {Number} x The tile X coordinate.
 * @param {Number} y The tile Y coordinate.
 * @param {Number} level The tile level;
 * @returns {Credit[]} The credits to be displayed when the tile is displayed.
 *
 * @exception {DeveloperError} <code>getTileCredits</code> must not be called before the imagery provider is ready.
 */
MvtProvider.prototype.getTileCredits = function (
    x,
    y,
    level
) {
    return undefined;
};

function layersPBFReader(tag, layers, pbf) {
    if (tag === 3) {
        const layer = {
            keys: [],
            values: [],
            features: [],
        };
        const end = pbf.readVarint() + pbf.pos;
        pbf.readFields(layerPBFReader, layer, end);
        layer.length = layer.features.length;
        if (layer.length) {
            layers[layer.name] = layer;
        }
    }
}


function layerPBFReader(tag, layer, pbf) {
    if (tag === 15) {
        layer.version = pbf.readVarint();
    } else if (tag === 1) {
        layer.name = pbf.readString();
    } else if (tag === 5) {
        layer.extent = pbf.readVarint();
    } else if (tag === 2) {
        layer.features.push(pbf.pos);
    } else if (tag === 3) {
        layer.keys.push(pbf.readString());
    } else if (tag === 4) {
        let value = null;
        const end = pbf.readVarint() + pbf.pos;
        while (pbf.pos < end) {
            tag = pbf.readVarint() >> 3;
            value =
                tag === 1
                    ? pbf.readString()
                    : tag === 2
                        ? pbf.readFloat()
                        : tag === 3
                            ? pbf.readDouble()
                            : tag === 4
                                ? pbf.readVarint64()
                                : tag === 5
                                    ? pbf.readVarint()
                                    : tag === 6
                                        ? pbf.readSVarint()
                                        : tag === 7
                                            ? pbf.readBoolean()
                                            : null;
        }
        layer.values.push(value);
    }
}

function readFeatures(source, options) {
    const layers = this.layers_;
    options = this.adaptOptions(options);
    const dataProjection = get(options.dataProjection);
    dataProjection.setWorldExtent(options.extent);
    options.dataProjection = dataProjection;

    const pbf = new PBF(/** @type {ArrayBuffer} */(source));
    const pbfLayers = pbf.readFields(layersPBFReader, {});
    const features = [];
    for (const name in pbfLayers) {
        if (layers && !layers.includes(name)) {
            continue;
        }
        const pbfLayer = pbfLayers[name];

        const extent = pbfLayer ? [0, 0, pbfLayer.extent, pbfLayer.extent] : null;
        dataProjection.setExtent(extent);

        for (let i = 0, ii = pbfLayer.length; i < ii; ++i) {
            const rawFeature = readRawFeature(pbf, pbfLayer, i);
            const feature = this.createFeature_(pbf, rawFeature, options);
            if (feature !== null) {
                features.push(feature);
            }
        }
    }

    return features;
}

function readRawFeature(pbf, layer, i) {
    pbf.pos = layer.features[i];
    const end = pbf.readVarint() + pbf.pos;

    const feature = {
        layer: layer,
        type: 0,
        properties: {},
    };
    pbf.readFields(featurePBFReader, feature, end);
    return feature;
}

function featurePBFReader(tag, feature, pbf) {
    if (tag == 1) {
        feature.id = pbf.readVarint();
    } else if (tag == 2) {
        const end = pbf.readVarint() + pbf.pos;
        while (pbf.pos < end) {
            const key = feature.layer.keys[pbf.readVarint()];
            const value = feature.layer.values[pbf.readVarint()];
            feature.properties[key] = value;
        }
    } else if (tag == 3) {
        feature.type = pbf.readVarint();
    } else if (tag == 4) {
        feature.geometry = pbf.pos;
    }
}

function getGeometryType(type, numEnds) {
    /** @type {import("../geom/Geometry.js").Type} */
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
}

/**
 * Requests the image for a given tile.  This function should
 * not be called before {@link MvtProvider#ready} returns true.
 *
 * @param {Number} x The tile X coordinate.
 * @param {Number} y The tile Y coordinate.
 * @param {Number} level The tile level.
 * @param {Request} [request] The request object. Intended for internal use only.
 * @returns {Promise.<HTMLCanvasElement>} The resolved image as a Canvas DOM object.
 */
MvtProvider.prototype.requestImage = async function (
    x,
    y,
    level,
    request
) {
    const canvas = document.createElement("canvas");
    canvas.width = 4096;
    canvas.height = 4096;
    const context = canvas.getContext("2d");

    const cssColor = this._color.toCssColorString();

    if (x !== 67465 || y !== 43476 || level !== 17) {
        // if(x === 67465 && y === 43476 && level === 17){
        const response = await fetch(this.url.replace("{z}", level.toString()).replace("{x}", x.toString()).replace("{y}", y.toString()));
        const data = await response.arrayBuffer();

        //zlib.gunzip(data, function(err, buffer) {
        //    var tile = new VectorTile(new Protobuf(buffer));
        //});

        const pbf = new PBF(data);
        const pbfLayers = pbf.readFields(layersPBFReader, {});
        const features = [];
        for (const name in pbfLayers) {
            // if (layers && !layers.includes(name)) {
            //   continue;
            // }
            const pbfLayer = pbfLayers[name];

            const extent = pbfLayer ? [0, 0, pbfLayer.extent, pbfLayer.extent] : null;
            // dataProjection.setExtent(extent);

            for (let i = 0, ii = pbfLayer.length; i < ii; ++i) {
                const rawFeature = readRawFeature(pbf, pbfLayer, i);
                const feature = createFeature_(pbf, rawFeature);
                if (feature !== null) {
                    features.push(feature);
                }
            }
        }


        /*     const features = [];
        for (const name in pbfLayers) {
          if (layers && !layers.includes(name)) {
            continue;
          }
          const pbfLayer = pbfLayers[name];
    
          const extent = pbfLayer ? [0, 0, pbfLayer.extent, pbfLayer.extent] : null;
          dataProjection.setExtent(extent);
    
          for (let i = 0, ii = pbfLayer.length; i < ii; ++i) {
            const rawFeature = readRawFeature(pbf, pbfLayer, i);
            const feature = this.createFeature_(pbf, rawFeature, options);
            if (feature !== null) {
              features.push(feature);
            }
          } 
        }*/


        context.strokeStyle = cssColor;
        context.lineWidth = 2;
        context.strokeRect(1, 1, 255, 255);

        context.font = "bold 25px Arial";
        context.textAlign = "center";
        //context.fillStyle = cssColor;

        //context.fillStyle = '#f00';
        for (let i = 0; i < features.length; i++) {
            const f = features[i];
            context.fillStyle = f.color;

            if (f.type === "Polygon") {

                context.beginPath();
                for (let j = 0; j < f.coords.length - 1; j += 2) {
                    if (j === 0) {
                        context.moveTo(f.coords[0], f.coords[1]);
                    } else {
                        context.lineTo(f.coords[j], f.coords[j + 1]);
                    }
                }

                //context.closePath();
                context.fill();

            } else if (f.type === "MultiPolygon") {
                //console.log(f.type);
                let prevEnd = 0;

                context.beginPath();

                for (let j = 0; j < f.ends.length; j++) {
                    const end = f.ends[j][0];

                    for (let k = prevEnd; k < end -1; k += 2) {
                        if (k === prevEnd) {
                            context.moveTo(f.coords[k], f.coords[k + 1]);
                        } else {
                            context.lineTo(f.coords[k], f.coords[k + 1]);
                        }
                    }

                    context.closePath();
                    prevEnd = end;
                }

                context.fill();
            }
        }
        //context.fillText(`DEZE TEGEL ${pbfLayers}`, 124, 136);

        return Promise.resolve(canvas);
    } else {
        context.strokeStyle = cssColor;
        context.lineWidth = 2;
        context.strokeRect(1, 1, 255, 255);

        context.font = "bold 25px Arial";
        context.textAlign = "center";
        context.fillStyle = cssColor;
        context.fillText(`L: ${level}`, 124, 86);
        context.fillText(`X: ${x}`, 124, 136);
        context.fillText(`Y: ${y}`, 124, 186);

        return Promise.resolve(canvas);
    }
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createFeature_(pbf, rawFeature) {
    const type = rawFeature.type;
    if (type === 0) {
        return null;
    }

    let feature;
    const values = rawFeature.properties;

    //values[this.layerName_] = rawFeature.layer.name;
    const flatCoordinates = /** @type {Array<number>} */ ([]);
    let ends = /** @type {Array<number>} */ ([]);
    //console.log(values);
    readRawGeometry_(pbf, rawFeature, flatCoordinates, ends);


    let geometryType = getGeometryType(type, ends.length);

    if (geometryType == 'Polygon') {
        ends = inflateEnds(flatCoordinates, ends);
        geometryType = ends.length > 1 ? "MultiPolygon" : "Polygon";
    }

    return { type: geometryType, coords: flatCoordinates, color: values.color, ends: ends };
    console.log(geometryType, flatCoordinates);

    return null;
    if (this.featureClass_ === RenderFeature) {
        feature = new this.featureClass_(
            geometryType,
            flatCoordinates,
            ends,
            values,
            id
        );
        //feature.transform(options.dataProjection);
    } else {
        let geom;
        if (geometryType == 'Polygon') {
            console.log(flatCoordinates);
            //const endss = inflateEnds(flatCoordinates, ends);
            //geom =
            //  endss.length > 1
            //    ? new MultiPolygon(flatCoordinates, 'XY', endss)
            //    : new Polygon(flatCoordinates, 'XY', ends);
        } else {
            //geom =
            //  geometryType === 'Point'
            //    ? new Point(flatCoordinates, 'XY')
            //    : geometryType === 'LineString'
            //    ? new LineString(flatCoordinates, 'XY')
            //    : geometryType === 'MultiPoint'
            //    ? new MultiPoint(flatCoordinates, 'XY')
            //    : geometryType === 'MultiLineString'
            //    ? new MultiLineString(flatCoordinates, 'XY', ends)
            //    : null;
        }
        //const ctor = /** @type {typeof import("../Feature.js").default} */ (
        //  this.featureClass_
        //);
        //feature = new ctor();
        //if (this.geometryName_) {
        //  feature.setGeometryName(this.geometryName_);
        // }
        // const geometry = transformGeometryWithOptions(geom, false, options);
        // feature.setGeometry(geometry);
        // if (id !== undefined) {
        //  feature.setId(id);
        // }
        // feature.setProperties(values, true);
    }

    return feature;
}

function inflateEnds(flatCoordinates, ends) {
    const endss = [];
    let offset = 0;
    let prevEndIndex = 0;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
        const end = ends[i];
        // classifies an array of rings into polygons with outer rings and holes
        if (!linearRingIsClockwise(flatCoordinates, offset, end, 2)) {
            endss.push(ends.slice(prevEndIndex, i + 1));
        } else {
            if (endss.length === 0) {
                continue;
            }
            endss[endss.length - 1].push(ends[prevEndIndex]);
        }
        prevEndIndex = i + 1;
        offset = end;
    }
    return endss;
}

function linearRingIsClockwise(flatCoordinates, offset, end, stride) {
    // https://stackoverflow.com/q/1165647/clockwise-method#1165943
    // https://github.com/OSGeo/gdal/blob/master/gdal/ogr/ogrlinearring.cpp
    let edge = 0;
    let x1 = flatCoordinates[end - stride];
    let y1 = flatCoordinates[end - stride + 1];
    for (; offset < end; offset += stride) {
        const x2 = flatCoordinates[offset];
        const y2 = flatCoordinates[offset + 1];
        edge += (x2 - x1) * (y2 + y1);
        x1 = x2;
        y1 = y2;
    }
    return edge === 0 ? undefined : edge > 0;
}

function readRawGeometry_(pbf, feature, flatCoordinates, ends) {
    pbf.pos = feature.geometry;

    const end = pbf.readVarint() + pbf.pos;
    let cmd = 1;
    let length = 0;
    let x = 0;
    let y = 0;
    let coordsLen = 0;
    let currentEnd = 0;

    while (pbf.pos < end) {
        if (!length) {
            const cmdLen = pbf.readVarint();
            cmd = cmdLen & 0x7;
            length = cmdLen >> 3;
        }

        length--;

        if (cmd === 1 || cmd === 2) {
            x += pbf.readSVarint();
            y += pbf.readSVarint();

            if (cmd === 1) {
                // moveTo
                if (coordsLen > currentEnd) {
                    ends.push(coordsLen);
                    currentEnd = coordsLen;
                }
            }

            flatCoordinates.push(x, y);
            coordsLen += 2;
        } else if (cmd === 7) {
            if (coordsLen > currentEnd) {
                // close polygon
                flatCoordinates.push(
                    flatCoordinates[currentEnd],
                    flatCoordinates[currentEnd + 1]
                );
                coordsLen += 2;
            }
        } else {
            assert(false, 59); // Invalid command found in the PBF
        }
    }

    if (coordsLen > currentEnd) {
        ends.push(coordsLen);
        currentEnd = coordsLen;
    }
}

/* createFeature_(pbf, rawFeature, options) {
    const type = rawFeature.type;
    if (type === 0) {
      return null;
    }

    let feature;
    const values = rawFeature.properties;

    let id;
    if (!this.idProperty_) {
      id = rawFeature.id;
    } else {
      id = values[this.idProperty_];
      delete values[this.idProperty_];
    }

    values[this.layerName_] = rawFeature.layer.name;

    const flatCoordinates =  ([]);
    const ends =  ([]);
    this.readRawGeometry_(pbf, rawFeature, flatCoordinates, ends);

    const geometryType = getGeometryType(type, ends.length);

    if (this.featureClass_ === RenderFeature) {
      feature = new this.featureClass_(
        geometryType,
        flatCoordinates,
        ends,
        values,
        id
      );
      feature.transform(options.dataProjection);
    } else {
      let geom;
      if (geometryType == 'Polygon') {
        const endss = inflateEnds(flatCoordinates, ends);
        geom =
          endss.length > 1
            ? new MultiPolygon(flatCoordinates, 'XY', endss)
            : new Polygon(flatCoordinates, 'XY', ends);
      } else {
        geom =
          geometryType === 'Point'
            ? new Point(flatCoordinates, 'XY')
            : geometryType === 'LineString'
            ? new LineString(flatCoordinates, 'XY')
            : geometryType === 'MultiPoint'
            ? new MultiPoint(flatCoordinates, 'XY')
            : geometryType === 'MultiLineString'
            ? new MultiLineString(flatCoordinates, 'XY', ends)
            : null;
      }
      const ctor = (
        this.featureClass_
      );
      feature = new ctor();
      if (this.geometryName_) {
        feature.setGeometryName(this.geometryName_);
      }
      const geometry = transformGeometryWithOptions(geom, false, options);
      feature.setGeometry(geometry);
      if (id !== undefined) {
        feature.setId(id);
      }
      feature.setProperties(values, true);
    }

    return feature;
  } */

/**
 * Picking features is not currently supported by this imagery provider, so this function simply returns
 * undefined.
 *
 * @param {Number} x The tile X coordinate.
 * @param {Number} y The tile Y coordinate.
 * @param {Number} level The tile level.
 * @param {Number} longitude The longitude at which to pick features.
 * @param {Number} latitude  The latitude at which to pick features.
 * @return {undefined} Undefined since picking is not supported.
 */
MvtProvider.prototype.pickFeatures = function (
    x,
    y,
    level,
    longitude,
    latitude
) {
    return undefined;
};
export default MvtProvider;