export default function formatCount(count: number) {
  const abbreviations = ["K", "M", "B", "T"];
  for (let i = abbreviations.length - 1; i >= 0; i--) {
    const size = Math.pow(10, (i + 1) * 3);
    if (size <= count) {
      const formattedCount = Math.round((count / size) * 10) / 10;
      return `${formattedCount}${abbreviations[i]}`;
    }
  }
  return `${count}`;
}
