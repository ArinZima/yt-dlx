export default function lowEntry(out: any[]) {
  if (!out || out.length === 0) return null;
  return out.reduce(
    (
      prev: { meta_info: { filesizebytes: number } },
      curr: { meta_info: { filesizebytes: number } }
    ) =>
      prev.meta_info.filesizebytes < curr.meta_info.filesizebytes ? prev : curr,
    out[0]
  );
}
