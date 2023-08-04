chrome.omnibox.onInputEntered.addListener(async function (text) {
  const url = 'https://chat.openai.com/';
  let tabHasUpdated = false // Only execute the content script one time when the tab first updates

  // Open tab to chatGPT
  chrome.tabs.update({ url: url }, function () {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (!tabHasUpdated && changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: enterPromptOnChatGPT,
          args: [text],
        }).then(() => {
          tabHasUpdated = true
        });
      }
    });
  });
});

// After ChatGPT is launched, enter the user's prompt into the UI
async function enterPromptOnChatGPT(prompt) {
  const observer = new MutationObserver(function (mutations, mutationInstance) {
    const headingElement = document.querySelector('h1')
    if (headingElement) {
      const textInputElement = document.querySelector('textarea');
      // Type prompt and press enter
      textInputElement.value = prompt;
      const event1 = new Event('input', { bubbles: true, cancelable: true });
      textInputElement.dispatchEvent(event1);
      const submitButton = textInputElement.closest("form");
      var event2 = new Event('submit', { bubbles: true, cancelable: true });
      submitButton.dispatchEvent(event2);

      // Stop listening for mutations after initial prompt is submitted
      mutationInstance.disconnect();
    }
  });
  const config = { attributes: false, childList: true, subtree: true }
  observer.observe(document, config);
}

