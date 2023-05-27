import json
import pickle

# Load tokenizer and save it as token.json
tokenizer = pickle.load(open("token.pkl", "rb"))

with open("token.json", "w") as outfile:
    json.dump(tokenizer.word_index, outfile)

# Convert the h5 model file to json format
import os
os.system("tensorflowjs_converter --input_format keras src/model/next_words.h5 src/model/")
