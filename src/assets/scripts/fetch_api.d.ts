declare class fetch_api {
    host: string | undefined;
    port: string | undefined;
    ssl: boolean;

    constructor(args: { host: string | undefined; port: string | undefined });

    getServerAddress(): string;

    postJson: (
        route: string,
        body: object,
        callback?: (data: object) => void | null
    ) => void;

    getPdf: (
        route: string,
        callback?: (blob: BlobPart) => void | null
    ) => void;
}

export default fetch_api;