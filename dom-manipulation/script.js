// Quotes array (each quote has text and category)
const quotes = [
  {
    text: "Success is not final, failure is not fatal.",
    category: "Motivation"
  },
  {
    text: "Code is like humor. When you have to explain it, it’s bad.",
    category: "Programming"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    category: "Education"
  }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  // Clear previous quote
  quoteDisplay.innerHTML = "";

  // Create elements dynamically
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${selectedQuote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${selectedQuote.category}`;

  // Append elements to DOM
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Function to add a new quote
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote to array
  quotes.push({ text, category });

  // Clear input fields
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  // Display the newly added quote
  showRandomQuote();
}

// Event listener for showing a new random quote
newQuoteButton.addEventListener("click", showRandomQuote);
