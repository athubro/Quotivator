// Firebase CDN-based imports (no bundler or Node needed)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDaxGdsgwL_T2ejOh74WK8TA2EJDdxswOw",
  authDomain: "quoteapp-e57e7.firebaseapp.com",
  projectId: "quoteapp-e57e7",
  storageBucket: "quoteapp-e57e7.appspot.com", // fixed typo (.app → .appspot.com)
  messagingSenderId: "1065813414568",
  appId: "1:1065813414568:web:10e8261f971f05c7cae89d",
  measurementId: "G-XWP863T7K1"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveQuote(quote, author = "Anonymous") {
  try {
    await addDoc(collection(db, "quotes"), {
      quote: quote,
      author: author,
      timestamp: serverTimestamp()
    });
    console.log("Quote saved:", quote, "by", author);

    // ✅ Reload quotes on the page to show it immediately
    loadQuotes();
  } catch (error) {
    console.error("Error saving quote:", error);
  }
}
async function loadQuotes() {
  const quotesContainer = document.getElementById("shared-quotes");
  quotesContainer.innerHTML = ""; // Clear existing quotes

  try {
    const quotesSnapshot = await getDocs(collection(db, "quotes"));
    const quotes = [];

    quotesSnapshot.forEach((doc) => {
      const data = doc.data();
      quotes.push({ id: doc.id, ...data });
    });

    // Sort quotes by timestamp (newest first)
    quotes.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);

    quotes.forEach((quote) => {
      const quoteBox = document.createElement("div");
      quoteBox.className = "quote-box shared-quote";

      quoteBox.innerHTML = `
        <div class="text">“${quote.text}”</div>
        <div class="author">– ${quote.author || "Anonymous"}</div>
        <div class="text-center">
          <button class="upvote-btn" data-id="${quote.id}">
            Upvote <span class="upvote-count">0</span>
          </button>
        </div>
      `;

      quotesContainer.appendChild(quoteBox);
    });

    // Add upvote button event listeners (this demo version doesn’t save votes yet)
    document.querySelectorAll(".upvote-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const countSpan = btn.querySelector(".upvote-count");
        let count = parseInt(countSpan.textContent, 10) || 0;
        count++;
        countSpan.textContent = count;
        btn.disabled = true; // Prevent spamming
      });
    });
  } catch (error) {
    console.error("Error loading quotes:", error);
  }
}


// ✅ Example submit function
document.getElementById("quote-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const quoteText = document.getElementById("quote-text").value.trim();
  const quoteAuthor = document.getElementById("quote-author").value.trim();

  try {
    await saveQuote(quoteText, quoteAuthor);

    alert("Quote submitted!");
    document.getElementById("quote-form").reset();
  } catch (error) {
    alert("Error submitting quote. Check the console.");
  }
});

