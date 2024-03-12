import os
import time
import tensorflow as tf
from loguru import logger
from colorama import init, Fore

init()


def gpu_function():
    if tf.test.gpu_device_name():
        logger.info(f"{Fore.GREEN}@info:{Fore.RESET} GPU found")
    else:
        logger.error(f"{Fore.RED}@error:{Fore.RESET} GPU not found")
    x = tf.random.normal([8000, 8000])
    start_time = time.time()
    tf.matmul(x, x)
    elapsed_time = time.time() - start_time
    logger.info(
        f"{Fore.GREEN}@info:{Fore.RESET} GPU computation time: {elapsed_time * 1000:.2f} MS "
        f"({elapsed_time:.2f} S, {elapsed_time / 60:.2f} M, {elapsed_time / 3600:.2f} H)"
    )


def cpu_function():
    x = tf.random.normal([8000, 8000])
    start_time = time.time()
    tf.matmul(x, x)
    elapsed_time = time.time() - start_time
    logger.info(
        f"{Fore.GREEN}@info:{Fore.RESET} CPU computation time: {elapsed_time * 1000:.2f} MS "
        f"({elapsed_time:.2f} S, {elapsed_time / 60:.2f} M, {elapsed_time / 3600:.2f} H)"
    )


if __name__ == "__main__":
    logger.info(f"{Fore.GREEN}@info:{Fore.RESET} running GPU function:")
    gpu_function()
    logger.info(f"{Fore.GREEN}@info:{Fore.RESET} running CPU function:")
    cpu_function()
