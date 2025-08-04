import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";


// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDaxGdsgwL_T2ejOh74WK8TA2EJDdxswOw",
  authDomain: "quoteapp-e57e7.firebaseapp.com",
  projectId: "quoteapp-e57e7",
  storageBucket: "quoteapp-e57e7.appspot.com",
  messagingSenderId: "1065813414568",
  appId: "1:1065813414568:web:10e8261f971f05c7cae89d",
  measurementId: "G-XWP863T7K1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

async function saveQuote(quote) {
  const user = auth.currentUser;

  if (!user) {
    alert("You must be signed in to submit a quote.");
    window.location.href = "/login.html"; 
    return;
  }

  const authorName = user.displayName || "Anonymous";

  try {
    await addDoc(collection(db, "quotes"), {
      quote: quote,
      author: authorName,
      timestamp: serverTimestamp(),
      upvotes: 0
    });

    console.log("Quote saved:", quote, "by", authorName);
    loadQuotes();
  } catch (error) {
    console.error("Error saving quote:", error);
  }
}


async function loadQuotes() {
  const quotesContainer = document.getElementById("shared-quotes");
  if (!quotesContainer) return; // safety check

  quotesContainer.innerHTML = ""; // Clear existing quotes

  try {
    const quotesSnapshot = await getDocs(collection(db, "quotes"));
    const quotes = [];

    quotesSnapshot.forEach((doc) => {
      const data = doc.data();
      quotes.push({ id: doc.id, ...data });
    });

    quotes.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

    quotes.forEach((quote) => {
      const quoteBox = document.createElement("div");
      quoteBox.className = "quote-box shared-quote";

      quoteBox.innerHTML = `
        <div class="text">“${quote.quote}”</div>
        <div class="author">– ${quote.author || "Anonymous"}</div>
        <div class="text-center">
          <button class="upvote-btn" data-id="${quote.id}">
            Upvote <span class="upvote-count">0</span>
          </button>
        </div>
      `;

      quotesContainer.appendChild(quoteBox);
    });

    document.querySelectorAll(".upvote-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const countSpan = btn.querySelector(".upvote-count");
        let count = parseInt(countSpan.textContent, 10) || 0;
        count++;
        countSpan.textContent = count;
        btn.disabled = true;
      });
    });
  } catch (error) {
    console.error("Error loading quotes:", error);
  }
}

document.getElementById("quote-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const quoteText = document.getElementById("quote-text").value.trim();
  const quoteAuthor = document.getElementById("quote-author").value.trim();

  if (!quoteText) {
    alert("Please enter a quote!");
    return;
  }

  try {
    await saveQuote(quoteText, quoteAuthor);

    alert("Quote submitted!");
    document.getElementById("quote-form").reset();
  } catch (error) {
    alert("Error submitting quote. Check the console.");
  }
});

// Optional: load quotes here too if you want to show them on submit page
loadQuotes();
