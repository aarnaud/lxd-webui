export class Profile {
    name: string;
    description: string;
    config: any;
    devices: any;

    constructor(metadata: any) {
        Object.assign(this, metadata);
    }

    get configPrettyJson(): string {
        return JSON.stringify(this.config, undefined, 2);
    }

    get devicesPrettyJson(): string {
        return JSON.stringify(this.devices, undefined, 2);
    }
}
