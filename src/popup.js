document.addEventListener("DOMContentLoaded", () => {
  const nextWordPrediction = document.querySelector("#complete");

  nextWordPrediction.addEventListener("change", () => {
    // 저장해야 하는 값을 localStorage에 저장
    localStorage.setItem("nextWordPredictionChecked", nextWordPrediction.checked);
  });

  // 이전에 저장된 초기 값으로 설정
  const savedNextWordPredictionChecked = localStorage.getItem("nextWordPredictionChecked");

  if (savedNextWordPredictionChecked !== null) {
    nextWordPrediction.checked = savedNextWordPredictionChecked === "true";
  }
});
