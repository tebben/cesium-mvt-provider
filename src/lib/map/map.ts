import * as Cesium from "cesium";
import { get, writable } from "svelte/store";

import type { Writable } from "svelte/store";
import { CameraLocation } from "$lib/map/camera-location";
import { Wmtsconfig } from "$lib/map/layers/wmts-config";
import { WmtsLayer } from "$lib/map/layers/wmts-layer";
import { TestLayer } from "./layers/test-layer";

export class Map {
	public viewer!: Cesium.Viewer;
	public camera!: Cesium.Camera;
	public container!: HTMLElement;

	public ready: Writable<boolean>;
	public startPosition: CameraLocation | undefined;
	public layers: Writable<Array<any>>;

	constructor() {
		this.layers = writable<Array<any>>(new Array<any>());
		this.ready = writable<boolean>(false);

		this.ready.subscribe(r => {
			if (r) { this.onReady(); }
		});
	}

	private onReady() {
		this.addDefault();
		this.home();
	}

	private addDefault() {
		const lufoConfig = new Wmtsconfig({ background: true, contentType: "image/png", featureName: "2021_orthoHR", url: "https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0?request=GetCapabilities&service=wmts" });
		const wmtsLayer = new WmtsLayer(this, lufoConfig);
		this.addLayer(wmtsLayer);

		this.addLayer(new TestLayer(this));
	}

	private addLayer(layer: any) {
		this.layers.set([...get(this.layers), layer]);
	}

	public initialize(container: HTMLElement, addDefaultBaselayer = false): void {
		this.container = container;
		this.viewer = this.createViewer(container, addDefaultBaselayer);
		this.camera = this.viewer.camera;
		this.viewer.forceResize();

		if (!this.startPosition) {
			this.startPosition = new CameraLocation(
				6.599192,
				53.298561,
				412.5886013073694,
				329,
				-29.189434822434666,
				0
			);
		}

		setTimeout(() => {
			this.ready.set(true);
		}, 1000);
	}

	public getContainer(): HTMLElement {
		return this.container;
	}

	public resetNorth(): void {
		const pos = this.getPosition();
		pos.heading = 0;

		this.flyTo(pos);
	}

	public zoomIn(): void {
		this.viewer?.scene.camera.zoomIn(this.getCameraZoomChange());
		this.refresh();
	}

	public zoomOut(): void {
		this.viewer?.scene.camera.zoomOut(this.getCameraZoomChange());
		this.refresh();
	}

