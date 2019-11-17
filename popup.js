let chatText = document.getElementById('chatText')
let delayTime = document.getElementById('delayTime')
let roomId = document.getElementById('roomId')
let button = document.getElementById('btnSet')
let chboxText = document.getElementById('rememberText')
let chboxId = document.getElementById('rememberId')
let chboxTime = document.getElementById('rememberTime')

delayTime.addEventListener('input', updateValue);
button.addEventListener('click', setAction)

chrome.storage.sync.get(['rid','txt','tme','cid','ctxt','ctme'], function(obj) {
  roomId.value = obj.rid ? obj.rid : ''
  chatText.value = obj.txt ? obj.txt : ''
  delayTime.value = obj.tme ? obj.tme : ''
  chboxId.checked = obj.cid
  chboxText.checked = obj.ctxt
  chboxTime.checked = obj.ctme
});

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}

function updateValue(e) {
  const tme = parseFloat(e.target.value)
  let end = addMinutes(new Date(), tme)
  calTime.innerHTML = `This message will be sent at: ${end.toLocaleString('en-GB')} (approximately)`
}

function setAction() {
  let txt = chatText.value.trim()
  let tme = parseFloat(delayTime.value.trim())
  let rid = roomId.value.trim()

  if(txt.length > 255) {
    txt = txt.substring(0, 256)
  }
  if (isNaN(tme)) {
    tme = 0
    delayTime.value = tme
  }
  const regex = /^\#\!rid[0-9]{8,9}$/
  if (!regex.test(rid)) {
    alert('Invalid Room Id')
    return
  }

  const payload = {
    rid: chboxId.checked ? rid : null,
    txt: chboxText.checked ? txt: null,
    tme: chboxTime.checked ? tme: null,
    cid: chboxId.checked ? true : false,
    ctxt: chboxText.checked ? true : false,
    ctme: chboxTime.checked ? true: false
  }
  chrome.storage.sync.set(payload);

  let end = addMinutes(new Date(), tme)
  calTime.innerHTML = `This message will be sent at: ${end.toLocaleString('en-GB')} (approximately)`
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(!tabs[0].url.includes('https://www.chatwork.com')) {
      alert('please go to https://www.chatwork.com')
      return
    }
    const payload = {
      txt, tme, rid
    }
    chrome.tabs.sendMessage(tabs[0].id, payload);
  });
}
