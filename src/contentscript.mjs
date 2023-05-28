import * as tf from "@tensorflow/tfjs";
import "../src/style.css";

let nextWordPredictionActive = false;

const predictNextWord = async (model, tokenizer, seedText) => {
  const sequence = tokenizer.texts_to_sequences([seedText]);
  const inputTensor = tf.tensor(sequence);
  const predictions = model.predict(inputTensor);
  const argMax = predictions.argMax(-1).dataSync()[0];
  const predictedWord = tokenizer.sequences_to_texts([[argMax]])[0];

  return predictedWord;
};

const showIcon = () => {
  const textField = document.activeElement;
  if (textField.tagName === "INPUT" || textField.tagName === "TEXTAREA") {
    textField.classList.add("focused");
  }
};

const hideIcon = () => {
  const textField = document.activeElement;
  textField.classList.remove("focused");
};

async function main() {
  // 기존 main() 함수 내용을 지움
}

main();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "TOGGLE_CONTENT_SCRIPT") {
    nextWordPredictionActive = request.payload;

    if (nextWordPredictionActive) {
      enableNextWordPrediction();
    } else {
      disableNextWordPrediction();
    }
  }
});

async function enableNextWordPrediction() {
  const [{ default: loadModel }, { default: loadTokenizer }] = await Promise.all([
    import("./loadmodel.mjs"),
    import("./loadTokenizer.mjs"),
  ]);

  const model = await loadModel();
  const tokenizer = await loadTokenizer("model/token.json");
  const textFields = document.querySelectorAll("input:text, textarea");

  // Focus event handling
  textFields.forEach((textField) => {
    textField.addEventListener("focus", showIcon);
    textField.addEventListener("blur", hideIcon);
  });

  // Prediction on text input
  textFields.forEach((textField) => {
    textField.addEventListener("input", async (event) => {
      const seedText = event.target.value;
      const predictedWord = await predictNextWord(model, tokenizer, seedText);
      console.log(predictedWord);
    });
  });

  // Prediction when CTRL+Q is pressed
  document.addEventListener("keydown", async (event) => {
    if (event.ctrlKey && event.key === "q") {
      textFields.forEach(async (textField) => {
        const seedText = textField.value;
        const predictedWord = await predictNextWord(model, tokenizer, seedText);
        textField.value = textField.value + " " + predictedWord;
      });
    }
  });
}

function disableNextWordPrediction() {
  const textFields = document.querySelectorAll("input:text, textarea");
  textFields.forEach((textField) => {
    textField.removeEventListener("focus", showIcon);
    textField.removeEventListener("blur", hideIcon);
    textField.removeEventListener("input");
  });
  document.removeEventListener("keydown");
}
