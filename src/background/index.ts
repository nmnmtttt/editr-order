import { ActionType } from "~/actionType/PopupToConTent"

// 默认点击打开
enum From {
  CONTENT = 'content',
  POPUP = 'popup'
}

const windowInfo = {
  windowId: 0,
  tabsId: 0,
  popupId: 0,
}
// open popup and save window info
chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const tab = tabs[0]
    windowInfo.windowId = tab.windowId
    windowInfo.tabsId = tab.id

    chrome.windows.create({
      type: 'popup',
      url: chrome.runtime.getURL('design.html'),
    }, (popup) => {
      windowInfo.popupId = popup.id
    })
  })
})


const listener = (message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (Response: any) => void) => {
  console.log(sendResponse, sender);

  const { from, type, data } = message
  switch (from) {
    case From.CONTENT:
      break
    case From.POPUP:
      {
        switch (type) {
          case ActionType.GET:
            chrome.tabs.sendMessage(windowInfo.tabsId, {
              type: ActionType.GET,
            }, (shopList) => {
              sendResponse(shopList)
            })
            break
          case ActionType.EDIT:
            chrome.tabs.sendMessage(windowInfo.tabsId, {
              type: ActionType.EDIT,
              data,
            })
            break
        }
      }
      break
    default:
      break
  }
  return true
}

chrome.runtime.onMessageExternal.addListener((
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (Response: any) => void,
) => listener(message, sender, sendResponse))


chrome.runtime.onMessage.addListener((
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (Response: any) => void,
) => listener(message, sender, sendResponse))


