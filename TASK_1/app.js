let currentQuestionIndex = 0;
let responses = [];
const questions = [
    { question: "What is your gender?", type: "radio", options: ["Male", "Female", "I wish not to disclose"] },
    { question: "Are you willing to relocate?", type: "radio", options: ["Yes", "No"] },
    { question: "What is your highest level of education?", type: "radio", options: ["High School", "Bachelor's", "Master's", "Doctorate"] },
    { question: "How many years of experience do you have?", type: "radio", options: ["0-1 years", "2-3 years", "4+ years"] },
    { question: "What programming languages are you proficient in?", type: "checkbox", options: ["JavaScript", "Python", "Java", "C++", "Other"] },
    { question: "Do you have experience working in a team?", type: "radio", options: ["Yes", "No"] },
    { question: "Are you familiar with Agile methodologies?", type: "radio", options: ["Yes", "No"] },
    { question: "What is your expected salary?", type: "radio", options: ["Below $30k", "$30k-$50k", "$50k-$70k", "Above $70k"] },
    { question: "Do you prefer working remotely?", type: "radio", options: ["Yes", "No"] },
    { question: "Why do you want to work with Revanco Technologies?", type: "textarea" },
];

function startSurvey() {
    document.getElementById('startSurveyBtn').style.display = 'none';
    document.getElementById('survey-form').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const questionContainer = document.getElementById('questions-container');
    questionContainer.innerHTML = `
        <div class="mb-3">
            <label class="form-label">${currentQuestion.question}</label>
            ${getQuestionInput(currentQuestion)}
        </div>
    `;
}

function getQuestionInput(question) {
    let inputHTML = '';
    if (question.type === 'radio' || question.type === 'checkbox') {
        question.options.forEach(option => {
            inputHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="${question.type}" name="answer" value="${option}" id="${option}">
                    <label class="form-check-label" for="${option}">${option}</label>
                </div>
            `;
        });
    } else if (question.type === 'textarea') {
        inputHTML = `<textarea class="form-control" rows="3" id="answer" required></textarea>`;
    }
    return inputHTML;
}

function nextQuestion() {
    const answerElements = document.querySelectorAll('input[name="answer"], textarea');
    let answer;
    if (answerElements.length > 0) {
        answer = Array.from(answerElements).find(input => input.checked || input.value.trim()).value;
    }

    if (!answer) {
        alert("Please answer the question before proceeding.");
        return;
    }

    responses.push({ question: questions[currentQuestionIndex].question, answer: answer });
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
        document.getElementById('previousBtn').style.display = 'inline';
    } else {
        document.getElementById('nextBtn').style.display = 'none';
        showReviewSection();
    }
}

function previousQuestion() {
    currentQuestionIndex--;
    showQuestion();
    document.getElementById('nextBtn').style.display = 'inline';
    if (currentQuestionIndex === 0) {
        document.getElementById('previousBtn').style.display = 'none';
    }
}

function showReviewSection() {
    document.getElementById('survey-form').style.display = 'none';
    document.getElementById('review-section').style.display = 'block';

    let reviewHTML = '';
    responses.forEach((response, index) => {
        reviewHTML += `<p><strong>${response.question}</strong><br>${response.answer}</p>`;
    });

    document.getElementById('review-answers').innerHTML = reviewHTML;
    document.getElementById('editBtn').style.display = 'inline';
    document.getElementById('downloadBtn').style.display = 'inline';
}

document.getElementById('finalSubmitConsent').addEventListener('change', function() {
    const submitButton = document.getElementById('finalSubmitBtn');
    submitButton.disabled = !this.checked;
});

function finalSubmit() {
    alert("Thank you for your submission!");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Revanco Hiring Survey", 10, 10);
    responses.forEach((res, index) => {
        doc.text(`${res.question}: ${res.answer}`, 10, 20 + (index * 10));
    });
    doc.save("survey-submission.pdf");
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Revanco Hiring Survey", 10, 10);
    responses.forEach((res, index) => {
        doc.text(`${res.question}: ${res.answer}`, 10, 20 + (index * 10));
    });
    doc.save("survey-submission.pdf");
}

function editSurvey() {
    currentQuestionIndex = 0;
    responses = [];
    document.getElementById('review-section').style.display = 'none';
    document.getElementById('survey-form').style.display = 'block';
    showQuestion();
    document.getElementById('nextBtn').style.display = 'inline';
    document.getElementById('previousBtn').style.display = 'none';
    document.getElementById('editBtn').style.display = 'none';
    document.getElementById('downloadBtn').style.display = 'none';
}
