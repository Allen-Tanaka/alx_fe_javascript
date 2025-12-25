// =====================================
// Load Quotes from Local Storage
// =====================================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { id: 2, text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// DOM References
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

// =====================================
// Save Quotes to Local Storage
// =====================================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// =====================================
// Populate Categories
// =====================================
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// =====================================
// Show Random Quote
// =====================================
function showRandomQuote() {
  const list =
    categoryFilter.value === "all"
      ? quotes
      : quotes.filter(q => q.category === categoryFilter.value);

  if (list.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const quote = list[Math.floor(Math.random() * list.length)];
  quoteDisplay.innerHTML = `"${quote.text}" <br /><small>${quote.category}</small>`;
}

// =====================================
// Filter Quotes
// =====================================
function filterQuotes() {
  quoteDisplay.innerHTML = "";
  const filtered =
    categoryFilter.value === "all"
      ? quotes
      : quotes.filter(q => q.category === categoryFilter.value);

  filtered.forEach(q => {
    quoteDisplay.innerHTML += `"${q.text}" <br /><small>${q.category}</small><hr />`;
  });

  localStorage.setItem("selectedCategory", categoryFilter.value);
}

// =====================================
// Create Add Quote Form
// =====================================
function createAddQuoteForm() {
  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.addEventListener("click", addQuote);

  formContainer.append(textInput, categoryInput, btn);
}

// =====================================
// Add Quote + POST to Server
// =====================================
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("All fields required");
    return;
  }

  const newQuote = {
    id: Date.now(),
    text,
    category
  };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();

  postQuoteToServer(newQuote);
}

// =====================================
// MOCK SERVER CONFIG
// =====================================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// =====================================
// FETCH FROM SERVER (REQUIRED NAME)
// =====================================
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  return data.slice(0, 5).map(post => ({
    id: post.id,
    text: post.title,
    category: "Server"
  }));
}

// =====================================
// POST TO SERVER (REQUIRED)
// =====================================
async function postQuoteToServer(quote) {
  await fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote)
  });
}

// =====================================
// SYNC LOGIC (REQUIRED NAME)
// SERVER TAKES PRECEDENCE
// =====================================
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Conflict Resolution: Server wins
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();

    syncStatus.textContent = "✔ Synced with server (server version applied)";
    setTimeout(() => (syncStatus.textContent = ""), 3000);
  } catch (error) {
    syncStatus.textContent = "⚠ Sync failed";
  }
}

// =====================================
// PERIODIC SYNC (REQUIRED)
// =====================================
setInterval(syncQuotes, 30000);

// =====================================
// Event Listener
// =====================================
newQuoteButton.addEventListener("click", showRandomQuote);

// =====================================
// Initialize App
// =====================================
createAddQuoteForm();
populateCategories();
filterQuotes();
syncQuotes();
