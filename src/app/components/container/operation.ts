export interface Operation {
    class: string;
    created_at: Date;
    err: string;
    id: string;
    may_cancel: Boolean;
    metadata: any;
    resources: any;
    status: string;
    status_code: number;
    updated_at: Date;
}
