import numpy as np
import pandas as pd
from sklearn.svm import SVR
from keras.models import Sequential
from keras.layers import LSTM, Dense
from keras_tuner import RandomSearch
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split

data = pd.read_csv("db/Train.csv")
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data)
sequence_length = 10


def create_sequences(data, sequence_length):
    X, y = [], []
    for i in range(len(data) - sequence_length):
        X.append(data[i : (i + sequence_length)])
        y.append(data[i + sequence_length])
    return np.array(X), np.array(y)


X, y = create_sequences(scaled_data, sequence_length)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


def build_model(hp):
    model = Sequential()
    model.add(
        LSTM(
            units=hp.Int("units", min_value=32, max_value=512, step=32),
            return_sequences=True,
            input_shape=(X_train.shape[1], X_train.shape[2]),
        )
    )
    model.add(LSTM(units=hp.Int("units", min_value=32, max_value=512, step=32)))
    model.add(Dense(units=1))
    model.compile(optimizer="adam", loss="mean_squared_error")
    return model


tuner = RandomSearch(
    build_model,
    max_trials=5,
    objective="val_loss",
    directory="model/lstm",
    executions_per_trial=3,
    project_name="water_quality_prediction",
)

tuner.search(X_train, y_train, epochs=10, validation_data=(X_test, y_test))
best_model = tuner.get_best_models(num_models=1)[0]
best_model.fit(X_train, y_train, epochs=100, batch_size=32, verbose=1)
train_predict = best_model.predict(X_train)
test_predict = best_model.predict(X_test)
train_rmse = np.sqrt(mean_squared_error(y_train, train_predict))
test_rmse = np.sqrt(mean_squared_error(y_test, test_predict))
print("Train RMSE:", train_rmse)
print("Test RMSE:", test_rmse)
svm_model = SVR(kernel="rbf")
svm_model.fit(train_predict, y_train)
svm_train_predict = svm_model.predict(train_predict)
svm_test_predict = svm_model.predict(test_predict)
svm_train_rmse = np.sqrt(mean_squared_error(y_train, svm_train_predict))
svm_test_rmse = np.sqrt(mean_squared_error(y_test, svm_test_predict))
print("SVM Train RMSE:", svm_train_rmse)
print("SVM Test RMSE:", svm_test_rmse)
