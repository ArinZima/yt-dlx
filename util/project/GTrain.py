import pandas as pd
from tensorflow import keras
import matplotlib.pyplot as plt
from keras import (
    layers,
    regularizers,
)
from keras_tuner.tuners import (
    RandomSearch,
)
from sklearn.preprocessing import (
    LabelEncoder,
)
from sklearn.model_selection import (
    train_test_split,
)
from keras.callbacks import (
    ModelCheckpoint,
    EarlyStopping,
    TensorBoard,
)


# Define a class for water pollution model
class WaterPollutionModel:
    def __init__(self, data_path):
        self.data_path = data_path
        self.data = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.label_encoder = LabelEncoder()  # Initialize label encoder
        self.tuner = None
        self.model = None
        self.history = None

    # Method to load data from CSV file
    def load_data(self):
        self.data = pd.read_csv(
            self.data_path
        )  # Load data from CSV file into a Pandas DataFrame
        self.data = self.data.dropna()  # Drop rows with missing values

    # Method to preprocess data (encode categorical columns and split into train/test sets)
    def preprocess_data(self):
        # Encode categorical columns using LabelEncoder
        for col in self.data.columns:
            if self.data[col].dtype == "object":
                self.data[col] = self.label_encoder.fit_transform(self.data[col])
        # Split data into features (X) and target variable (y)
        X = self.data.drop(
            [
                "STATION CODE",
                "LOCATIONS",
                "TEMPERATURE",
                "pH",
                "CONDUCTIVITY",
                "BOD",
                "NITRATE",
                "YEAR",
            ],
            axis=1,
        )
        y = self.data["CONDUCTIVITY"]
        # Split data into training and testing sets
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

    # Method to build a neural network model with hyperparameters using Keras Tuner
    def build_model(self, hp):
        model = keras.Sequential()  # Create a sequential model
        # Add input layer with hyperparameter for units and regularization
        model.add(
            layers.Dense(
                units=hp.Int("units_1", min_value=64, max_value=512, step=64),
                activation="relu",
                kernel_regularizer=regularizers.l2(0.001),
                input_dim=self.X_train.shape[1],
            )
        )
        # Add dropout layer with hyperparameter for dropout rate
        model.add(
            layers.Dropout(
                hp.Float("dropout_1", min_value=0.2, max_value=0.5, step=0.1)
            )
        )

        # Add hidden layers with hyperparameters for units, activation, and regularization
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

        # Add output layer with linear activation for regression
        model.add(layers.Dense(1, activation="linear"))
        # Choose learning rate from hyperparameter options
        lr = hp.Choice("learning_rate", values=[1e-4, 1e-5, 1e-6])

        # Compile the model with optimizer, loss function, and metrics
        model.compile(
            optimizer=keras.optimizers.Adam(lr),
            loss="mse",
            metrics=["mae"],
        )
        return model

    # Method to tune the model using hyperparameter tuning
    def tune_model(self, max_trials=100, seed=None, project_name="model/guwahati/core"):
        self.tuner = RandomSearch(
            self.build_model,
            max_trials=max_trials,
            seed=seed,
            objective="val_mae",
            project_name=project_name,
        )
        # Perform hyperparameter search with training data and validation data
        self.tuner.search(
            self.X_train,
            self.y_train,
            epochs=max_trials,
            validation_data=(self.X_test, self.y_test),
            callbacks=[
                ModelCheckpoint(
                    filepath="model/guwahati/best_model.h5",
                    monitor="val_loss",
                    save_best_only=True,
                ),
                EarlyStopping(monitor="val_loss", patience=10),
                TensorBoard(log_dir="./model/guwahati/logs"),
            ],
        )

    # Method to train the best model found during tuning
    def train_best_model(self, epochs=100):
        # Get the best hyperparameters found during tuning
        best_hps = self.tuner.get_best_hyperparameters(num_trials=1)[0]
        # Build the model with the best hyperparameters
        self.model = self.tuner.hypermodel.build(best_hps)
        # Train the model with specified epochs and validation data
        self.history = self.model.fit(
            self.X_train,
            self.y_train,
            epochs=epochs,
            validation_data=(self.X_test, self.y_test),
            callbacks=[
                ModelCheckpoint(
                    filepath="model/guwahati/best_model.h5",
                    monitor="val_loss",
                    save_best_only=True,
                ),
                EarlyStopping(monitor="val_loss", patience=10),
                TensorBoard(log_dir="./model/guwahati/logs"),
            ],
        )
        # Load weights of the best model
        self.model.load_weights("model/guwahati/best_model.h5")

    # Method to save the model architecture to a JSON file
    def save_model_architecture(self, filename="model/guwahati/architecture.json"):
        model_json = self.model.to_json()  # Convert model architecture to JSON format
        with open(filename, "w") as json_file:
            json_file.write(model_json)  # Write JSON to file

    # Method to evaluate the trained model
    def evaluate_model(self):
        # Evaluate model performance on test data
        loss, mae = self.model.evaluate(self.X_test, self.y_test, verbose=0)
        print(f"Mean Absolute Error: {mae}")

    # Method to plot the training and validation loss
    def plot_loss(self):
        plt.plot(
            self.history.history["loss"], label="Training Loss"
        )  # Plot training loss
        plt.plot(
            self.history.history["val_loss"], label="Validation Loss"
        )  # Plot validation loss
        plt.xlabel("Epochs")  # Set x-axis label
        plt.ylabel("Loss")  # Set y-axis label
        plt.legend()  # Show legend
        plt.savefig("model/guwahati/loss_plot.png")  # Save plot to file
        plt.close()  # Close plot

    # Method to plot the training and validation MAE (Mean Absolute Error)
    def plot_mae(self):
        plt.plot(self.history.history["mae"], label="Training MAE")  # Plot training MAE
        plt.plot(
            self.history.history["val_mae"], label="Validation MAE"
        )  # Plot validation MAE
        plt.xlabel("Epochs")  # Set x-axis label
        plt.ylabel("MAE")  # Set y-axis label
        plt.legend()  # Show legend
        plt.savefig("model/guwahati/mae_plot.png")  # Save plot to file
        plt.close()  # Close plot


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
