import { base_url } from "../baseurl.js";

// --- State ---
let token = localStorage.getItem('token');
let generatedLink = localStorage.getItem('link');
let isLoggedIn = !!token;

// --- DOM Elements ---
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const createLinkBtn = document.getElementById('create-link-btn');
const generatedLinkBox = document.getElementById('generated-link-box');
const generatedLinkSpan = document.getElementById('generated-link');
const copyLinkBtn = document.getElementById('copy-link-btn');
const shareWhatsapp = document.getElementById('share-whatsapp');
const shareFacebook = document.getElementById('share-facebook');
const shareTwitter = document.getElementById('share-twitter');
const modalBg = document.getElementById('modal-bg');
const closeModalBtn = document.getElementById('close-modal');
const loginModalBg = document.getElementById('login-modal-bg');
const closeLoginModalBtn = document.getElementById('close-login-modal');
const messagesList = document.getElementById('messages-list');

// --- Helper: Show/Hide Modals ---
function showModal(modal) { modal.style.display = 'flex'; }
function hideModal(modal) { modal.style.display = 'none'; }

// --- Auth UI Update ---
function updateAuthUI() {
    loginBtn.style.display = isLoggedIn ? 'none' : '';
    logoutBtn.style.display = isLoggedIn ? '' : 'none';
    if (isLoggedIn && generatedLink) {
        generatedLinkBox.style.display = '';
        generatedLinkSpan.textContent = generatedLink;
        setShareLinks(generatedLink);
    } else {
        generatedLinkBox.style.display = 'none';
    }

        // ✅ Show user name and time inside a <p>
    const name = localStorage.getItem("name");
    const time = localStorage.getItem("account_autodelete_time");
    const userInfoP = document.getElementById("user-info");
    if (isLoggedIn && name && time) {
        userInfoP.innerHTML = `<p >Welcome&nbsp <span style="color:#ff0080;"><b>${name}</b></span> ! </p>
                                <p> Account is scheduled for auto deletion after : <span style="color:#ff0080;"><b>${time}</b></span></p>`;
        userInfoP.style.display = 'block';
    }
}

// --- Social Share Links with Default Description ---
function setShareLinks(link) {
    const desc = "Send me a secret message — I'll never know who sent it! 🔐✨ Your identity stays hidden. Try it now!";
    shareWhatsapp.href = `https://wa.me/?text=${encodeURIComponent(desc + ' ' + link)}`;
    shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(desc)}`;
    shareTwitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(desc + ' ' + link)}`;
}

