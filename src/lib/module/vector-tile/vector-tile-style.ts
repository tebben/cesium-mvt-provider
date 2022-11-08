export class VectorTileStyle {
    fillProperty: string;
    fill: { [key: string]: string };
    fillDefault: string;

    constructor(fillProperty: string, fill: { [key: string]: string }, fillDefault: string = "#fff") {
        this.fillProperty = fillProperty;
        this.fill = fill;
        this.fillDefault = fillDefault;
    }

    public getFill(id: string): string {
        return this.fill[id] ?? this.fillDefault;
    }
}