// Data storage for survey responses
const surveyData = {
    login: {},
    biodata: {},
    survey: {},
    timestamp: null
};

// DOM elements
const pages = {
    login: document.getElementById('login-page'),
    biodata: document.getElementById('biodata-page'),
    survey: document.getElementById('survey-page'),
    success: document.getElementById('success-page')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    showPage('login');
    updateStepIndicator('login');
});

// Event listeners initialization
function initializeEventListeners() {
    // Login page events
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('google-login').addEventListener('click', handleGoogleLogin);
    
    // Biodata page events
    document.getElementById('biodata-btn').addEventListener('click', handleBiodataSubmit);
    
    // Survey page events
    document.getElementById('survey-btn').addEventListener('click', handleSurveySubmit);
    
    // Success page events
    document.getElementById('download-btn').addEventListener('click', handleDownload);
    
    // Rating selection events
    document.querySelectorAll('.rating-option').forEach(option => {
        option.addEventListener('click', function() {
            selectRating(this);
        });
    });
    
    // Enter key support for forms
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const activePage = getActivePage();
            if (activePage === 'login') handleLogin();
            else if (activePage === 'biodata') handleBiodataSubmit();
            else if (activePage === 'survey') handleSurveySubmit();
        }
    });
}

// Page navigation functions
function showPage(pageName) {
    // Hide all pages
    Object.values(pages).forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show requested page
    pages[pageName].classList.remove('hidden');
    
    // Update step indicator
    updateStepIndicator(pageName);
}

function getActivePage() {
    for (const [pageName, pageElement] of Object.entries(pages)) {
        if (!pageElement.classList.contains('hidden')) {
            return pageName;
        }
    }
    return 'login';
}

function updateStepIndicator(currentPage) {
    const steps = document.querySelectorAll('.step');
    const stepLines = document.querySelectorAll('.step-line');
    
    // Reset all steps
    steps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    stepLines.forEach(line => {
        line.classList.remove('completed');
    });
    
    // Update based on current page
    switch(currentPage) {
        case 'login':
            steps[0].classList.add('active');
            break;
        case 'biodata':
            steps[0].classList.add('completed');
            steps[1].classList.add('active');
            stepLines[0].classList.add('completed');
            break;
        case 'survey':
            steps[0].classList.add('completed');
            steps[1].classList.add('completed');
            steps[2].classList.add('active');
            stepLines[0].classList.add('completed');
            stepLines[1].classList.add('completed');
            break;
        case 'success':
            steps[0].classList.add('completed');
            steps[1].classList.add('completed');
            steps[2].classList.add('completed');
            steps[3].classList.add('active');
            stepLines[0].classList.add('completed');
            stepLines[1].classList.add('completed');
            stepLines[2].classList.add('completed');
            break;
    }
}

// Form validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateNIK(nik) {
    return nik.length === 16 && /^\d+$/.test(nik);
}

function validateNPWP(npwp) {
    return npwp.length === 15 && /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/.test(npwp);
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`);
    
    input.classList.add('error');
    errorElement.textContent = message;
    
    return false;
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`);
    
    input.classList.remove('error');
    errorElement.textContent = '';
    
    return true;
}

// Login handling
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate inputs
    let isValid = true;
    
    if (!validateEmail(email)) {
        isValid = showError('email', 'Format email tidak valid');
    } else {
        clearError('email');
    }
    
    if (!validateRequired(password)) {
        isValid = showError('password', 'Kata sandi harus diisi');
    } else {
        clearError('password');
    }
    
    if (isValid) {
        // Store login data
        surveyData.login = { email, password };
        
        // Simulate API call
        simulateAPICall()
            .then(() => {
                showPage('biodata');
            })
            .catch(error => {
                console.error('Login error:', error);
                alert('Terjadi kesalahan saat login. Silakan coba lagi.');
            });
    }
}

function handleGoogleLogin() {
    // Simulate Google OAuth process
    document.getElementById('email').value = 'user.example@gmail.com';
    document.getElementById('password').value = '********';
    
    // Show loading state
    const btn = document.getElementById('login-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="loading"></div>Memproses...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        handleLogin();
    }, 1500);
}

// Biodata handling
function handleBiodataSubmit() {
    const biodata = {
        nik: document.getElementById('nik').value,
        nama: document.getElementById('nama').value,
        tempatLahir: document.getElementById('tempat-lahir').value,
        tanggalLahir: document.getElementById('tanggal-lahir').value,
        instansi: document.getElementById('instansi').value,
        npwp: document.getElementById('npwp').value
    };
    
    // Validate inputs
    let isValid = true;
    
    if (!validateNIK(biodata.nik)) {
        isValid = showError('nik', 'NIK harus 16 digit angka');
    } else {
        clearError('nik');
    }
    
    if (!validateRequired(biodata.nama)) {
        isValid = showError('nama', 'Nama lengkap harus diisi');
    } else {
        clearError('nama');
    }
    
    if (!validateRequired(biodata.tempatLahir)) {
        isValid = showError('tempat-lahir', 'Tempat lahir harus diisi');
    } else {
        clearError('tempat-lahir');
    }
    
    if (!validateRequired(biodata.tanggalLahir)) {
        isValid = showError('tanggal-lahir', 'Tanggal lahir harus diisi');
    } else {
        clearError('tanggal-lahir');
    }
    
    if (!validateRequired(biodata.instansi)) {
        isValid = showError('instansi', 'Instansi harus diisi');
    } else {
        clearError('instansi');
    }
    
    if (!validateNPWP(biodata.npwp)) {
        isValid = showError('npwp', 'Format NPWP tidak valid (contoh: 12.345.678.9-012.345)');
    } else {
        clearError('npwp');
    }
    
    if (isValid) {
        // Store biodata
        surveyData.biodata = biodata;
        showPage('survey');
    }
}

