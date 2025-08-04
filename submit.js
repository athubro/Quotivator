// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaxGdsgwL_T2ejOh74WK8TA2EJDdxswOw",
  authDomain: "quoteapp-e57e7.firebaseapp.com",
  projectId: "quoteapp-e57e7",
  storageBucket: "quoteapp-e57e7.firebasestorage.app",
  messagingSenderId: "1065813414568",
  appId: "1:1065813414568:web:10e8261f971f05c7cae89d",
  measurementId: "G-XWP863T7K1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// === FIRESTORE QUOTE SAVING ===

async function saveQuote(quote, author) {
  const quoteData = {
    content: quote,
    author: author || 'Anonymous',
    timestamp: new Date().toISOString(),
    upvotes: 0,
    upvotedDevices: []
  };

  try {
    await db.collection('quotes').add(quoteData);
    console.log('✅ Quote saved to Firestore');
  } catch (error) {
    console.error('❌ Error saving quote:', error);
  }
}

// === HANDLE FORM SUBMISSION ===

function handleFormSubmission() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const quoteInput = document.getElementById('quote-text');
    const authorInput = document.getElementById('quote-author');
    const quote = quoteInput?.value.trim();
    const author = authorInput?.value.trim();

    if (!quote) return;
    if (quote.length > 500) {
      alert('Quote must be 500 characters or less.');
      return;
    }

    saveQuote(quote, author);
    form.reset();

    const message = document.getElementById('success-message');
    if (message) {
      message.classList.remove('hidden');
      setTimeout(() => message.classList.add('hidden'), 3000);
    }
  });
}

// === GET DEVICE ID FOR UPVOTE TRACKING ===

function getDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

// === DISPLAY SHARED QUOTES ===

function displaySharedQuotes() {
  const container = document.getElementById('shared-quotes');
  if (!container) return;

  const quotes = JSON.parse(localStorage.getItem('submittedQuotes') || '[]');
  quotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const deviceId = getDeviceId();
  container.innerHTML = '';

  quotes.forEach((quoteData, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'quote-box shared-quote';

    const quoteText = document.createElement('div');
    quoteText.className = 'quote-text';
    quoteText.textContent = quoteData.content;

    const quoteAuthor = document.createElement('div');
    quoteAuthor.className = 'author';
    quoteAuthor.textContent = quoteData.author;

    const upvoteBtn = document.createElement('button');
    upvoteBtn.className = 'upvote-btn';
    upvoteBtn.textContent = `Upvote (${quoteData.upvotes})`;

    if (quoteData.upvotedDevices.includes(deviceId)) {
      upvoteBtn.disabled = true;
      upvoteBtn.style.opacity = '0.6';
    }

    upvoteBtn.addEventListener('click', () => {
      if (!quoteData.upvotedDevices.includes(deviceId)) {
        quoteData.upvotes += 1;
        quoteData.upvotedDevices.push(deviceId);
        localStorage.setItem('submittedQuotes', JSON.stringify(quotes));
        upvoteBtn.textContent = `Upvote (${quoteData.upvotes})`;
        upvoteBtn.disabled = true;
        upvoteBtn.style.opacity = '0.6';
      }
    });

    wrapper.appendChild(quoteText);
    wrapper.appendChild(quoteAuthor);
    wrapper.appendChild(upvoteBtn);
    container.appendChild(wrapper);
  });
}

// === ON PAGE LOAD ===

document.addEventListener('DOMContentLoaded', () => {
  handleFormSubmission();
  displaySharedQuotes();
});
