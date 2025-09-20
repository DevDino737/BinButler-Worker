// Select elements
const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const gpsOutput = document.getElementById("gps");
const timeOutput = document.getElementById("timestamp");
const sendBtn = document.getElementById("sendBtn");
const skipReason = document.getElementById("skipReason");

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

// --- Send Proof ---
sendBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const reason = skipReason.value.trim();

  // Validate inputs
  if (!email || !address) {
    alert("Please enter both email and address.");
    return;
  }

  if (!photoData && !reason) {
    alert("Please upload a photo OR explain why pickup was skipped.");
    return;
  }

  // Create timestamp
  const currentTime = new Date().toLocaleString();
  timeOutput.innerText = "Time: " + currentTime;

  // Collect data
  const proofData = {
    email,
    address,
    photoData: photoData || "No photo provided",
    gpsData,
    time: currentTime,
    reason: reason || "Pickup completed"
  };

  console.log("Captured Data:", proofData);

  alert("Proof recorded successfully!");
});
