import os from "os";
import cluster from "cluster";
import ffmpeg from "fluent-ffmpeg";

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  process.on("message", (task) => {
    ffmpeg(task.input)
      .output(task.output)
      .on("end", () => {
        process.send({ status: "success", taskId: task.id });
      })
      .on("error", (err) => {
        process.send({ status: "error", taskId: task.id, error: err.message });
      })
      .run();
  });
}
