import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import pickle

model = load_model("next_words.h5")
tokenizer = pickle.load(open("token.pkl", "rb"))

# 새로운 전처리 함수를 추가하세요.
def preprocess(text):
    sequence = tokenizer.texts_to_sequences([text])
    processed_data = np.array(sequence)
    return processed_data

# 예측 반환에서 예측된 단어를 가져오는 함수를 추가하세요.
def get_predicted_word(predictions):
    preds = np.argmax(predictions)
    predicted_word = ""

    for key, value in tokenizer.word_index.items():
        if value == preds:
            predicted_word = key
            break

    return predicted_word

def predict_next_word(text):
    # 텍스트 데이터를 모델에 적합한 형태로 전처리
    processed_data = preprocess(text)

    # 예측 실행
    predictions = model.predict(processed_data)

    # 예측된 단어를 반환
    predicted_word = get_predicted_word(predictions)

    return predicted_word
