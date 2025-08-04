// Firebase CDN-based imports (no bundler or Node needed)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

// ✅ Example submit function
document.getElementById("quote-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const quoteText = document.getElementById("quote-text").value;
  const quoteAuthor = document.getElementById("quote-author").value;

  try {
    await addDoc(collection(db, "quotes"), {
      text: quoteText,
      author: quoteAuthor,
      timestamp: serverTimestamp()
    });

    alert("Quote submitted!");
    document.getElementById("quote-form").reset();
  } catch (error) {
    console.error("Error adding quote:", error);
    alert("Error submitting quote. Check the console.");
  }
});
