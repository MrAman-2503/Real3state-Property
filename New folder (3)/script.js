let properties = [
  {
    id: 1,
    title: "Modern Apartment",
    images: [
      "https://via.placeholder.com/400x300?text=Apartment+1-1",
      "https://via.placeholder.com/400x300?text=Apartment+1-2",
      "https://via.placeholder.com/400x300?text=Apartment+1-3"
    ],
    model3d: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    position: { lat: 37.7749, lng: -122.4194 },
    price: "$1,200,000",
    description: "A beautiful modern apartment in San Francisco.",
    area: "1200 sqft",
    rates: "5% commission",
    sellerContact: "contact@apartment1.com"
  },
  {
    id: 2,
    title: "Cozy Cottage",
    images: [
      "https://via.placeholder.com/400x300?text=Cottage+2-1",
      "https://via.placeholder.com/400x300?text=Cottage+2-2",
      "https://via.placeholder.com/400x300?text=Cottage+2-3"
    ],
    model3d: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    position: { lat: 37.8044, lng: -122.2711 },
    price: "$850,000",
    description: "A cozy cottage in Oakland.",
    area: "900 sqft",
    rates: "4% commission",
    sellerContact: "contact@cottage2.com"
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
    const img = document.createElement("img");
    img.src = src;
    img.className = "w-full flex-shrink-0 object-cover rounded";
    sliderImages.appendChild(img);
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

// AI Assistant code
const aiChat = document.getElementById("ai-chat");
const aiInput = document.getElementById("ai-input");

aiInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && aiInput.value.trim() !== "") {
    const userMessage = aiInput.value.trim();
    appendMessage("You", userMessage);
    aiInput.value = "";
    generateAIResponse(userMessage);
  }
});

function appendMessage(sender, message) {
  const messageElem = document.createElement("div");
  messageElem.className = sender === "You" ? "text-right text-blue-600" : "text-left text-gray-800";
  messageElem.textContent = `${sender}: ${message}`;
  aiChat.appendChild(messageElem);
  aiChat.scrollTop = aiChat.scrollHeight;
}

function generateAIResponse(message) {
  let response = "Sorry, I didn't understand that. Please ask about properties.";
  if (message.toLowerCase().includes("price")) {
    response = "Prices vary depending on location and property type. Please select a property to see details.";
  } else if (message.toLowerCase().includes("location")) {
    response = "We have properties in San Francisco and Oakland.";
  } else if (message.toLowerCase().includes("help")) {
    response = "You can ask about property prices, locations, or request recommendations.";
  }
  setTimeout(() => {
    appendMessage("AI", response);
  }, 1000);
}

// Simulate real-time updates by adding a new property every 30 seconds
setInterval(() => {
  const newPropertyId = properties.length + 1;
  const newProperty = {
    id: newPropertyId,
    title: `New Property ${newPropertyId}`,
    images: [
      `https://via.placeholder.com/400x300?text=New+Property+${newPropertyId}-1`,
      `https://via.placeholder.com/400x300?text=New+Property+${newPropertyId}-2`
    ],
    position: {
      lat: 37.75 + Math.random() * 0.1,
      lng: -122.45 + Math.random() * 0.1,
    },
    price: `$${(800 + Math.floor(Math.random() * 500))},000`,
    description: "A newly listed property.",
    area: "1000 sqft",
    rates: "5% commission",
    sellerContact: "contact@newproperty.com"
  };
  properties.push(newProperty);
  loadMarkers();
  selectProperty(properties.length - 1);
  appendMessage("AI", `New property listed: ${newProperty.title} at ${newProperty.price}`);
}, 30000);

const menuBtn = document.getElementById("menu-btn");
const slidingMenu = document.getElementById("sliding-menu");
const closeMenuBtn = document.getElementById("close-menu-btn");

menuBtn.addEventListener("click", () => {
  // Add scale animation class
  menuBtn.classList.add("menu-scale-animate");
  // Remove the class after animation ends to allow re-trigger
  menuBtn.addEventListener("animationend", () => {
    menuBtn.classList.remove("menu-scale-animate");
  }, { once: true });

  // Show sliding menu
  slidingMenu.classList.remove("-translate-x-full");
});

closeMenuBtn.addEventListener("click", () => {
  slidingMenu.classList.add("-translate-x-full");
});

// Initialize map after window load
window.onload = initMap;
