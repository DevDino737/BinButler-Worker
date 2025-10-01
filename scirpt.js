// --- Customer Database ---
const customers = {
  "123 Main St": "jacob@example.com",
  "456 Oak Ave": "matthew@example.com",
  "789 Pine Rd": "sara@example.com"
};

// --- Elements ---
const addressInput = document.getElementById("address");
const emailInput = document.getElementById("email");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const gpsOutput = document.getElementById("gps");
const timeOutput = document.getElementById("timestamp");
const form = document.getElementById("proofForm");
const popup = document.getElementById("popup");

let photoData = null;
let gpsData = null;

// --- Fill email when address matches ---
addressInput.addEventListener("input", () => {
  const entered = addressInput.value.trim();
  if (customers[entered]) {
    emailInput.value = customers[entered];
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
    gpsOutput.innerText = "GPS not supported";
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

// --- Popup ---
function showPopup(message, success = true) {
  popup.textContent = message;
  popup.style.background = success ? "#4caf50" : "#d41010";
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

// --- Submit Form ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const address = addressInput.value.trim();
  const email = emailInput.value.trim();
  const reason = document.getElementById("reason").value.trim();
  const currentTime = new Date().toLocaleString();
  timeOutput.innerText = "Time: " + currentTime;

  if (!address || !email) {
    showPopup("❌ Address or email missing", false);
    return;
  }
  if (!photoData && !reason) {
    showPopup("❌ Provide a photo or a reason", false);
    return;
  }

  const proofData = {
    address,
    email,
    photoData,
    gpsData,
    time: currentTime,
    reason: reason || "Pickup completed"
  };

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwDfnbxctuWcIa75PPgof_IwdWnuB7c_OPCrGPeBRokTbwoRObe8LVCjkrWVlipM87l/exec", {
      method: "POST",
      body: JSON.stringify(proofData)
    });
    const result = await res.json();

    if (result.success) {
      showPopup("✅ Proof sent successfully!");
      // Reset photo & reason
      photoInput.value = "";
      preview.src = "";
      document.getElementById("reason").value = "";
      photoData = null;
    } else {
      showPopup("❌ Error sending proof", false);
    }
  } catch (err) {
    console.error(err);
    showPopup("❌ Network error", false);
  }
});

