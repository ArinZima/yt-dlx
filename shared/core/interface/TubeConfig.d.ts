export default interface TubeConfig {
    Audio: {
        codec: string;
        bitrate: number;
        channels: number;
        extension: string;
        samplerate: number;
    };
    Video: {
        width: number;
        codec: string;
        height: number;
        bitrate: number;
        extension: string;
        resolution: string;
        aspectratio: number;
    };
    AVDownload: {
        mediaurl: string;
        formatid: string;
        formatnote: string;
        originalformat: string;
    };
    AVInfo: {
        dynamicrange: string;
        totalbitrate: number;
        filesizebytes: number;
        framespersecond: number;
        qriginalextension: string;
        extensionconatainer: string;
        filesizeformatted: string | number;
    };
}
//# sourceMappingURL=TubeConfig.d.ts.map