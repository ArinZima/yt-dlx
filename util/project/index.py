import pandas as pd

data = pd.read_csv("db/Train.csv")
numeric_columns = [
    "Temp",
    "D.O. (mg/l)",
    "PH",
    "CONDUCTIVITY (mhos/cm)",
    "B.O.D. (mg/l)",
    "NITRATENAN N+ NITRITENANN (mg/l)",
    "FECAL COLIFORM (MPN/100ml)",
    "TOTAL COLIFORM (MPN/100ml)Mean",
]
data[numeric_columns] = data[numeric_columns].apply(pd.to_numeric, errors="coerce")
data["npH"] = data["PH"].apply(
    lambda x: (
        100
        if (8.5 >= x >= 7)
        else (
            80
            if (8.6 >= x >= 8.5) or (6.9 >= x >= 6.8)
            else (
                60
                if (8.8 >= x >= 8.6) or (6.8 >= x >= 6.7)
                else (40 if (9 >= x >= 8.8) or (6.7 >= x >= 6.5) else 0)
            )
        )
    )
)
data["ndo"] = data["D.O. (mg/l)"].apply(
    lambda x: (
        100
        if (x >= 6)
        else (
            80
            if (6 >= x >= 5.1)
            else (60 if (5 >= x >= 4.1) else (40 if (4 >= x >= 3) else 0))
        )
    )
)
data["nco"] = data["TOTAL COLIFORM (MPN/100ml)Mean"].apply(
    lambda x: (
        100
        if (5 >= x >= 0)
        else (
            80
            if (50 >= x >= 5)
            else (60 if (500 >= x >= 50) else (40 if (10000 >= x >= 500) else 0))
        )
    )
)
data["nbdo"] = data["B.O.D. (mg/l)"].apply(
    lambda x: (
        100
        if (3 >= x >= 0)
        else (
            80
            if (6 >= x >= 3)
            else (60 if (80 >= x >= 6) else (40 if (125 >= x >= 80) else 0))
        )
    )
)
data["nec"] = data["CONDUCTIVITY (mhos/cm)"].apply(
    lambda x: (
        100
        if (75 >= x >= 0)
        else (
            80
            if (150 >= x >= 75)
            else (60 if (225 >= x >= 150) else (40 if (300 >= x >= 225) else 0))
        )
    )
)
data["nna"] = data["NITRATENAN N+ NITRITENANN (mg/l)"].apply(
    lambda x: (
        100
        if (20 >= x >= 0)
        else (
            80
            if (50 >= x >= 20)
            else (60 if (100 >= x >= 50) else (40 if (200 >= x >= 100) else 0))
        )
    )
)
data["wph"] = data["npH"] * 0.165
data["wdo"] = data["ndo"] * 0.281
data["wbdo"] = data["nbdo"] * 0.234
data["wec"] = data["nec"] * 0.009
data["wna"] = data["nna"] * 0.028
data["wco"] = data["nco"] * 0.281
data["wqi"] = (
    data["wph"] + data["wdo"] + data["wbdo"] + data["wec"] + data["wna"] + data["wco"]
)
aggregated_data = data.groupby("year")["wqi"].mean().reset_index()
aggregated_data.to_csv("model/db/wqi.csv", index=False)
