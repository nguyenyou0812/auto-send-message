function simulateChat (content) {
  let input = document.getElementById('_chatText')
  if (input) {
    let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(input, content);
    let ev = new Event('input', { bubbles: true});
    input.dispatchEvent(ev);
    let button = document.getElementsByClassName('sc-kasBVs chatInput__submit dOfbLu')[0]
    setTimeout(() => {
      button.click()
    }, 500)
  }
}

function autoChat (minute, content, rid) {
  const time = minute * 60 * 1000
  setTimeout(() => {
    if (rid) {
      window.location.href = `https://www.chatwork.com/${rid}`
    }
    setTimeout(() => {
      simulateChat(content)
    }, rid ? 500 : 0)
  }, time)
}

chrome.runtime.onMessage.addListener(gotMessage)
function gotMessage (message, sender, sendResponse) {
  autoChat(message.tme, message.txt, message.rid)
}
