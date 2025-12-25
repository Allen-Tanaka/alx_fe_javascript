// ==============================
// Load quotes from Local Storage
// ==============================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Education is the most powerful weapon.", category: "Education" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");

// ==============================
// Save quotes to Local Storage
// ==============================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ==============================
// Show Random Quote
// ==============================
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = `"${quote.text}"`;

  const small = document.createElement("small");
  small.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);

  // Save last viewed quote to session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// ==============================
// Create Add Quote Form (REQUIRED)
// ==============================
function createAddQuoteForm() {
  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// ==============================
// Add Quote Logic
// ==============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  showRandomQuote();
}

// ==============================
// Export Quotes to JSON
// ==============================
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// ==============================
// Import Quotes from JSON
// ==============================
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);

    quotes.push(...importedQuotes);
    saveQuotes();

    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}

// ==============================
// Event Listener
// ==============================
newQuoteButton.addEventListener("click", showRandomQuote);

// ==============================
// Initialize App
// ==============================
createAddQuoteForm();

// Load last viewed quote from session storage (optional demo)
const lastQuote = sessionStorage.getItem("lastViewedQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `"${quote.text}" <br /><small>Category: ${quote.category}</small>`;
}
