// 默认点击打开
chrome.browserAction.onClicked.addListener(function () {
  chrome.windows.create({
    type: 'popup',
    url: chrome.runtime.getURL('design.html'),
  })
})
