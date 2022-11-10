<script lang="ts">
	import { onMount } from "svelte";
	import { Map } from "$lib/map/map";

	import "/node_modules/cesium/Build/Cesium/Widgets/widgets.css";

	export let map: Map = new Map();

	let viewer: HTMLElement;

	onMount(async () => {
		// @ts-ignore: now it exists!
		window.CESIUM_BASE_URL = "Cesium";
		map.initialize(viewer, false);
	});
</script>

<div bind:this={viewer} class="cesiumContainer">

</div>

<style>
	.cesiumContainer {
		position: relative;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
		box-sizing: border-box;
	}

	:global(.cesium-widget-credits) {
		display: none !important;
	}
</style>
