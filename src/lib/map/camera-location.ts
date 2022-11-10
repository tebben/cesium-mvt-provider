import { Location } from "./location";

export class CameraLocation extends Location {
    public heading: number;
    public pitch: number;
    public duration: number;

    constructor(x: number, y: number, z: number, heading: number = 0, pitch: number = 0, duration: number = 0) {
        super(x, y, z);
        this.heading = heading;
        this.pitch = pitch;
        this.duration = duration;
    }
}