// --- Copy Link ---
copyLinkBtn.onclick = function() {
    navigator.clipboard.writeText(generatedLinkSpan.textContent);
    this.textContent = "Copied!";
    setTimeout(() => { this.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 1200);
};

// --- Mobile Menu ---
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
mobileMenuBtn.onclick = e => { e.stopPropagation(); navLinks.classList.toggle('active'); };
document.addEventListener('click', e => { if (!e.target.closest('.nav-content')) navLinks.classList.remove('active'); });

// --- Show Modals ---
createLinkBtn.onclick = () => { if (!isLoggedIn) showModal(modalBg); };
loginBtn.onclick = () => { showModal(loginModalBg); };
closeModalBtn.onclick = () => { hideModal(modalBg); };
closeLoginModalBtn.onclick = () => { hideModal(loginModalBg); };
modalBg.onclick = e => { if (e.target === modalBg) hideModal(modalBg); };
loginModalBg.onclick = e => { if (e.target === loginModalBg) hideModal(loginModalBg); };

// --- Socket.io Username Validation ---
const socket = io(base_url);
const usernameInput = document.getElementById('reg-username');
const usernameStatus = document.getElementById('username-status');
let usernameTimeout;
usernameInput.addEventListener('input', function() {
    clearTimeout(usernameTimeout);
    const username = usernameInput.value.trim();
    if (!username) { usernameStatus.textContent = ''; usernameStatus.className = 'username-status'; return; }
    usernameStatus.textContent = 'Checking...';
    usernameStatus.className = 'username-status';
    usernameTimeout = setTimeout(() => {
        socket.emit('username_Validation', username);
    }, 400);
});
socket.on('username_Validation', function(data) {
    if (data.status < 300 && data.status >= 200) {
        usernameStatus.textContent = 'Username is available!';
        usernameStatus.className = 'username-status available';
    } else {
        usernameStatus.textContent = 'Username is taken!';
        usernameStatus.className = 'username-status taken';
    }
});

// --- Register ---
document.getElementById('register-form').onsubmit = async function(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const res = await fetch(`${base_url}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password })
    });
    console.log(res);
    const data = await res.json();                                                                          
    if (res.ok && data.token && data.id) {
        token = data.token;
        generatedLink = `${window.location.origin}/sendmessage/msg.html?id=${data.id}`;
        localStorage.setItem('token', token);
        localStorage.setItem('link', generatedLink);
        localStorage.setItem('name',data.name);
        localStorage.setItem(`account_autodelete_time`, data.time)
        isLoggedIn = true;
        hideModal(modalBg);
        updateAuthUI();
        loadMessages();
    } else {
        alert(data.message || "Registration failed.");
    }
};

// --- Login ---
document.getElementById('login-form').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const res = await fetch(`${base_url}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();                                                               
    
    if (res.ok && data.token && data.id) {
        token = data.token;
        generatedLink = `${window.location.origin}/sendmessage/msg.html?id=${data.id}`;
        localStorage.setItem('token', token);
        localStorage.setItem('link', generatedLink);
        localStorage.setItem('name',data.name);
        localStorage.setItem('account_autodelete_time', data.time)
        isLoggedIn = true;
        hideModal(loginModalBg);
        updateAuthUI();
        loadMessages();
    } else {
        alert(data.message || "Login failed.");
    }
};

// --- Logout ---
logoutBtn.onclick = function() {
    token = null;
    generatedLink = null;
    localStorage.removeItem('token');
    localStorage.removeItem('link');
    localStorage.removeItem('name');
    localStorage.removeItem(`account_autodelete_time`);
    isLoggedIn = false;
    updateAuthUI();
    messagesList.innerHTML = '<div class="no-messages" style="color:#fff; text-align:center;">Login to see your messages.</div>';
    alert('Logged out!');
};

// --- Verify Session on Load ---
async function verifySession() {
    if (!token) { isLoggedIn = false; updateAuthUI(); return; }
    try {
        const res = await fetch(`${base_url}/verify`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) { 
            isLoggedIn = true;
            updateAuthUI();
            loadMessages();
        } else {
    localStorage.removeItem('token');
    localStorage.removeItem('link');
    localStorage.removeItem('name');
    localStorage.removeItem(`account_autodelete_time`);
            isLoggedIn = false;
            updateAuthUI();
            messagesList.innerHTML = '<div class="no-messages" style="color:#fff; text-align:center;">Session expired. Please login again.</div>';
            userInfoP.style.display = 'none';
        }
    } catch {
        isLoggedIn = false;
        updateAuthUI();
        messagesList.innerHTML = '<div class="no-messages" style="color:#fff; text-align:center;">Failed to verify session.</div>';
    }
}

// --- Load Received Messages ---
async function loadMessages() {
    if (!isLoggedIn || !token) {
        messagesList.innerHTML = '<div class="no-messages" style="color:#fff; text-align:center;">Login to see your messages.</div>';
        return;
    }
    try {
        const res = await fetch(`${base_url}/getMessages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.message) && data.message.length > 0) {
            messagesList.innerHTML = '';
            data.message.forEach(msg => {
                const card = document.createElement('div');
                card.className = 'message-card';
                card.innerHTML = `
                    <div>${msg.text}</div>
                   
                `;
                messagesList.appendChild(card);
            });
        } else {
            messagesList.innerHTML = '<div class="no-messages" style="color:#fff; text-align:center;">No messages yet.</div>';
        }
    } catch {
        messagesList.innerHTML = '<div class="no-messages" style="color:#fff; text-align:center;">Failed to load messages.</div>';
    }
}

// --- On Load ---
updateAuthUI();
verifySession();
