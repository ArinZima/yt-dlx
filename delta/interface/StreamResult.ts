import { Readable } from "stream";
export default interface StreamResult {
  stream: Readable;
  filename: string;
}
