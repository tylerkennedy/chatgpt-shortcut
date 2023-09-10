// Setup event listener for input change
let gpt4Toggle = document.querySelector('#gpt4');
gpt4Toggle.addEventListener('input', () => {
  updateSettings();
});

function updateSettings() {
  chrome.storage.local.set({ gpt4: gpt4Toggle.checked }).then(() => {
    console.log("GPT4 settings saved: ", gpt4Toggle.checked);
  });
}


async function loadSettings() {
  const response = await chrome.storage.local.get(["gpt4"]);

  if (response.gpt4) {
    gpt4Toggle.checked = response.gpt4;
  } else {
    gpt4Toggle.checked = false;
  }
}

(async () => {
 await loadSettings();
})();