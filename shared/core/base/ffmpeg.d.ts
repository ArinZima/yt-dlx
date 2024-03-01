import type { FfmpegCommand } from "fluent-ffmpeg";
export default function ffmpeg(): Promise<FfmpegCommand>;
/**
 * This function is not available
 *
 * let bvc: string | null = null;
 * let bac: string | null = null;
 * fluentffmpeg.getAvailableCodecs((err, codecs) => {
 * if (err) reject({ bvc: null, bac: null });
 * if (!codecs) reject({ bvc: null, bac: null });
 * Object.keys(codecs).forEach((codec) => {
 * if (codec.includes("h264") || codec.includes("hevc")) {
 * const ci = codecs[codec] as { capabilities?: string[] };
 * if (!bvc || ci.capabilities?.includes("GPU")) bvc = codec;
 * }
 * if (codec.includes("aac") || codec.includes("mp3")) {
 * const ci = codecs[codec] as { capabilities?: string[] };
 * if (!bac || ci.capabilities?.includes("GPU")) bac = codec;
 * }
 * });
 * if (bac && bvc) {
 * console.log(colors.green("@ffmpeg:"), "using video codec", bvc);
 * console.log(colors.green("@ffmpeg:"), "using audio codec", bac);
 * proc.videoCodec(bvc);
 * proc.audioCodec(bac);
 * } else {
 * console.log(colors.yellow("@ffmpeg:"), "no video & audio codec found.");
 * proc.videoCodec("");
 * proc.audioCodec("");
 * }
 * proc.videoCodec("");
 * proc.audioCodec("");
 * resolve(proc);
 * });
 *
 */
//# sourceMappingURL=ffmpeg.d.ts.map