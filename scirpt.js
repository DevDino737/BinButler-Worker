const customers = {
  "123 Main St": "jacob@example.com",
  "456 Oak Ave": "matthew@example.com",
  "789 Pine Rd": "sara@example.com"
};

const addressInput = document.getElementById("address");
const emailInput = document.getElementById("email");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const gpsDisplay = document.getElementById("gps");
const timeDisplay = document.getElementById("timestamp");
const reasonInput = document.getElementById("reason");
const submitBtn = document.getElementById("submitBtn");
const popup = document.getElementById("popup");

let gpsData = null;

// Autofill email while typing (partial match, case-insensitive)
addressInput.addEventListener("input", () => {
  const entered = addressInput.value.trim().toLowerCase();
  let foundEmail = "";

  if (entered.length > 0) {
    for (const addr in customers) {
      if (addr.toLowerCase().startsWith(entered)) {
        foundEmail = customers[addr];
        break;
      }
    }
  }

  emailInput.value = foundEmail;
});

// Show image preview
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Capture GPS
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    gpsData = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    };
    gpsDisplay.textContent = `GPS: ${gpsData.latitude.toFixed(5)}, ${gpsData.longitude.toFixed(5)}`;
  });
}

// Capture time
function updateTime() {
  const now = new Date();
  timeDisplay.textContent = `Time: ${now.toLocaleString()}`;
}
updateTime();
setInterval(updateTime, 1000);

// Submit form
submitBtn.addEventListener("click", async () => {
  const address = addressInput.value.trim();
  const email = emailInput.value.trim();
  const reason = reasonInput.value.trim();
  const time = new Date().toISOString();

  if (!address || !email) {
    alert("Please enter a valid address and email.");
    return;
  }

  let photoData = null;
  if (photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = async e => {
      photoData = e.target.result;
      await sendData();
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    await sendData();
  }

  async function sendData() {
    const payload = {
      address,
      email,
      reason,
      gpsData,
      time,
      photoData
    };

    try {
      const res = await fetch("YOUR_SCRIPT_WEBAPP_URL_HERE", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (result.success) {
        popup.textContent = "Submitted successfully!";
        popup.classList.add("show");
        setTimeout(() => popup.classList.remove("show"), 3000);
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Network error: " + err);
    }
  }
});
