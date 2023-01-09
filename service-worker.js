chrome.action.onClicked.addListener(() => {
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "do-quiz" });
        });
    } catch {

    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "get-answer":
            fetch(chrome.runtime.getURL(`/answer/${message.course_id}.json`)).then(res => res.json()).then(sendResponse).catch(() => {
                sendResponse({});
            });
            break;
        default:
            break;
    }
    return true;
});
