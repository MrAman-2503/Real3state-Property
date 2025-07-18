let properties = [
  {
    id: 1,
    title: "Luxury Villa",
    images: [
      "https://www.veeragroup.com/wp-content/uploads/2023/09/veera-eminence-landing.jpg",
      "https://www.veeragroup.com/wp-content/uploads/2022/09/Frame-1-25.jpg",
      "https://www.veeragroup.com/wp-content/uploads/2023/09/Veera-Ojas-Main.jpg"
    ],
    model3d: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    position: { lat: 37.7749, lng: -122.4194 },
    price: "$3,500,000",
    description: "A luxurious villa with stunning views.",
    area: "3500 sqft",
    rates: "7% commission",
    sellerContact: "contact@villa1.com"
  },
  {
    id: 2,
    title: "Modern Villa",
    images: [
      "https://via.placeholder.com/400x300?text=Villa+2-1",
      "https://via.placeholder.com/400x300?text=Villa+2-2",
      "https://via.placeholder.com/400x300?text=Villa+2-3"
    ],
    model3d: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    position: { lat: 37.8044, lng: -122.2711 },
    price: "$2,800,000",
    description: "A modern villa with all amenities.",
    area: "2800 sqft",
    rates: "6% commission",
    sellerContact: "contact@villa2.com"
  }
];

let map;
let markers = [];
let selectedPropertyIndex = 0;
let currentSlideIndex = 0;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: properties[0].position,
    zoom: 12,
  });
  loadMarkers();
  selectProperty(0);
}

function loadMarkers() {
  clearMarkers();
  properties.forEach((property, index) => {
    const marker = new google.maps.Marker({
      position: property.position,
      map: map,
      title: property.title,
    });
    marker.addListener("click", () => {
      selectProperty(index);
    });
    markers.push(marker);
  });
}

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

function selectProperty(index) {
  selectedPropertyIndex = index;
  const property = properties[index];
  map.panTo(property.position);
  map.setZoom(15);
  updatePropertyDetails(property);
  loadImageSlider(property.images);
  load3DModel(property.model3d);
  currentSlideIndex = 0;
  updateSliderPosition();
}

function updatePropertyDetails(property) {
  document.getElementById("property-title").textContent = property.title;
  document.getElementById("property-description").textContent = property.description;
  document.getElementById("property-price").textContent = property.price;
  document.getElementById("property-area").textContent = "Area: " + property.area;
  document.getElementById("property-rates").textContent = "Rates: " + property.rates;
  const sellerContactElem = document.getElementById("seller-contact");
  sellerContactElem.textContent = property.sellerContact;
  sellerContactElem.onclick = () => {
    alert("Contacting seller at: " + property.sellerContact);
  };
}

function loadImageSlider(images) {
  const sliderImages = document.getElementById("slider-images");
  sliderImages.innerHTML = "";
  images.forEach((src) => {
    const anchor = document.createElement("a");
    anchor.href = src;
    anchor.target = "_blank";
    anchor.className = "w-full flex-shrink-0 block rounded overflow-hidden";

    const img = document.createElement("img");
    img.src = src;
    img.className = "w-full object-cover rounded";
    anchor.appendChild(img);

    sliderImages.appendChild(anchor);
  });
  // Clear 3D model viewer when loading new images
  const modelViewerContainer = document.getElementById("model-viewer-container");
  modelViewerContainer.innerHTML = "";
}

function updateSliderPosition() {
  const sliderImages = document.getElementById("slider-images");
  sliderImages.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
}

// Load 3D model for selected property
function load3DModel(modelUrl) {
  const modelViewerContainer = document.getElementById("model-viewer-container");
  modelViewerContainer.innerHTML = "";
  if (!modelUrl) {
    modelViewerContainer.textContent = "3D model not available.";
    return;
  }
  const modelViewer = document.createElement("model-viewer");
  modelViewer.setAttribute("src", modelUrl);
  modelViewer.setAttribute("alt", "3D model of property");
  modelViewer.setAttribute("auto-rotate", "");
  modelViewer.setAttribute("camera-controls", "");
  modelViewer.setAttribute("style", "width: 100%; height: 100%;");
  modelViewerContainer.appendChild(modelViewer);
}

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    updateSliderPosition();
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  const imagesCount = properties[selectedPropertyIndex].images.length;
  if (currentSlideIndex < imagesCount - 1) {
    currentSlideIndex++;
    updateSliderPosition();
  }
});

// Inquiry modal handling
const inquiryModal = document.getElementById("inquiry-modal");
const contactSellerBtn = document.getElementById("contact-seller-btn");
const closeInquiryModalBtn = document.getElementById("close-inquiry-modal");
const inquiryForm = document.getElementById("inquiry-form");
const inquirySuccess = document.getElementById("inquiry-success");

contactSellerBtn.addEventListener("click", () => {
  inquiryModal.classList.remove("hidden");
  inquiryModal.classList.add("opacity-0");
  setTimeout(() => {
    inquiryModal.classList.remove("opacity-0");
    inquiryModal.classList.add("opacity-100");
  }, 10);
});

closeInquiryModalBtn.addEventListener("click", () => {
  inquiryModal.classList.add("opacity-0");
  setTimeout(() => {
    inquiryModal.classList.add("hidden");
    inquirySuccess.classList.add("hidden");
    inquiryForm.classList.remove("hidden");
    inquiryForm.reset();
    inquiryModal.classList.remove("opacity-100");
  }, 300);
});

inquiryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = inquiryForm.name.value.trim();
  const email = inquiryForm.email.value.trim();
  const message = inquiryForm.message.value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/submit-inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      inquiryForm.classList.add("hidden");
      inquirySuccess.classList.remove("hidden");
      localStorage.setItem("inquirySubmitted", "true");
    } else {
      alert("Failed to submit inquiry. Please try again later.");
    }
  } catch (error) {
    alert("Error submitting inquiry. Please try again later.");
  }
});

// Check if inquiry was already submitted and hide form if so
window.addEventListener("load", () => {
  if (localStorage.getItem("inquirySubmitted") === "true") {
    inquiryForm.classList.add("hidden");
    inquirySuccess.classList.remove("hidden");
  }
});

// Initialize map after window load
window.onload = initMap;
