import { base_url } from "../baseurl.js";

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
});
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-content')) {
        navLinks.classList.remove('active');
    }
});

// Timer and recipient
let expiryTimestamp;
let timerStarted = false;

// Convert ms to HH:MM:SS
function msToHMS(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    let m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    let s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}hr : ${m}min : ${s}sec `;
}

// Validate URL and get recipient info
async function urlValidate() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        alert('Invalid URL: id not found.');
        return;
    }
    try {
        const res = await fetch(`${base_url}/reciverValidate?id=${id}`);
        const data = await res.json();
        if (res.ok) {
            expiryTimestamp = data.time; // ms remaining
            // Set recipient name in all elements with class 'recipient-name'
            document.querySelectorAll('.recipient-name').forEach(el => {
                el.textContent = data.name || "User";
            });
            // Show the time immediately
            document.getElementById('timeValue').textContent =` ${msToHMS(expiryTimestamp)}`;

            // Start timer to update every second
            if (!timerStarted) {
                setInterval(() => {
                    expiryTimestamp -= 1000;
                    document.getElementById('timeValue').textContent =`${msToHMS(expiryTimestamp)}`;
                }, 1000);
                timerStarted = true;
            }
        } else {
            alert(data.message || "Invalid or expired link.");
        }
    } catch (err) {
        alert("Error validating link.");
    }
}
await urlValidate();

// "Create your own receiving link" button
const createLinkBtn = document.getElementById('create-link-btn');
if (createLinkBtn) {
    createLinkBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = "../index.html";
    });
}

// Send Message logic
const messageForm = document.querySelector('.message-form');
const textareaWrapper = document.querySelector('.textarea-wrapper');
const actionBtns = document.querySelector('.action-btns');

// Create the "Send New Message" button (hidden initially)
const sendNewBtn = document.createElement('button');
sendNewBtn.type = 'button';
sendNewBtn.textContent = 'Send New Message';
sendNewBtn.className = 'send-new-btn action-btns-btn';
sendNewBtn.style.display = 'none';
sendNewBtn.style.margin = '0.7rem auto 0 auto';
sendNewBtn.style.background = 'linear-gradient(45deg, #23d5ab, #23a6d5)';
sendNewBtn.style.color = '#fff';
sendNewBtn.style.border = 'none';
sendNewBtn.style.padding = '0.85rem 1rem';
sendNewBtn.style.borderRadius = '12px';
sendNewBtn.style.fontSize = '1.08rem';
sendNewBtn.style.fontWeight = '500';
sendNewBtn.style.cursor = 'pointer';
sendNewBtn.style.transition = 'all 0.3s';

// Insert after actionBtns
actionBtns.parentNode.insertBefore(sendNewBtn, actionBtns.nextSibling);

sendNewBtn.addEventListener('click', () => {
    textareaWrapper.style.display = '';
    actionBtns.style.display = '';
    sendNewBtn.style.display = 'none';
    messageForm.querySelector('textarea').value = '';
});

// Message submit handler
messageForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const textarea = this.querySelector('textarea');
    const message = textarea.value.trim();
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!message) {
        alert('Please enter a message.');
        return;
    }
    if (!id) {
        alert('Invalid url, id not found...');
        return;
    }

    try {
        
        const res = await fetch(`${base_url}/sendMessage?id=${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await res.json();
        if (res.ok) {
            textarea.value = '';
            textareaWrapper.style.display = 'none';
            // Only hide the send button, not the "Create your own receiving link" button
            actionBtns.querySelector('button[type="submit"]').style.display = 'none';
            sendNewBtn.style.display = '';
        } else {
            alert(data.message || 'Failed to send message.');
        }
    } catch (err) {
        alert('Error sending message.');
    }
});

// When "Send New Message" is clicked, restore the send button
sendNewBtn.addEventListener('click', () => {
    textareaWrapper.style.display = '';
    actionBtns.style.display = '';
    actionBtns.querySelector('button[type="submit"]').style.display = '';
    sendNewBtn.style.display = 'none';
    messageForm.querySelector('textarea').value = '';
});




