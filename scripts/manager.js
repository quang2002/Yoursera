const ACTIONS = {
    ".*?:\/\/www.coursera.org\/learn\/.*?\/exam\/.*?\/view-attempt": exportQuiz,
    ".*?:\/\/www.coursera.org\/learn\/.*?\/exam\/.*?\/attempt": doQuiz,
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    Object.keys(ACTIONS).forEach(key => {
        if (this.location.href.match(key)) ACTIONS[key]();
    });
});