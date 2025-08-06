let front = true;

// Getting the front and the back author boxes
const authors = document.querySelectorAll(".author");

// Getting the front and the back texts
const texts = document.querySelectorAll(".text");

// Getting the tweet links
const tweetLinks = document.querySelectorAll(".tweet-quote");

// Getting the daily quote elements
const dailyText = document.querySelector(".daily-quote-block .text");
const dailyAuthor = document.querySelector(".daily-quote-block .author");
const dailyTweet = document.querySelector(".daily-quote-block .tweet-quote");

// Getting the body
const body = document.getElementById("body");

// Getting the buttons
const button = document.querySelectorAll(".new-quote");

const blockFront = document.querySelector(".block__front");
const blockBack = document.querySelector(".block__back");

const authorFront = authors[0];
const authorBack = authors[1];

const textFront = texts[0];
const textBack = texts[1];

const tweetFront = tweetLinks[0];
const tweetBack = tweetLinks[1];

// An arrow function used to display a random quote
const displayRandomQuote = (quoteData) => {
    if (!quoteData) {
        textFront.innerHTML = "Loading quotes...";
        authorFront.innerHTML = "Please wait";
        textBack.innerHTML = "Loading quotes...";
        authorBack.innerHTML = "Please wait";
        tweetFront.href = "#";
        tweetBack.href = "#";
        return;
    }

    let quote = quoteData.content;
    let author = quoteData.author;

    if (!author) {
        author = "Anonymous";
    }

    const tweetText = `${quote} — ${author}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    if (front) {
        textFront.innerHTML = quote;
        authorFront.innerHTML = author;
        tweetFront.href = tweetUrl;
    } else {
        textBack.innerHTML = quote;
        authorBack.innerHTML = author;
        tweetBack.href = tweetUrl;
    }
    
    front = !front;
};

// Function to display the daily quote
const displayDailyQuote = (quoteData) => {
    if (!quoteData) {
        dailyText.innerHTML = "Loading daily quote...";
        dailyAuthor.innerHTML = "Please wait";
        dailyTweet.href = "#";
        return;
    }

    let quote = quoteData.content;
    let author = quoteData.author || "Anonymous";

    const tweetText = `${quote} — ${author}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    dailyText.innerHTML = quote;
    dailyAuthor.innerHTML = author;
    dailyTweet.href = tweetUrl;
};

// Function to generate a seed based on the current date
const getDailySeed = () => {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};

// Function to check if stored daily quote is valid
const getStoredDailyQuote = () => {
    const stored = localStorage.getItem('dailyQuote');
    if (!stored) return null;
    const { date, quoteData } = JSON.parse(stored);
    const todaySeed = getDailySeed();
    if (date === todaySeed) return quoteData;
    return null;
};

// Function to save daily quote to localStorage
const saveDailyQuote = (quoteData) => {
    const todaySeed = getDailySeed();
    localStorage.setItem('dailyQuote', JSON.stringify({ date: todaySeed, quoteData }));
};

// Fetching a random quote for the random quote box
fetch("https://api.quotable.io/random")
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch quote");
        return response.json();
    })
    .then(quoteData => displayRandomQuote(quoteData))
    .catch(error => {
        console.error("Error fetching random quote:", error);
        textFront.innerHTML = "Go to api.quotable.io to enable, (this site is safe)";
        authorFront.innerHTML = "Atharva Bengeri";
        textBack.innerHTML = "Go to api.quotable.io to enable";
        authorBack.innerHTML = "Thanks";
        tweetFront.href = "#";
        tweetBack.href = "#";
    });

// Handling the daily quote
const storedQuote = getStoredDailyQuote();
if (storedQuote) {
    displayDailyQuote(storedQuote);
} else {
    fetch(`https://api.quotable.io/random?seed=${getDailySeed()}`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch daily quote");
            return response.json();
        })
        .then(quoteData => {
            saveDailyQuote(quoteData);
            displayDailyQuote(quoteData);
        })
        .catch(error => {
            console.error("Error fetching daily quote:", error);
            dailyText.innerHTML = "I am currently working on bypassing this step";
            dailyAuthor.innerHTML = <a href="api.quotable.io">Go Here</a>;
            dailyTweet.href = "#";
        });
}

// Adding an onclick listener for the new quote button
function newQuote() {
    blockBack.classList.toggle('rotateB');
    blockFront.classList.toggle('rotateF');

    fetch("https://api.quotable.io/random")
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch quote");
            return response.json();
        })
        .then(quoteData => displayRandomQuote(quoteData))
        .catch(error => {
            console.error("Error fetching quotes:", error);
            textFront.innerHTML = "Go to api.quotable.io to enable";
            authorFront.innerHTML = "thanks";
            textBack.innerHTML = "Go to api.quotable.io to enable";
            authorBack.innerHTML = "atharva bengeri";
            tweetFront.href = "#";
            tweetBack.href = "#";
        });
}
