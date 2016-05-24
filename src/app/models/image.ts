export interface ImageAlias {
    name: string;
    description: string;
}

export class Image {
    aliases: ImageAlias[];
    architecture: string;
    auto_update: boolean;
    cached: boolean;
    fingerprint: string;
    filename: string;
    properties: any;
    update_source: any;
    public: boolean;
    size: number;
    created_at: Date;
    expires_at: Date;
    last_used_at: Date;
    uploaded_at: Date;

    constructor(metadata: any) {
        Object.assign(this, metadata);
    }

    get shortFingerprint(){
        return this.fingerprint.substring(0, 12);
    }
}
