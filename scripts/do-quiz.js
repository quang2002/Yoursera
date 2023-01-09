async function getCourseInformation() {
    const info = JSON.parse(document.querySelector("a[data-click-value]").getAttribute('data-click-value'));
    const promises = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "get-answer", course_id: info.course_id }, resolve);
    });
    return { ...info, answers: await promises };
}

function analysisQuiz(quiz) {
    const id = quiz.getAttribute("aria-labelledby");
    const question = quiz.querySelector(".rc-FormPartsQuestion__row .rc-FormPartsQuestion__contentCell");
    const answers = [];

    quiz.querySelectorAll(".rc-FormPartsQuestion__row .rc-Option").forEach(answer => {
        answers.push({
            text: answer.querySelector(".rc-Option__input-text").innerText,
            input: answer.querySelector("input"),
        });
    });

    var type = "unknown";
    if (quiz.querySelector("input[type='radio']")) type = "radio";
    if (quiz.querySelector("input[type='checkbox']")) type = "checkbox";


    return { id, question, answers, type };
}

async function doQuiz() {
    const { course_id: courseId, answers: courseAnswers } = await getCourseInformation();
    const quizzes = document.querySelectorAll("#TUNNELVISIONWRAPPER_CONTENT_ID .rc-FormPartsQuestion");

    quizzes.forEach(quiz => {
        const { id, question, answers, type } = analysisQuiz(quiz);

        const quizAnswers = courseAnswers[id];
        if (!quizAnswers) return;

        answers.forEach(answer => {
            if (quizAnswers.includes(answer.text)) {
                answer.input.click();
            }
        });
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "do-quiz") {
        doQuiz();
    }
});