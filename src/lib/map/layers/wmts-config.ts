
export class Wmtsconfig {
    public background?: boolean;
    public url!: string;
    public featureName!: string;
    public contentType?: string;
    public matrixIds?: Array<string>;

    constructor(init?: Partial<Wmtsconfig>) {
        Object.assign(this, init);
    }
}