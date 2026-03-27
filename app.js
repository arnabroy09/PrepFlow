// app.js
// 1. Theme Logic
const htmlEl = document.documentElement;
if (localStorage.getItem('theme') === 'dark') htmlEl.setAttribute('data-theme', 'dark');

function toggleTheme() {
    const icon = document.getElementById('themeIcon');
    if (htmlEl.getAttribute('data-theme') === 'dark') {
        htmlEl.removeAttribute('data-theme'); localStorage.setItem('theme', 'light');
        if(icon) icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        htmlEl.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark');
        if(icon) icon.classList.replace('fa-moon', 'fa-sun');
    }
}
window.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById('themeIcon');
    if (icon && localStorage.getItem('theme') === 'dark') icon.classList.replace('fa-moon', 'fa-sun');
});

// 2. Streak Logic
function updateStreak() {
    const today = new Date().toDateString(); let lastLogin = localStorage.getItem('lastLogin'); let streak = parseInt(localStorage.getItem('dailyStreak')) || 0;
    if (lastLogin !== today) { let y = new Date(); y.setDate(y.getDate()-1); if(lastLogin === y.toDateString()) streak++; else streak = 1; localStorage.setItem('dailyStreak', streak); localStorage.setItem('lastLogin', today); }
    const badge = document.querySelector('#streakBadge span');
    if(badge) badge.textContent = `${streak} Day Streak`;
} updateStreak();

// 3. Modals & Backup
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModals() { document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('active')); }

function exportWorkspace() {
    const data = { generalNotes:localStorage.getItem('generalNotes'), kanbanData:localStorage.getItem('kanbanData'), studyTableData:localStorage.getItem('studyTableData'), todoList:localStorage.getItem('todoList'), exams:localStorage.getItem('exams'), flashcards:localStorage.getItem('flashcards'), studySessions:localStorage.getItem('studySessions'), theme:localStorage.getItem('theme'), dailyStreak:localStorage.getItem('dailyStreak') };
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"})); a.download="PrepFlow_Backup.json"; a.click(); closeModals();
}
function importWorkspace(event) {
    const file = event.target.files[0]; if(!file) return; const reader = new FileReader();
    reader.onload = e => { try { const data = JSON.parse(e.target.result); Object.keys(data).forEach(k => { if(data[k]) localStorage.setItem(k,data[k]); }); alert("Restored!"); location.reload(); } catch { alert("Invalid file."); } }; reader.readAsText(file);
}

// 4. Exams Slider
let exams = JSON.parse(localStorage.getItem('exams')) || [];
function renderExams() {
    const cont = document.getElementById('examContainer');
    if(!cont) return; cont.innerHTML = '';
    exams.forEach((ex, i) => {
        const diff = Math.ceil((new Date(ex.date) - new Date()) / (1000 * 60 * 60 * 24));
        cont.innerHTML += `<div class="exam-card"><button onclick="deleteExam(${i})" style="position:absolute; top:5px; right:5px; background:none; border:none; color:var(--danger); cursor:pointer;"><i class="fa-solid fa-xmark"></i></button><h4>${ex.name}</h4><div class="days">${diff>0?diff:0}</div><span style="font-size:0.75rem; color:var(--text-muted);">${diff>0?'DAYS LEFT':'PASSED'}</span></div>`;
    });
    cont.innerHTML += `<button class="exam-add-btn" onclick="openModal('examModal')"><i class="fa-solid fa-plus" style="margin-right:8px;"></i> Add Exam</button>`;
}
function saveNewExam() { let n = document.getElementById('newExamName').value, d = document.getElementById('newExamDate').value; if(n && d) { exams.push({name:n, date:d}); localStorage.setItem('exams', JSON.stringify(exams)); renderExams(); closeModals(); document.getElementById('newExamName').value=''; } }
function deleteExam(i) { exams.splice(i,1); localStorage.setItem('exams', JSON.stringify(exams)); renderExams(); }
window.addEventListener('DOMContentLoaded', renderExams);