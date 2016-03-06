export interface Container {
    name: string;
    architecture: string;
    created_at: Date;
    ephemeral: Boolean;
    profiles: string[];
    status: string;
}