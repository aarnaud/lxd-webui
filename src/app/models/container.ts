export class Container {
    name: string;
    architecture: string;
    created_at: Date;
    ephemeral: Boolean;
    profiles: string[];
    status: string;
    status_code: number;

    constructor(metadata: any) {
        Object.assign(this, metadata);
    }

    public isRunning(): boolean {
        return (this.status_code === 103);
    }

    public isStopped(): boolean {
        return (this.status_code === 102);
    }
}
