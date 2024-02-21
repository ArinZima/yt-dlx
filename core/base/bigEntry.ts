export default function bigEntry(metaBody: any[]) {
  if (!metaBody || metaBody.length === 0) return null;
  return metaBody.reduce(
    (
      prev: { meta_info: { filesizebytes: number } },
      curr: { meta_info: { filesizebytes: number } }
    ) =>
      prev.meta_info.filesizebytes > curr.meta_info.filesizebytes ? prev : curr,
    metaBody[0]
  );
}