	/**
	 * Fly to a given position with the camera
	 * 
	 * @param position position to fly to
	 */
	public flyTo(position: CameraLocation): void {
		this.camera?.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(position.x, position.y, position.z),
			orientation: {
				heading: Cesium.Math.toRadians(position.heading),
				pitch: Cesium.Math.toRadians(position.pitch),
				roll: 0.0
			},
			duration: position.duration
		});
	}

	/**
	 * Get the current position of the camera
	 * 
	 * @returns Location of the camera
	 */
	public getPosition(): CameraLocation {
		const camPosition = Cesium.Cartographic.fromCartesian(this.camera.position);
		const camHeading = this.camera.heading * Cesium.Math.DEGREES_PER_RADIAN;
		const camPitch = this.camera.pitch * Cesium.Math.DEGREES_PER_RADIAN;

		const position = new CameraLocation(
			(camPosition.longitude / Math.PI) * 180,
			(camPosition.latitude / Math.PI) * 180,
			camPosition.height,
			camHeading,
			camPitch,
			1.5
		);
		return position;
	}

	private createViewer(container: HTMLElement, addDefaultBaselayer: boolean): Cesium.Viewer {
		const viewer = new Cesium.Viewer(container, {
			requestRenderMode: true,
			timeline: false,
			animation: false,
			baseLayerPicker: false,
			homeButton: false,
			navigationHelpButton: false,
			vrButton: false,
			fullscreenButton: false,
			sceneModePicker: false,
			geocoder: false,
			imageryProvider: undefined,
			infoBox: false,
			contextOptions: {
				requestWebgl2: true
			},
			msaaSamples: 1
		});

		viewer.clock.shouldAnimate = false;
		viewer.scene.debugShowFramesPerSecond = false;

		if (addDefaultBaselayer === false) {
			viewer.imageryLayers.removeAll();
		}

		// shadow settings
		viewer.shadows = false;
		viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
		viewer.shadowMap.maximumDistance = 1200;
		viewer.shadowMap.fadingEnabled = false;
		viewer.shadowMap.darkness = 0.65; // higher is less dark

		// resolution settings
		//viewer.resolutionScale = get(this.options.resolutionScale);
		viewer.useBrowserRecommendedResolution = true;

		// sky, rendering settings
		viewer.scene.globe.baseColor = Cesium.Color.WHITE;
		viewer.scene.skyAtmosphere.show = true;
		viewer.scene.fog.enabled = true;
		//viewer.scene.fog.density = 0.005;

		viewer.scene.highDynamicRange = false;
		viewer.scene.postProcessStages.fxaa.enabled = false;

		// Enable going subsurface
		viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;

		// Set sun position
		const date = new Date();
		date.setUTCFullYear(2022, 7, 10);
		date.setUTCHours(13, 0, 0, 0);
		viewer.clock.currentTime = Cesium.JulianDate.fromDate(date);

		//viewer.scene.globe.maximumScreenSpaceError = get(this.options.maximumScreenSpaceError);
		//viewer.scene.globe.enableLighting = get(this.options.lighting);
		//viewer.scene.globe.showGroundAtmosphere = get(this.options.groundAtmosphere);
		//viewer.scene.globe.depthTestAgainstTerrain = true;

		//viewer.clock.onTick.addEventListener((clock) => this._update(clock));
		//viewer.scene.globe.terrainExaggeration = 50;
		//this._addSilhouette(viewer)

		//viewer.scene.globe.translucency.enabled = false; //rwsProject?.menu?.globeOpacity > 0.0 ? true : false;
		//viewer.scene.globe.translucency.frontFaceAlpha = 0.0; //rwsProject?.menu?.globeOpacity ?? 0.0;
		//viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = 0.5;
		//viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = 0.5;

		return viewer;
	}

	/**
	 * Look at a given position with the camers
	 * 
	 * @param targetPosition position to look at
	 */
	public lookAt(targetPosition: Cesium.Cartesian3): void {
		var cameraPosition = this.camera.position.clone();
		var direction = Cesium.Cartesian3.subtract(
			targetPosition,
			cameraPosition,
			new Cesium.Cartesian3()
		);
		direction = Cesium.Cartesian3.normalize(direction, direction);
		this.camera.direction = direction;

		// get an "approximate" up vector, which in this case we want to be something like the geodetic surface normal.
		var approxUp = Cesium.Cartesian3.normalize(
			cameraPosition,
			new Cesium.Cartesian3()
		);

		// cross viewdir with approxUp to get a right normal
		var right = Cesium.Cartesian3.cross(
			direction,
			approxUp,
			new Cesium.Cartesian3()
		);
		right = Cesium.Cartesian3.normalize(right, right);
		this.camera.right = right;

		// cross right with view dir to get an orthonormal up
		var up = Cesium.Cartesian3.cross(
			right,
			direction,
			new Cesium.Cartesian3()
		);
		up = Cesium.Cartesian3.normalize(up, up);
		this.camera.up = up;
	}

	/**
	 * Move camera to start position if set
	 */
	public home(): void {
		if (!this.startPosition) {
			throw new Error("No home position found");
		}

		this.flyTo(this.startPosition);
	}

	/**
	 * Zoom to a position, duration is always set to 0 to skip fly
	 * 
	 * @param position position to zoom to
	 */
	public zoomTo(position: CameraLocation) {
		position.duration = 0;
		this.flyTo(position);
	}

	/**
	 * Get the distance change to next or previous zoom position
	 * 
	 * @returns distance to zoom in our out
	 */
	private getCameraZoomChange(): number {
		const cameraPosition = this.viewer.scene.camera.positionWC;
		const ellipsoidPosition =
			this.viewer.scene.globe.ellipsoid.scaleToGeodeticSurface(cameraPosition);
		const distance = Cesium.Cartesian3.magnitude(
			Cesium.Cartesian3.subtract(cameraPosition, ellipsoidPosition, new Cesium.Cartesian3())
		);

		return distance / 2;
	}

	/**
	 * Refresh the map, only needed if animate is disabled
	 */
	public refresh(): void {
		if (this.viewer && this.viewer.clock.shouldAnimate === false) {
			this.viewer.clock.shouldAnimate = true;
			this.viewer.clock.tick();
			this.viewer.clock.shouldAnimate = false;
		}
	}
}
