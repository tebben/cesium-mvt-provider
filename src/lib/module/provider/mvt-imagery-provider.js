import {
	Color,
	defaultValue,
	defined,
	Event,
	Ellipsoid,
	WebMercatorTilingScheme,
	TilingScheme
} from 'cesium';

// @ts-ignore
import PBF from 'pbf';
import { VectorTile } from '$lib/module/vector-tile/vector-tile';

/**
 * @typedef {Object} MvtImageryProvider.ConstructorOptions
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
 * @alias MvtImageryProvider
 * @constructor
 *
 * @param {MvtImageryProvider.ConstructorOptions} [options] Object describing initialization options
 */
function MvtImageryProvider(url, style, options) {
	options = defaultValue(options, defaultValue.EMPTY_OBJECT);
	this.url = url;
	this.style = style;
	this._tilingScheme = defined(options.tilingScheme)
		? options.tilingScheme
		: new WebMercatorTilingScheme({ ellipsoid: options.ellipsoid });
	this._color = defaultValue(options.color, Color.YELLOW);
	this._errorEvent = new Event();
	this._tileWidth = defaultValue(options.tileWidth, 256);
	this._tileHeight = defaultValue(options.tileHeight, 256);
	this._readyPromise = Promise.resolve(true);

	this.defaultAlpha = undefined;
	this.defaultNightAlpha = undefined;
	this.defaultDayAlpha = undefined;
	this.defaultBrightness = undefined;
	this.defaultContrast = undefined;
	this.defaultHue = undefined;
	this.defaultSaturation = undefined;
	this.defaultGamma = undefined;
	this.defaultMinificationFilter = undefined;
	this.defaultMagnificationFilter = undefined;
}

Object.defineProperties(MvtImageryProvider.prototype, {
	proxy: {
		get: function () {
			return undefined;
		}
	},

	tileWidth: {
		get: function () {
			return this._tileWidth;
		}
	},

	tileHeight: {
		get: function () {
			return this._tileHeight;
		}
	},

	maximumLevel: {
		get: function () {
			return 19;
		}
	},

	minimumLevel: {
		get: function () {
			return undefined;
		}
	},

	tilingScheme: {
		get: function () {
			return this._tilingScheme;
		}
	},

	rectangle: {
		get: function () {
			return this._tilingScheme.rectangle;
		}
	},

	tileDiscardPolicy: {
		get: function () {
			return undefined;
		}
	},

	errorEvent: {
		get: function () {
			return this._errorEvent;
		}
	},

	ready: {
		get: function () {
			return true;
		}
	},

	readyPromise: {
		get: function () {
			return this._readyPromise;
		}
	},

	credit: {
		get: function () {
			return undefined;
		}
	},

	hasAlphaChannel: {
		get: function () {
			return true;
		}
	}
});

MvtImageryProvider.prototype.getTileCredits = function (x, y, level) {
	return undefined;
};

function renderPolygon(context, geoms, properties, extent, style, tileWidth) {
	const div = extent / tileWidth;
	context.fillStyle = properties.color;

	if(style) {
		context.fillStyle = style.getFill(properties[style.fillProperty]);
	}

	for (let i = 0; i < geoms.length; i++) {
		const rings = geoms[i];

		
		for (let j = 0; j < rings.length; j++) {
			if (j === 0) {
				context.beginPath();
			}
	
			let coords = rings[j];

			for (let k = 0; k < coords.length; k++) {
				const x = coords[k].x / div;
				const y = coords[k].y / div;

				if (k === 0) {
					context.moveTo(x, y);
				} else {
					context.lineTo(x, y);
				}
			}
		}

		context.closePath();
		context.fill("evenodd");
	}
}

MvtImageryProvider.prototype.requestImage = async function (x, y, level, request) {
	//const cssColor = this._color.toCssColorString();

	//if (x !== 67465 || y !== 43476 || level !== 17) {
		//if (x === 67465 && y === 43476 && level === 17) {
			const canvas = document.createElement('canvas');
			/* canvas.width = 4096;
			canvas.height = 4096; */
			canvas.width = this._tileWidth;
			canvas.height = this._tileHeight;
			const context = canvas.getContext('2d');
			if (!context) return;

		const response = await fetch(
			this.url
				.replace('{z}', level.toString())
				.replace('{x}', x.toString())
				.replace('{y}', y.toString())
		);
		const data = await response.arrayBuffer();
		const tile = new VectorTile(new PBF(data), 0);

		for (let i = 0; i < Object.keys(tile.layers).length; i++) {
			const layer = tile.layers[Object.keys(tile.layers)[i]];

			for (let j = 0; j < layer.amountOfFeatures; j++) {
				const feature = layer.getFeature(j);
				const type = feature.type;

				if (type === 3) {
					const geom = feature.loadGeometry();
					const classified = feature.classifyRings(geom);
					renderPolygon(context, classified, feature.properties, layer.extent, this.style, this._tileWidth);
				} else {
					console.log(type);
				}
			}
		}

		return Promise.resolve(canvas);
	/* } else {
		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		const context = canvas.getContext('2d');
		if (!context) return;

		context.strokeStyle = cssColor;
		context.lineWidth = 2;
		context.strokeRect(1, 1, 255, 255);

		context.font = 'bold 25px Arial';
		context.textAlign = 'center';
		context.fillStyle = cssColor;
		context.fillText(`L: ${level}`, 124, 86);
		context.fillText(`X: ${x}`, 124, 136);
		context.fillText(`Y: ${y}`, 124, 186);

		return Promise.resolve(canvas);
	} */
};

MvtImageryProvider.prototype.pickFeatures = function (x, y, level, longitude, latitude) {
	return undefined;
};

export default MvtImageryProvider;
