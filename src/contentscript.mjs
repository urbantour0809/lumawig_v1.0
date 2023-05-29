import * as tf from "@tensorflow/tfjs";
import "../src/style.css";
import chrome from "webextension-polyfill";

console.log("Contentscript loaded");

const predictNextWord = async (model, tokenizer, seedText) => {
  const sequence = tokenizer.texts_to_sequences([seedText]);
  const inputTensor = tf.tensor(sequence);
  const predictions = model.predict(inputTensor);
  const argMax = predictions.argMax(-1).dataSync()[0];
  const predictedWord = tokenizer.sequences_to_texts([[argMax]])[0];

  return predictedWord;
};

const showIcon = () => {
  console.log("Show icon");

  const textField = document.activeElement;
  if (textField.tagName === "INPUT" || textField.tagName === "TEXTAREA") {
    textField.classList.add("focused");
  }
};

const hideIcon = () => {
  console.log("Hide icon");

  const textField = document.activeElement;
  textField.classList.remove("focused");
};

function listenerCallback(request, sender, sendResponse) {
  // 아직 구현되지 않음
}

const isRuntimeAvailable =
  typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined";

async function main() {
  const response = await chrome.runtime.sendMessage({ type: "GET_NEXT_WORD_PREDICTION_STATUS" });

  if (response) {
    const nextWordPredictionActive = response.payload;

    if (nextWordPredictionActive) {
      enableNextWordPrediction();
    }
  } else {
    console.error(
      "Both chrome.runtime and chrome objects are undefined. Falling back to default behavior."
    );
    enableNextWordPrediction();
  }
}

main();

if (isRuntimeAvailable) {
  chrome.runtime.onMessage.addListener(listenerCallback);
} else {
  console.error("Both chrome.runtime and chrome objects are undefined");
  enableNextWordPrediction();
}

async function performPrediction(textField, model, tokenizer) {
  const seedText = textField.value;
  console.log("User input:", seedText);
  const predictedWord = await predictNextWord(model, tokenizer, seedText);
  console.log("Predicted word:", predictedWord);
}

async function enableNextWordPrediction() {
  console.log("Enabling next word prediction");

  const [{ default: loadModel }, { default: loadTokenizer }] = await Promise.all([
    import("./loadModel.mjs"),
    import("./loadTokenizer.mjs"),
  ]);

  const model = await loadModel();
  const tokenizer = await loadTokenizer("model/token.json");
  const textFields = document.querySelectorAll("input:text, textarea");

  textFields.forEach((textField) => {
    textField.addEventListener("focus", showIcon);
    textField.addEventListener("blur", hideIcon);
  });

  textFields.forEach((textField) => {
    textField.addEventListener("input", async (event) => {
      await performPrediction(textField, model, tokenizer);
    });
  });

  document.addEventListener("keydown", async (event) => {
    if (event.ctrlKey && event.key === "q") {
      textFields.forEach(async (textField) => {
        await performPrediction(textField, model, tokenizer);
        const seedText = textField.value;
        const predictedWord = await predictNextWord(model, tokenizer, seedText);
        textField.value = textField.value + " " + predictedWord;
      });
    }
  });
}
