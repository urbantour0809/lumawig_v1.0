function toggleContentScript(active) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "TOGGLE_CONTENT_SCRIPT", payload: active });
    });
  }
  
  const nextWordPrediction = document.querySelector('input[type="checkbox"][name="skills"]');
  
  nextWordPrediction.addEventListener("change", () => {
    toggleContentScript(nextWordPrediction.checked);
  
    // 저장해야 하는 값을 localStorage에 저장
    localStorage.setItem("nextWordPredictionChecked", nextWordPrediction.checked);
  });
  
  // 이전에 저장된 초기 값으로 설정
  const savedNextWordPredictionChecked = localStorage.getItem("nextWordPredictionChecked");
  
  if (savedNextWordPredictionChecked !== null) {
    nextWordPrediction.checked = savedNextWordPredictionChecked === "true";
  }
  