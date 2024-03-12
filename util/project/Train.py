import os
import pandas as pd
import tensorflow as tf
from loguru import logger
from tensorflow import keras
from colorama import init, Fore
from keras_tuner.tuners import Hyperband
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import KFold

init()
gpus = tf.config.list_physical_devices("GPU")
os.system("cls" if os.name == "nt" else "clear")

if gpus:
    tf.config.set_visible_devices(gpus[0], "GPU")
    logical_gpus = tf.config.list_logical_devices("GPU")
    logger.info(f"{Fore.GREEN}@info:{Fore.RESET} GPU found")
    data = pd.read_csv("Guwahati.csv")
    X = data[["TEMPERATURE", "pH", "CONDUCTIVITY", "BOD", "NITRATE"]]
    y = data["YEAR"]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    kfold = KFold(n_splits=5, shuffle=True, random_state=42)
    best_fold_index = -1
    best_mae = float("inf")
    for fold_index, (train_index, test_index) in enumerate(kfold.split(X_scaled)):
        X_train, X_test = X_scaled[train_index], X_scaled[test_index]
        y_train, y_test = y[train_index], y[test_index]

        def build_model(hp):
            model = keras.Sequential()
            model.add(
                keras.layers.Dense(
                    units=hp.Int("units", min_value=32, max_value=512, step=32),
                    activation="relu",
                    input_shape=(X_train.shape[1],),
                )
            )
            model.add(keras.layers.Dense(1))
            model.compile(
                optimizer=keras.optimizers.Adam(
                    hp.Choice("learning_rate", values=[1e-2, 1e-3, 1e-4])
                ),
                loss="mse",
                metrics=["mae"],
            )
            return model

        tuner = Hyperband(
            build_model,
            seed=42,
            max_epochs=100,
            objective="val_loss",
            executions_per_trial=3,
            directory=f"HyBnFo/HyBnFo_{fold_index}",
            project_name=f"water_pollution_model_fold_{fold_index}",
        )
        tuner.search(X_train, y_train, epochs=5, validation_data=(X_test, y_test))
        best_hyperparameters = tuner.get_best_hyperparameters(1)[0]
        best_model = tuner.hypermodel.build(best_hyperparameters)
        best_model.fit(X_train, y_train, epochs=100, validation_data=(X_test, y_test))
        loss, mae = best_model.evaluate(X_test, y_test)
        print(f"Test MAE for Fold {fold_index}: {mae}")
        if mae < best_mae:
            best_mae = mae
            best_fold_index = fold_index
            best_model.save("best_model.h5")
    logger.info(
        f"{Fore.GREEN}@info:{Fore.RESET} Best model is from Fold {best_fold_index} with MAE {best_mae}"
    )
