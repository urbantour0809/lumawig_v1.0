import * as tf from '@tensorflow/tfjs';
import './style.css';

async function loadModel() {
  const model = await tf.loadLayersModel('src/model/model.json');
  return model;
}

async function loadTokenizer(url) {
  const response = await fetch(url);
  const tokenizer = await response.json();
  return tokenizer;
}

async function predictNextWord(model, tokenizer, seedText) {
  const sequence = tokenizer.texts_to_sequences([seedText]);
  const inputTensor = tf.tensor(sequence);
  const predictions = model.predict(inputTensor);
  const argMax = predictions.argMax(-1).dataSync()[0];
  const predictedWord = tokenizer.sequences_to_texts([[argMax]])[0];
  
  return predictedWord;
}

function showIcon() {
  const textField = document.activeElement;
  if (textField.tagName === 'INPUT' || textField.tagName === 'TEXTAREA') {
    textField.classList.add('focused');
  }
}

function hideIcon() {
  const textField = document.activeElement;
  textField.classList.remove('focused');
}

async function main() {
  const model = await loadModel();
  const tokenizer = await loadTokenizer('src/model/token.json');
  const textFields = document.querySelectorAll('input:text, textarea');

  // Focus event handling
  textFields.forEach((textField) => {
    textField.addEventListener('focus', showIcon);
    textField.addEventListener('blur', hideIcon);
  });

  // Prediction on text input
  textFields.forEach((textField) => {
    textField.addEventListener('input', async (event) => {
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

main();
