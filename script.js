const carList = document.getElementById("car-list");
let cars = [];
let currentFilter = "all";
let currentSort = "default";

function getFilteredAndSortedCars() {
  let result = [...cars];

  // フィルター
  if (currentFilter !== "all") {
    result = result.filter(car => car.type === currentFilter);
  }

  // 並び替え
  if (currentSort === "low") {
    result.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (currentSort === "high") {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return result;
}

function renderCars(data) {
  carList.innerHTML = "";

  const groups = {};

  data.forEach(car => {
    if (!groups[car.type]) {
      groups[car.type] = [];
    }
    groups[car.type].push(car);
  });

  for (const type in groups) {
    const group = document.createElement("section");
    group.className = "car-group";

    const title = document.createElement("h2");
    title.className = "type-title";
    title.textContent = type;

    const section = document.createElement("div");
    section.className = "car-list-section";

  groups[type].forEach(car => {
    const image = `date/vehicles_image/${car.name}.jpg`;
    const formattedPrice = Number(car.price).toLocaleString();

    const displayName = car.name
      .replace(/_/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    const card = document.createElement("div");
    card.className = "car-card";

    card.innerHTML = `
      <img src="${image}" alt="${displayName}">
      <p class="car-name">${displayName}</p>
      <p class="car-price">${formattedPrice}円</p>
  `;

  section.appendChild(card);
});

    group.appendChild(title);
    group.appendChild(section);
    carList.appendChild(group);
  }
}

function updateView() {
  const result = getFilteredAndSortedCars();
  renderCars(result);
}

fetch("date/車両date.csv")
  .then(res => res.text())
  .then(data => {
    const rows = data.trim().split("\n").slice(1);

    cars = rows.map(row => {
      const cols = row.split(",");
      return {
        type: cols[0],
        name: cols[1],
        price: cols[2]
      };
    });

    updateView();
  });

// 並び替え
document.getElementById("sort-low").addEventListener("click", () => {
  currentSort = "low";
  updateView();
});

document.getElementById("sort-high").addEventListener("click", () => {
  currentSort = "high";
  updateView();
});

// フィルター
document.querySelectorAll(".filter-buttons button").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filter-buttons button").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    updateView();
  });
});