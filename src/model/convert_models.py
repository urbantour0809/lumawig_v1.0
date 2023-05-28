import json
import pickle
import os

# token.pkl 파일의 절대 경로
token_pkl_path = os.path.join("src/model", "token.pkl")

# 절대 경로를 사용하여 pickle 파일을 로드합니다.
tokenizer = pickle.load(open(token_pkl_path, "rb"))

# token.pkl 파일과 동일한 위치에 token.json 파일을 저장합니다.
token_json_path = os.path.join("src/model", "token.json")
with open(token_json_path, "w") as outfile:
    json.dump(tokenizer.word_index, outfile)

# 동일한 위치에 있는 next_words.h5 파일의 절대 경로를 지정합니다.
# next_words.h5 파일의 절대 경로
model_h5_path = "src/model/next_words.h5"

# 모델 파일을 저장할 output 경로를 지정합니다.
output_dir_path = "src/model"

# h5 파일을 이용하여 output 경로에 model.json 파일을 생성합니다.
os.system(f"tensorflowjs_converter --input_format keras {model_h5_path} {output_dir_path}")
