// --- Customer Database ---
const customers = {
  "123 Main St": "jacob@example.com",
  "456 Oak Ave": "matthew@example.com",
  "789 Pine Rd": "sara@example.com"
};

// --- Elements ---
const addressInput = document.getElementById("address");
const emailInput = document.getElementById("email");
const addressList = document.getElementById("addressList");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const gpsOutput = document.getElementById("gps");
const timeOutput = document.getElementById("timestamp");
const form = document.getElementById("proofForm");
const popup = document.getElementById("popup");

let photoData = null;
let gpsData = null;

// --- Fill datalist ---
for (const addr in customers) {
  const option = document.createElement("option");
  option.value = addr;
  addressList.appendChild(option);
}

// --- Auto-fill email as you type ---
addressInput.addEventListener("input", () => {
  const enteredAddress = addressInput.value.trim();
  if (customers[enteredAddress]) {
    emailInput.value = customers[enteredAddress];
  } else {
    emailInput.value = "";
  }
});

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

// --- Popup (success/fail) ---
function showPopup(message, success = true) {
  popup.textContent = message;
  popup.style.background = success ? "#4caf50" : "#d41010";
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

// --- Form Submit ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const address = addressInput.value.trim();
  const email = emailInput.value.trim();
  const reason = document.getElementById("reason").value.trim();

  if (!address || !email) {
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
    address,
    email,
    photoData: photoData || "No photo provided",
    gpsData,
    time: currentTime,
    reason: reason || "Pickup completed"
  };

  console.log("Captured Proof:", proofData);
  showPopup("✅ Proof submitted successfully!");
});

