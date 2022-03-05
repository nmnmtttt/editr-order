import { ActionType } from '~/actionType/PopupToConTent'

// 默认点击打开
enum From {
  CONTENT = 'content',
  POPUP = 'popup',
}

const windowInfo = {
  windowId: 0,
  tabsId: 0,
  popupId: 0,
}
// open popup and save window info
chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({ url: 'https://www.doorzo.net/' });
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const tab = tabs[0]
    windowInfo.windowId = tab.windowId
    windowInfo.tabsId = tab.id

    chrome.windows.create(
      {
        type: 'popup',
        url: chrome.runtime.getURL('design.html'),
      },
      (popup) => {
        windowInfo.popupId = popup.id

        chrome.windows.update(windowInfo.popupId, { state: 'maximized' })
      }
    )
  })
})

const listener = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (Response: any) => void) => {
  console.log(sendResponse, sender)

  const { from, type, data } = message
  switch (from) {
    case From.CONTENT:
      break
    case From.POPUP:
      {
        switch (type) {
          case ActionType.GET:
            chrome.tabs.sendMessage(
              windowInfo.tabsId,
              {
                type: ActionType.GET,
              },
              (shopList) => {
                sendResponse(shopList)
              }
            )
            break
          case ActionType.EDIT:
            chrome.tabs.sendMessage(windowInfo.tabsId, {
              type: ActionType.EDIT,
              data,
            })
            break
          case ActionType.SCREENHOT:
            chrome.debugger.getTargets(function (targets) {
              const extensionId = chrome.runtime.id
              const filterTargets = targets.filter(
                (target) => target.url.indexOf(extensionId) > -1 && target.type !== 'background_page'
              )

              if (filterTargets && filterTargets.length > 0) {
                const target = filterTargets[0]
                const debuggee = { targetId: target.id }

                chrome.debugger.attach(debuggee, '1.3', () => {
                  chrome.debugger.sendCommand(debuggee, 'Page.captureScreenshot', { format: 'png' }, (result) => {
                    if (result) {
                      const { data } = result as { data: string }
                      sendResponse({ base64String: data })
                      chrome.debugger.detach(debuggee)
                    }
                  })
                })
              } else {
                sendResponse({ base64String: null, message: 'no_find_target' })
              }
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

chrome.runtime.onMessageExternal.addListener(
  (message: any, sender: chrome.runtime.MessageSender, sendResponse: (Response: any) => void) =>
    listener(message, sender, sendResponse)
)

chrome.runtime.onMessage.addListener(
  (message: any, sender: chrome.runtime.MessageSender, sendResponse: (Response: any) => void) =>
    listener(message, sender, sendResponse)
)
