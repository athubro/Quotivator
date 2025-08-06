import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase config
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
const auth = getAuth(app);

function getVotedList() {
  return JSON.parse(localStorage.getItem("votedQuotes") || "[]");
}

function addVotedId(id) {
  const list = getVotedList();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem("votedQuotes", JSON.stringify(list));
  }
}

async function loadQuotes(user) {
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
        return (b.upvotes || 0) - (a.upvotes || 0);
      } else {
        return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
      }
    });

    quotes.forEach((quote) => {
      const quoteBox = document.createElement("div");
      quoteBox.className = "quote-box shared-quote";
      const upvotes = quote.upvotes || 0;

      const comments = quote.comments || [];

      quoteBox.innerHTML = `
        <div class="text">“${quote.quote}”</div>
        <div class="author">– ${quote.author || "Anonymous"}</div>
        <div class="text-center">
          <button class="upvote-btn" data-id="${quote.id}">
            Upvote <span class="upvote-count">${upvotes}</span>
          </button>
        </div>
        <div class="comment-section" id="comments-${quote.id}">
          <h5>Comments</h5>
          <div class="comments-list">
            ${comments.map(comment => `
              <div class="comment">
                <strong>${comment.user || "Anonymous"}:</strong> ${comment.text}
              </div>
            `).join('')}
          </div>
          ${user ? `
            <input type="text" class="comment-input" placeholder="Add a comment..." />
            <button class="submit-comment" data-id="${quote.id}">Post</button>
          ` : `<div class="login-comment-msg">Login to comment</div>`}
        </div>
      `;

      quotesContainer.appendChild(quoteBox);
    });

    // Handle upvotes
    document.querySelectorAll(".upvote-btn").forEach((btn) => {
      const id = btn.dataset.id;
      if (getVotedList().includes(id)) {
        btn.disabled = true;
      }

      btn.addEventListener("click", async () => {
        btn.disabled = true;
        addVotedId(id);
        const countSpan = btn.querySelector(".upvote-count");

        try {
          const ref = doc(db, "quotes", id);
          await updateDoc(ref, { upvotes: increment(1) });
          let c = parseInt(countSpan.textContent, 10) || 0;
          countSpan.textContent = c + 1;
        } catch (err) {
          console.error("Failed to upvote:", err);
          btn.disabled = false;
        }
      });
    });

    // Handle comments
    document.querySelectorAll(".submit-comment").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const quoteId = btn.dataset.id;
        const container = document.getElementById(`comments-${quoteId}`);
        const input = container.querySelector(".comment-input");
        const commentText = input.value.trim();
        if (!commentText) return;

        try {
          const ref = doc(db, "quotes", quoteId);
          await updateDoc(ref, {
            comments: arrayUnion({
              text: commentText,
              user: user.displayName || "Anonymous",
              timestamp: Date.now()
            })
          });

          input.value = "";
          loadQuotes(user); // Refresh quotes to show new comment
        } catch (err) {
          console.error("Failed to add comment:", err);
        }
      });
    });
  } catch (error) {
    console.error("Error loading quotes:", error);
  }
}

// 🔐 Protect page (redirect to login.html if not logged in)
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadQuotes(user);
  }
});
