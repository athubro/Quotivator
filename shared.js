import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

async function loadQuotes() {
  const quotesContainer = document.getElementById("shared-quotes");
  if (!quotesContainer) return; // If element missing, do nothing

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

    // Upvote buttons without saving votes (demo only)
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

// Load quotes when the page loads
loadQuotes();
