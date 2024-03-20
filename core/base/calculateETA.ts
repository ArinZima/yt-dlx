export default function calculateETA(startTime: any, percent: any) {
  const currentTime: any = new Date();
  const elapsedTime = (currentTime - startTime) / 1000;
  const remainingTime = (elapsedTime / percent) * (100 - percent);
  return remainingTime.toFixed(2);
}
