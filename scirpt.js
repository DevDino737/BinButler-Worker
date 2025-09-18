// Select elements
const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const gpsOutput = document.getElementById("gps");
const timeOutput = document.getElementById("timestamp");
const sendBtn = document.getElementById("sendBtn");

let photoData = null;
let gpsData = null;

// Handle photo upload
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

// Get GPS location
function updateGPS() {
  if (navigator.geolocation) {
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
  } else {
    gpsOutput.innerText = "GPS not supported";
  }
}
updateGPS();

// Handle send proof
sendBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;

  if (!email || !address || !photoData) {
    alert("Please enter email, address, and take a photo!");
    return;
  }

  const currentTime = new Date().toLocaleString();
  timeOutput.innerText = "Time: " + currentTime;

  // Log captured data (later you can send to Google Sheets or backend)
  console.log("Captured Data:", {
    email,
    address,
    photoData,
    gpsData,
    time: currentTime
  });

  alert("Proof captured with new timestamp!");
});
