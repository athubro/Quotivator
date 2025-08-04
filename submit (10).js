import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDaxGdsgwL_T2ejOh74WK8TA2EJDdxswOw",
  authDomain: "quoteapp-e57e7.firebaseapp.com",
  projectId: "quoteapp-e57e7",
  storageBucket: "quoteapp-e57e7.firebasestorage.app",
  messagingSenderId: "1065813414568",
  appId: "1:1065813414568:web:10e8261f971f05c7cae89d",
  measurementId: "G-XWP863T7K1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('quote-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const quoteText = document.getElementById('quote-text').value.trim();
    const quoteAuthor = document.getElementById('quote-author').value.trim();
    if (quoteText && quoteAuthor) {
        try {
            await addDoc(collection(db, 'submittedQuotes'), {
                text: quoteText,
                author: quoteAuthor,
                upvotes: 0,
                voters: [],
                timestamp: new Date()
            });
            document.getElementById('quote-text').value = '';
            document.getElementById('quote-author').value = '';
            const successMessage = document.querySelector('.alert-success');
            successMessage.classList.remove('hidden');
            setTimeout(() => successMessage.classList.add('hidden'), 3000);
        } catch (error) {
            console.error('Error submitting quote:', error);
        }
    }
});