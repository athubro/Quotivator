import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config (same as before)
const firebaseConfig = {
  apiKey: "AIzaSyDaxGdsgwL_T2ejOh74WK8TA2EJDdxswOw",
  authDomain: "quoteapp-e57e7.firebaseapp.com",
  projectId: "quoteapp-e57e7",
  storageBucket: "quoteapp-e57e7.appspot.com",
  messagingSenderId: "1065813414568",
  appId: "1:1065813414568:web:10e8261f971f05c7cae89d",
  measurementId: "G-XWP863T7K1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadQuotes() {
  const quotesContainer = document.getElementById("shared-quotes");
  if (!quotesContainer) return;

  quotesContainer.innerHTML = "";

  try {
    const quotesSnapshot = await getDocs(collection(db, "quotes"));
    const quotes = [];

    quotesSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      quotes.push({ id: docSnap.id, ...data });
    });

    quotes.sort((a, b) => {
      if ((b.upvotes || 0) !== (a.upvotes || 0)) {
        // Sort by upvotes descending
        return (b.upvotes || 0) - (a.upvotes || 0);
      } else {
        // If upvotes are equal, sort by timestamp descending (newer first)
        return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
      }
    });


    quotes.forEach((quote) => {
      const quoteBox = document.createElement("div");
      quoteBox.className = "quote-box shared-quote";

      // Use upvotes or 0 if undefined
      const upvotes = quote.upvotes || 0;

      quoteBox.innerHTML = `
        <div class="text">“${quote.quote}”</div>
        <div class="author">– ${quote.author || "Anonymous"}</div>
        <div class="text-center">
          <button class="upvote-btn" data-id="${quote.id}">
            Upvote <span class="upvote-count">${upvotes}</span>
          </button>
        </div>
      `;

      quotesContainer.appendChild(quoteBox);
    });

    // Add upvote handlers that update Firestore
    document.querySelectorAll(".upvote-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const quoteId = btn.getAttribute("data-id");
        const countSpan = btn.querySelector(".upvote-count");

        // Disable button immediately to avoid spamming
        btn.disabled = true;

        try {
          const quoteRef = doc(db, "quotes", quoteId);

          // Atomically increment upvotes in Firestore
          await updateDoc(quoteRef, {
            upvotes: increment(1),
          });

          // Update UI count
          let count = parseInt(countSpan.textContent, 10) || 0;
          count++;
          countSpan.textContent = count;
        } catch (error) {
          console.error("Error updating upvotes:", error);
          alert("Failed to update upvote. Try again.");
          btn.disabled = false; // Re-enable on error
        }
      });
    });
  } catch (error) {
    console.error("Error loading quotes:", error);
  }
}

loadQuotes();
