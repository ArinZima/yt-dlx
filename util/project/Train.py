import pandas as pd
from tensorflow import keras
import matplotlib.pyplot as plt
from keras import layers, regularizers
from keras_tuner.tuners import RandomSearch
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from keras.callbacks import ModelCheckpoint, EarlyStopping, TensorBoard


class WaterPollutionModel:
    def __init__(self, data_path):
        self.data_path = data_path
        self.data = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.label_encoder = LabelEncoder()
        self.tuner = None
        self.model = None
        self.history = None

    def load_data(self):
        self.data = pd.read_csv(self.data_path)
        self.data = self.data.dropna()

    def preprocess_data(self):
        for col in self.data.columns:
            if self.data[col].dtype == "object":
                self.data[col] = self.label_encoder.fit_transform(self.data[col])
        X = self.data.drop(
            ["STATION CODE", "LOCATIONS", "STATE", "year", "CONDUCTIVITY (mhos/cm)"],
            axis=1,
        )
        y = self.data["CONDUCTIVITY (mhos/cm)"]
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

    def build_model(self, hp):
        model = keras.Sequential()
        model.add(
            layers.Dense(
                units=hp.Int("units_1", min_value=64, max_value=512, step=64),
                activation="relu",
                kernel_regularizer=regularizers.l2(0.001),
                input_dim=self.X_train.shape[1],
            )
        )
        model.add(
            layers.Dropout(
                hp.Float("dropout_1", min_value=0.2, max_value=0.5, step=0.1)
            )
        )

        for i in range(hp.Int("num_layers", 1, 4)):
            model.add(
                layers.Dense(
                    units=hp.Int(f"units_{i+2}", min_value=64, max_value=512, step=64),
                    activation="relu",
                    kernel_regularizer=regularizers.l2(0.001),
                )
            )
            model.add(
                layers.Dropout(
                    hp.Float(f"dropout_{i+2}", min_value=0.2, max_value=0.5, step=0.1)
                )
            )

        model.add(layers.Dense(1, activation="linear"))
        lr = hp.Choice("learning_rate", values=[1e-4, 1e-5, 1e-6])

        model.compile(
            optimizer=keras.optimizers.Adam(lr),
            loss="mse",
            metrics=["mae"],
        )
        return model

    def tune_model(self, max_trials=100, seed=None, project_name="model/core"):
        self.tuner = RandomSearch(
            self.build_model,
            max_trials=max_trials,
            seed=seed,
            objective="val_mae",
            project_name=project_name,
        )
        self.tuner.search(
            self.X_train,
            self.y_train,
            epochs=max_trials,
            validation_data=(self.X_test, self.y_test),
            callbacks=[
                ModelCheckpoint(
                    filepath="model/best_model.h5",
                    monitor="val_loss",
                    save_best_only=True,
                ),
                EarlyStopping(monitor="val_loss", patience=10),
                TensorBoard(log_dir="./model/logs"),
            ],
        )

    def _build_hypermodel(self, hp):
        model = self.build_model(hp)
        return model

    def train_best_model(self, epochs=100):
        best_hps = self.tuner.get_best_hyperparameters(num_trials=1)[0]
        self.model = self.tuner.hypermodel.build(best_hps)
        self.history = self.model.fit(
            self.X_train,
            self.y_train,
            epochs=epochs,
            validation_data=(self.X_test, self.y_test),
            callbacks=[
                ModelCheckpoint(
                    filepath="model/best_model.h5",
                    monitor="val_loss",
                    save_best_only=True,
                ),
                EarlyStopping(monitor="val_loss", patience=10),
                TensorBoard(log_dir="./model/logs"),
            ],
        )
        self.model.load_weights("model/best_model.h5")

    def save_model_architecture(self, filename="model/architecture.json"):
        model_json = self.model.to_json()
        with open(filename, "w") as json_file:
            json_file.write(model_json)

    def evaluate_model(self):
        loss, mae = self.model.evaluate(self.X_test, self.y_test, verbose=0)
        print(f"Mean Absolute Error: {mae}")

    def plot_loss(self):
        plt.plot(self.history.history["loss"], label="Training Loss")
        plt.plot(self.history.history["val_loss"], label="Validation Loss")
        plt.xlabel("Epochs")
        plt.ylabel("Loss")
        plt.legend()
        plt.savefig("model/loss_plot.png")
        plt.close()

    def plot_mae(self):
        plt.plot(self.history.history["mae"], label="Training MAE")
        plt.plot(self.history.history["val_mae"], label="Validation MAE")
        plt.xlabel("Epochs")
        plt.ylabel("MAE")
        plt.legend()
        plt.savefig("model/mae_plot.png")
        plt.close()


data_path = "db/Train.csv"
water_model = WaterPollutionModel(data_path)
water_model.load_data()
water_model.preprocess_data()
water_model.tune_model()
water_model.train_best_model()
water_model.save_model_architecture()
water_model.evaluate_model()
water_model.plot_loss()
water_model.plot_mae()
