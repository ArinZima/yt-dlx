import pandas as pd
import seaborn as sns
from tensorflow import keras
import matplotlib.pyplot as plt
from keras.utils import plot_model
from keras import layers, regularizers
from keras_tuner.tuners import RandomSearch
from sklearn.model_selection import train_test_split
from keras.callbacks import ModelCheckpoint, EarlyStopping, TensorBoard

callbacks = [
    ModelCheckpoint(
        monitor="val_loss",
        save_best_only=True,
        filepath="model/rs_guwahati/best_model.h5",
    ),
    EarlyStopping(monitor="val_loss", patience=10),
    TensorBoard(log_dir="./model/rs_guwahati/logs"),
]


class WaterPollutionModel:
    def __init__(self, data_path):
        self.data_path = data_path
        self.data = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.tuner = None
        self.model = None
        self.history = None

    def load_data(self):
        self.data = pd.read_csv(self.data_path)
        self.data = self.data.dropna()

    def preprocess_data(self):
        self.data = self.data.drop(["STATION CODE", "LOCATIONS", "YEAR"], axis=1)
        X = self.data.drop(["CONDUCTIVITY"], axis=1)
        y = self.data["CONDUCTIVITY"]
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

    def build_model(self, hp):
        model = keras.Sequential()
        model.add(
            layers.Dense(
                units=hp.Int("units_input", min_value=64, max_value=1024, step=64),
                activation=hp.Choice(
                    "activation_input", values=["relu", "tanh", "sigmoid"]
                ),
                kernel_regularizer=regularizers.l2(
                    hp.Choice("l2_regularization_input", values=[0.001, 0.01, 0.1])
                ),
                input_dim=self.X_train.shape[1],
            )
        )
        model.add(
            layers.Dropout(
                hp.Float("dropout_input", min_value=0.2, max_value=0.5, step=0.1)
            )
        )
        for i in range(hp.Int("num_layers", 1, 4)):
            model.add(
                layers.Dense(
                    units=hp.Int(f"units_{i+1}", min_value=64, max_value=1024, step=64),
                    activation=hp.Choice(
                        f"activation_{i+1}", values=["relu", "tanh", "sigmoid"]
                    ),
                    kernel_regularizer=regularizers.l2(
                        hp.Choice(f"l2_regularization_{i+1}", values=[0.001, 0.01, 0.1])
                    ),
                )
            )
            model.add(
                layers.Dropout(
                    hp.Float(f"dropout_{i+1}", min_value=0.2, max_value=0.7, step=0.1)
                )
            )

        model.add(layers.Dense(1, activation="linear"))
        lr = hp.Choice("learning_rate", values=[1e-4, 1e-5, 1e-6])
        model.compile(optimizer=keras.optimizers.Adam(lr), loss="mse", metrics=["mae"])
        return model

    def tune_model(
        self, max_trials=200, seed=None, project_name="model/rs_guwahati/core"
    ):
        self.tuner = RandomSearch(
            self.build_model,
            seed=seed,
            objective="val_mae",
            max_trials=max_trials,
            project_name=project_name,
        )
        self.tuner.search(
            self.X_train,
            self.y_train,
            epochs=max_trials,
            callbacks=callbacks,
            validation_data=(self.X_test, self.y_test),
        )

    def train_best_model(self, epochs=200):
        best_hps = self.tuner.get_best_hyperparameters(num_trials=1)[0]
        self.model = self.tuner.hypermodel.build(best_hps)
        self.history = self.model.fit(
            self.X_train,
            self.y_train,
            epochs=epochs,
            callbacks=callbacks,
            validation_data=(self.X_test, self.y_test),
        )
        self.model.load_weights("model/rs_guwahati/best_model.h5")

    def save_model_architecture(self, filename="model/rs_guwahati/architecture.json"):
        model_json = self.model.to_json()
        with open(filename, "w") as json_file:
            json_file.write(model_json)

    def evaluate_model(self):
        loss, mae = self.model.evaluate(self.X_test, self.y_test, verbose=0)
        print(f"Mean Absolute Error: {mae} | Loss: {loss}")

    def plot_loss(self):
        sns.set_theme(style="whitegrid")
        plt.figure(figsize=(10, 6))
        plt.plot(self.history.history["loss"], label="Training Loss")
        plt.plot(self.history.history["val_loss"], label="Validation Loss")
        plt.xlabel("Epochs")
        plt.ylabel("Loss")
        plt.title("Training and Validation Loss")
        plt.legend()
        plt.savefig("model/rs_guwahati/loss_plot.png")
        plt.close()

    def plot_mae(self):
        sns.set_theme(style="whitegrid")
        plt.figure(figsize=(10, 6))
        plt.plot(self.history.history["mae"], label="Training MAE")
        plt.plot(self.history.history["val_mae"], label="Validation MAE")
        plt.xlabel("Epochs")
        plt.ylabel("MAE")
        plt.title("Training and Validation MAE")
        plt.legend()
        plt.savefig("model/rs_guwahati/mae_plot.png")
        plt.close()

    def plot_model_architecture(
        self, filename="model/rs_guwahati/model_architecture.png"
    ):
        plot_model(
            self.model, to_file=filename, show_shapes=True, show_layer_names=True
        )


data_path = "db/Guwahati.csv"
water_model = WaterPollutionModel(data_path)
water_model.load_data()
water_model.preprocess_data()
water_model.tune_model()
water_model.train_best_model()
water_model.save_model_architecture()
water_model.evaluate_model()
water_model.plot_loss()
water_model.plot_mae()
water_model.plot_model_architecture()