// Survey handling
function selectRating(element) {
    // Remove selected class from all options in the same question
    const parent = element.parentElement;
    const options = parent.querySelectorAll('.rating-option');
    options.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Store the rating value
    const questionElement = parent.closest('.survey-question');
    const questionText = questionElement.querySelector('h3').textContent;
    const ratingValue = element.getAttribute('data-value');
    const ratingText = element.textContent;
    
    surveyData.survey[questionText] = {
        value: ratingValue,
        text: ratingText
    };
}

function handleSurveySubmit() {
    const saran = document.getElementById('saran').value;
    
    // Check if all questions are answered
    const questions = document.querySelectorAll('.survey-question');
    let allAnswered = true;
    
    questions.forEach((question, index) => {
        const selectedOption = question.querySelector('.rating-option.selected');
        if (!selectedOption) {
            allAnswered = false;
            // Highlight unanswered question
            question.style.backgroundColor = '#fff9f9';
            question.style.borderLeft = '4px solid var(--error)';
            question.style.paddingLeft = '16px';
        } else {
            question.style.backgroundColor = '';
            question.style.borderLeft = '';
            question.style.paddingLeft = '';
        }
    });
    
    if (!allAnswered) {
        alert('Harap jawab semua pertanyaan survey sebelum melanjutkan.');
        return;
    }
    
    // Store suggestions
    surveyData.survey.saran = saran;
    surveyData.timestamp = new Date().toISOString();
    
    // Show loading state
    const btn = document.getElementById('survey-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="loading"></div>Mengirim data...';
    btn.disabled = true;
    
    // Simulate API submission
    simulateAPICall(3000)
        .then(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            showPage('success');
            generateSurveySummary();
        })
        .catch(error => {
            console.error('Survey submission error:', error);
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('Terjadi kesalahan saat mengirim survey. Silakan coba lagi.');
        });
}

// File download handling
function handleDownload() {
    const btn = document.getElementById('download-btn');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<div class="loading"></div>Membuat file...';
    btn.disabled = true;
    
    // Simulate file generation
    setTimeout(() => {
        generateExeFile();
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

function generateExeFile() {
    // Create survey data as text
    const surveySummary = generateSurveySummary();
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(surveySummary);
    
    // Create download link
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `survey_lingkungan_${surveyData.biodata.nik}.exe`);
    document.body.appendChild(downloadAnchorNode);
    
    // Trigger download
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    // Update WhatsApp link with user info
    updateWhatsAppLink();
}

function generateSurveySummary() {
    let summary = `SURVEY LINGKUNGAN NASIONAL SEKOLAH\n`;
    summary += `Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi\n`;
    summary += `============================================\n\n`;
    
    summary += `DATA RESPONDEN:\n`;
    summary += `NIK: ${surveyData.biodata.nik}\n`;
    summary += `Nama: ${surveyData.biodata.nama}\n`;
    summary += `Tempat/Tanggal Lahir: ${surveyData.biodata.tempatLahir}, ${new Date(surveyData.biodata.tanggalLahir).toLocaleDateString('id-ID')}\n`;
    summary += `Instansi: ${surveyData.biodata.instansi}\n`;
    summary += `NPWP: ${surveyData.biodata.npwp}\n`;
    summary += `Email: ${surveyData.login.email}\n\n`;
    
    summary += `HASIL SURVEY:\n`;
    Object.entries(surveyData.survey).forEach(([question, answer]) => {
        if (question !== 'saran') {
            summary += `${question}\n`;
            summary += `Jawaban: ${answer.text} (Skor: ${answer.value}/5)\n\n`;
        }
    });
    
    if (surveyData.survey.saran) {
        summary += `SARAN DAN MASUKAN:\n`;
        summary += `${surveyData.survey.saran}\n\n`;
    }
    
    summary += `Waktu Pengisian: ${new Date(surveyData.timestamp).toLocaleString('id-ID')}\n`;
    summary += `ID Survey: SURV${surveyData.biodata.nik.slice(-6)}${Date.now().toString().slice(-6)}`;
    
    return summary;
}

function updateWhatsAppLink() {
    const nama = surveyData.biodata.nama;
    const instansi = surveyData.biodata.instansi;
    const message = `Halo, saya ${nama} dari ${instansi}. Saya telah mengisi survey lingkungan sekolah dan mengunduh file konfirmasi. Apakah bisa mendapatkan informasi lebih lanjut?`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/6281264656570?text=${encodedMessage}`;
    
    document.getElementById('whatsapp-link').href = whatsappLink;
}

// Utility functions
function simulateAPICall(duration = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random failure (10% chance)
            if (Math.random() < 0.1) {
                reject(new Error('Network error'));
            } else {
                resolve('Success');
            }
        }, duration);
    });
}

// Export data for debugging (optional)
window.getSurveyData = function() {
    return surveyData;
};