// Elements
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const gpsOutput = document.getElementById("gps");
const timeOutput = document.getElementById("timestamp");
const form = document.getElementById("proofForm");
const toast = document.getElementById("toast");
const customerSelect = document.getElementById("customer");
const addressInput = document.getElementById("address");
const skipReason = document.getElementById("reason");

let photoData = null;
let gpsData = null;

// --- Handle Photo Upload ---
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

// --- Autofill address from dropdown ---
customerSelect.addEventListener("change", () => {
  const option = customerSelect.options[customerSelect.selectedIndex];
  addressInput.value = option.dataset.address || "";
});

// --- GPS Location ---
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

// --- Show popup ---
function showToast(message, success = true) {
  toast.innerText = message;
  toast.style.background = success ? "#4caf50" : "#d32f2f";
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// --- Handle Form Submit ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = customerSelect.value;
  const address = addressInput.value;
  const reason = skipReason.value.trim();

  if (!email || !address) {
    showToast("⚠️ Please select a customer", false);
    return;
  }

  if (!photoData && !reason) {
    showToast("⚠️ Upload a photo OR add skip reason", false);
    return;
  }

  const currentTime = new Date().toLocaleString();
  timeOutput.innerText = "Time: " + currentTime;

  const proofData = {
    email,
    address,
    photoData: photoData || "No photo provided",
    gpsData,
    time: currentTime,
    reason: reason || "Pickup completed"
  };

  console.log("Captured Data:", proofData);

  showToast("✅ Proof recorded successfully!");
});
