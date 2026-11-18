document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.navbar-mobile-menu');
    const navbarLinks = document.querySelector('.navbar-links');

    menuToggle.addEventListener('click', function() {
        navbarLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.navbar-links a').forEach(link => {
        link.addEventListener('click', function() {
            navbarLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Learn More buttons - open modals
    const learnMoreButtons = document.querySelectorAll('.learn-more');

    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Modal close buttons
    const modalCloses = document.querySelectorAll('.modal-close');

    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });

    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="display: flex"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
    });

    // Quiz data
    const quizQuestions = [
        {
            question: "What is the best practice for creating a strong password?",
            options: ["Use 'password123' for all accounts", "Use at least 12 characters with mixed types (uppercase, lowercase, numbers, symbols)", "Use your birthdate followed by your pet's name", "Write down all passwords in a notebook"],
            correct: 1
        },
        {
            question: "Which of the following is a sign of a phishing email?",
            options: ["Personalized greeting with your name", "Suspicious sender email address, urgent language, unexpected attachments", "Official-looking logo and branding", "Clear and professional writing style"],
            correct: 1
        },
        {
            question: "What should you do before entering personal information on a website?",
            options: ["Click on the first result in search engines", "Verify the URL is correct and look for HTTPS padlock icon", "Disable your antivirus temporarily", "Enter information quickly before the page loads"],
            correct: 1
        },
        {
            question: "Which of the following is NOT a common malware delivery method?",
            options: ["Suspicious email attachments", "Drive-by downloads from compromised websites", "Official software update notifications", "Verified app stores"],
            correct: 2
        },
        {
            question: "What is two-factor authentication (2FA)?",
            options: ["Using two different passwords for two different accounts", "Requiring a second form of verification in addition to your password", "Using two-factor authentication only for banking accounts", "A password that has two special characters"],
            correct: 1
        },
        {
            question: "Which of the following is a social engineering tactic?",
            options: ["Sending a virus-infected USB drive to an employee", "Calling someone and pretending to be IT support to ask for their password", "Using a firewall to block unauthorized access", "Encrypting sensitive data at rest"],
            correct: 1
        },
        {
            question: "What should you do if you receive an unexpected request for sensitive information?",
            options: ["Provide the information to verify your identity", "Verify the request through a separate, trusted communication channel", "Ignore it completely without verification", "Forward it to your contacts as a warning"],
            correct: 1
        },
        {
            question: "Which of these practices helps protect your online privacy?",
            options: ["Sharing your location publicly on all social media platforms", "Using a password manager and enabling 2FA", "Using the same password across all websites", "Clicking 'Accept All Cookies' on every website"],
            correct: 1
        },
        {
            question: "What does HTTPS indicate about a website?",
            options: ["The website is completely secure and malware-free", "The website uses encryption to protect data transmitted between your browser and the site", "The website has been verified by the government", "The website has no tracking cookies"],
            correct: 1
        },
        {
            question: "Which of the following is the safest practice when using public Wi-Fi?",
            options: ["Accessing banking websites without any protection", "Connecting to any available network without verification", "Using a VPN to encrypt your connection", "Disabling your firewall to improve speed"],
            correct: 2
        }
    ];

    // Quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let totalQuestions = quizQuestions.length;

    // DOM elements
    const questionText = document.querySelector('.question-text');
    const optionsContainer = document.querySelector('.options');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const scoreDisplay = document.getElementById('score');
    const totalDisplay = document.getElementById('total');
    const scoreScreen = document.getElementById('score-screen');
    const finalScoreDisplay = document.getElementById('final-score');
    const totalQuestionsDisplay = document.getElementById('total-questions');
    const scoreMessage = document.getElementById('score-message');
    const restartBtn = document.getElementById('restart-btn');
    const bestScoreDisplay = document.getElementById('best-score');

    // Initialize best score from LocalStorage
    let bestScore = localStorage.getItem('cyber_awareness_best_score');
    if (bestScore !== null) {
        bestScore = parseInt(bestScore);
    }
    bestScoreDisplay.textContent = bestScore;

    // Render current question
    function renderQuestion(index) {
        const question = quizQuestions[index];
        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';

        question.options.forEach((option, i) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = option;
            optionDiv.dataset.index = i;
            optionDiv.addEventListener('click', () => selectAnswer(i, question.correct));
            optionsContainer.appendChild(optionDiv);
        });

        // Update progress text
        totalDisplay.textContent = totalQuestions;
    }

    // Handle answer selection
    function selectAnswer(selectedIndex, correctIndex) {
        const options = document.querySelectorAll('.option');
        
        // Remove any previous selection state
        options.forEach(opt => opt.classList.remove('correct', 'incorrect'));

        // Apply correct/incorrect class
        if (selectedIndex === correctIndex) {
            options[selectedIndex].classList.add('correct');
            score++;
        } else {
            options[selectedIndex].classList.add('incorrect');
            options[correctIndex].classList.add('correct');
        }

        // Update score display
        scoreDisplay.textContent = score;
        
        // Disable option clicks after answer
        options.forEach(opt => opt.style.pointerEvents = 'none');
    }

    // Go to next question
    function nextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < totalQuestions) {
            renderQuestion(currentQuestionIndex);
            prevBtn.disabled = false;
        } else {
            showScoreScreen();
        }
    }

    // Go to previous question
    function prevQuestion() {
        currentQuestionIndex--;
        
        if (currentQuestionIndex >= 0) {
            renderQuestion(currentQuestionIndex);
        }
        
        if (currentQuestionIndex === 0) {
            prevBtn.disabled = true;
        }
    }

    // Show score screen and save best score
    function showScoreScreen() {
        questionText.style.display = 'none';
        optionsContainer.style.display = 'none';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        
        finalScoreDisplay.textContent = score;
        totalQuestionsDisplay.textContent = totalQuestions;
        
        // Calculate message based on score
        const percentage = (score / totalQuestions) * 100;
        if (percentage === 100) {
            scoreMessage.textContent = 'Perfect score! You\'re a cybersecurity expert!';
        } else if (percentage >= 70) {
            scoreMessage.textContent = 'Great job! You have solid cybersecurity knowledge.';
        } else if (percentage >= 50) {
            scoreMessage.textContent = 'Not bad! Review the topics you got wrong.';
        } else {
            scoreMessage.textContent = 'Keep learning! Cybersecurity is important for everyone.';
        }
        
        // Save best score to LocalStorage
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('cyber_awareness_best_score', bestScore);
            bestScoreDisplay.textContent = bestScore;
        }
        
        scoreScreen.style.display = 'block';
    }

    // Restart quiz
    restartBtn.addEventListener('click', function() {
        currentQuestionIndex = 0;
        score = 0;
        questionText.style.display = 'block';
        optionsContainer.style.display = 'grid';
        prevBtn.style.display = 'inline-block';
        nextBtn.style.display = 'inline-block';
        prevBtn.disabled = true;
        
        scoreDisplay.textContent = '0';
        
        renderQuestion(currentQuestionIndex);
        scoreScreen.style.display = 'none';
    });

    // Initialize quiz
    totalDisplay.textContent = totalQuestions;
    renderQuestion(currentQuestionIndex);

    // Navigation buttons
    nextBtn.addEventListener('click', nextQuestion);
    prevBtn.addEventListener('click', prevQuestion);

    // Initialize best score display
    bestScoreDisplay.textContent = bestScore;
});