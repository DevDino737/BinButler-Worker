// --- Elements ---
const addressInput = document.getElementById("address");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const gpsOutput = document.getElementById("gps");
const timeOutput = document.getElementById("timestamp");
const submitBtn = document.getElementById("submitBtn");
const popup = document.getElementById("popup");
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyHQb9Hb8OpcySwzevOFj6EhZqZEAAYtwwJaDoXPkJquuWapdwyuRghKvNJMaJjC-X2/exec";

let photoData = null;
let gpsData = null;
let isSubmitting = false;

function setSubmitting(submitting) {
  isSubmitting = submitting;
  submitBtn.disabled = submitting;
  submitBtn.textContent = submitting ? "Saving..." : "Submit Proof";
  submitBtn.classList.toggle("loading", submitting);
}

function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const maxSize = 1200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };

      img.onerror = () => reject(new Error("Could not read photo"));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Could not load photo"));
    reader.readAsDataURL(file);
  });
}

// --- Allow Enter anywhere to act like "submit" ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // stop accidental form reload
    submitBtn.click();  // trigger submit
  }
});

// --- Photo Upload ---
photoInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    showPopup("Preparing photo...");
    photoData = await resizePhoto(file);
    preview.src = photoData;
    showPopup("Photo ready");
  } catch (err) {
    console.error(err);
    photoData = null;
    preview.removeAttribute("src");
    showPopup("Could not load photo", false);
  }
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
  if (isSubmitting) return;

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
    setSubmitting(true);

    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(proofData)
    });

    showPopup("Proof sent to Google Sheet!");
  } catch (err) {
    console.error(err);
    showPopup("Upload failed, try again", false);
  } finally {
    setSubmitting(false);
  }
});
