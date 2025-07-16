let properties = [
  {
    id: 1,
    title: "Luxury Hotel",
    images: [
      "https://via.placeholder.com/400x300?text=Hotel+1-1",
      "https://via.placeholder.com/400x300?text=Hotel+1-2",
      "https://via.placeholder.com/400x300?text=Hotel+1-3"
    ],
    model3d: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    position: { lat: 37.7749, lng: -122.4194 },
    price: "$500 / night",
    description: "A luxury hotel with premium services.",
    area: "5000 sqft",
    rates: "10% commission",
    sellerContact: "contact@hotel1.com"
  },
  {
    id: 2,
    title: "Budget Hotel",
    images: [
      "https://via.placeholder.com/400x300?text=Hotel+2-1",
      "https://via.placeholder.com/400x300?text=Hotel+2-2",
      "https://via.placeholder.com/400x300?text=Hotel+2-3"
    ],
    model3d: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    position: { lat: 37.8044, lng: -122.2711 },
    price: "$150 / night",
    description: "A budget-friendly hotel with basic amenities.",
    area: "2000 sqft",
    rates: "5% commission",
    sellerContact: "contact@hotel2.com"
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

// Initialize map after window load
window.onload = initMap;
