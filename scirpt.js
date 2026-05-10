// --- Elements ---
const addressInput = document.getElementById("address");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const gpsOutput = document.getElementById("gps");
const timeOutput = document.getElementById("timestamp");
const submitBtn = document.getElementById("submitBtn");
const popup = document.getElementById("popup");

let photoData = null;
let gpsData = null;

// --- Allow Enter anywhere to act like "submit" ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // stop accidental form reload
    submitBtn.click();  // trigger submit
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

// --- Submit Proof ---
submitBtn.addEventListener("click", async () => {
  const address = addressInput.value.trim();
  const reason = document.getElementById("reason").value.trim();
  const currentTime = new Date().toLocaleString();
  timeOutput.innerText = "Time: " + currentTime;

  if (!address) {
    showPopup("Address missing", false);
    return;
  }
  if (!photoData && !reason) {
    showPopup("Provide a photo or the reason", false);
    return;
  }

  const proofData = {
    address,
    photoData,
    gpsData,
    time: currentTime,
    reason: reason || "Pickup completed"
  };

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbyHQb9Hb8OpcySwzevOFj6EhZqZEAAYtwwJaDoXPkJquuWapdwyuRghKvNJMaJjC-X2/exec", {
      method: "POST",
      body: JSON.stringify(proofData)
    });

    const result = await res.json();

    if (result.success) {
      showPopup("Proof saved to Google Sheet!");
    } else {
      showPopup("Error saving proof", false);
    }
  } catch (err) {
    console.error(err);
    showPopup("Network error, try again", false);
  }
});
