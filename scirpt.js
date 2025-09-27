// --- Customer Database ---
const customers = [
  { name: "Jacob", address: "123 Main St", email: "jacob@example.com" },
  { name: "Matthew", address: "456 Oak Ave", email: "matthew@example.com" }
];

// --- Elements ---
const nameInput = document.getElementById("customerName");
const addressInput = document.getElementById("address");
const emailInput = document.getElementById("email");
const suggestions = document.getElementById("suggestions");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const gpsOutput = document.getElementById("gps");
const timeOutput = document.getElementById("timestamp");
const form = document.getElementById("proofForm");
const popup = document.getElementById("popup");

let photoData = null;
let gpsData = null;

// --- Photo Upload ---
photoInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    photoData = e.target.result;
    preview.src = photoData;
  };
  reader.readAsDataURL(file);
});

// --- GPS ---
function updateGPS() {
  if (!navigator.geolocation) {
    gpsOutput.innerText = "GPS not supported on this device";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      gpsData = { latitude, longitude };
      gpsOutput.innerText = `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    },
    (err) => {
      gpsOutput.innerText = "GPS unavailable";
      console.error(err);
    }
  );
}
updateGPS();

// --- Suggestions Logic ---
nameInput.addEventListener("input", () => {
  const query = nameInput.value.toLowerCase();
  suggestions.innerHTML = "";

  if (!query) return;

  const matches = customers.filter(c =>
    c.name.toLowerCase().startsWith(query)
  );

  matches.forEach(c => {
    const item = document.createElement("div");
    item.textContent = c.name;
    item.classList.add("suggestion-item");
    item.addEventListener("click", () => {
      nameInput.value = c.name;
      addressInput.value = c.address;
      emailInput.value = c.email;
      suggestions.innerHTML = "";
    });
    suggestions.appendChild(item);
  });
});

document.addEventListener("click", (e) => {
  if (!suggestions.contains(e.target) && e.target !== nameInput) {
    suggestions.innerHTML = "";
  }
});

// --- Popup ---
function showPopup(message, success = true) {
  popup.textContent = message;
  popup.style.background = success ? "#4caf50" : "#d41010";
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

// --- Form Submit ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const address = addressInput.value.trim();
  const reason = document.getElementById("reason").value.trim();

  if (!name || !email || !address) {
    showPopup("❌ Please fill in all required fields", false);
    return;
  }

  if (!photoData && !reason) {
    showPopup("❌ Provide a photo or a reason", false);
    return;
  }

  const currentTime = new Date().toLocaleString();
  timeOutput.innerText = "Time: " + currentTime;

  const proofData = {
    name,
    email,
    address,
    photoData: photoData || "No photo provided",
    gpsData,
    time: currentTime,
    reason: reason || "Pickup completed"
  };

  console.log("Captured Proof:", proofData);
  showPopup("✅ Proof submitted successfully!");
});
