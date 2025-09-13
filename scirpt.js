const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const gpsOutput = document.getElementById("gps");
const timeOutput = document.getElementById("timestamp");
const sendBtn = document.getElementById("sendBtn");

let photoData = null;
let gpsData = null;

// Show photo preview
photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      photoData = reader.result; // save base64 data
    };
    reader.readAsDataURL(file);
  }
});

// Get GPS + time
navigator.geolocation.getCurrentPosition((pos) => {
  gpsData = {
    lat: pos.coords.latitude,
    lon: pos.coords.longitude
  };
  gpsOutput.innerText = `GPS: ${gpsData.lat.toFixed(6)}, ${gpsData.lon.toFixed(6)}`;
  timeOutput.innerText = "Time: " + new Date().toLocaleString();
});

// For now, just show data when clicked
sendBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  if (!email || !photoData) {
    alert("Please enter email and take a photo!");
    return;
  }

  console.log("Captured Data:", {
    email,
    photoData,
    gpsData,
    time: new Date().toLocaleString()
  });

  alert("Proof captured! (Not sending yet — backend will handle this.)");
});
