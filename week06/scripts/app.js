// app.js — CIDOL Cycle Club
// Demonstrates: multiple functions, DOM selection/modification, event
// listening, conditional branching, objects/arrays/array methods,
// template-literal string building, and localStorage persistence.

/* ---------------------------------------------------------------------
   1. Mobile navigation toggle
--------------------------------------------------------------------- */
function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-main-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", `${isOpen}`);
  });
}

/* ---------------------------------------------------------------------
   2. Trail data + elevation-profile SVG + card rendering
--------------------------------------------------------------------- */
const TRAILS = [
  {
    id: "aso-rock-loop",
    name: "Aso Rock Loop",
    distanceKm: 18,
    elevationM: 210,
    difficulty: "moderate",
    surface: "Paved + gravel shoulder",
    summary: "A rolling ring road around the base of Aso Rock with two short granite climbs and wide views over Maitama.",
    profile: [4, 22, 40, 65, 48, 70, 55, 30, 12],
  },
  {
    id: "jabi-lake-circuit",
    name: "Jabi Lake Circuit",
    distanceKm: 12,
    elevationM: 60,
    difficulty: "easy",
    surface: "Paved lakeside path",
    summary: "Flat, shaded, and social — the club's standard Tuesday recovery spin around Jabi Lake.",
    profile: [10, 14, 12, 18, 15, 20, 16, 12, 8],
  },
  {
    id: "bwari-hills-climb",
    name: "Bwari Hills Climb",
    distanceKm: 27,
    elevationM: 480,
    difficulty: "hard",
    surface: "Cracked tarmac, loose gravel switchbacks",
    summary: "The club's benchmark climb: a sustained ridge ascent into Bwari with a fast, technical descent back.",
    profile: [6, 30, 55, 78, 95, 82, 60, 35, 15],
  },
  {
    id: "gwagwalada-backroads",
    name: "Gwagwalada Backroads",
    distanceKm: 34,
    elevationM: 150,
    difficulty: "moderate",
    surface: "Mixed rural tarmac",
    summary: "Long, open backroads west of the city — best on an eBike with a wide-range battery for the return leg.",
    profile: [8, 16, 22, 18, 26, 20, 24, 14, 6],
  },
  {
    id: "guzape-ridge",
    name: "Guzape Ridge",
    distanceKm: 9,
    elevationM: 140,
    difficulty: "moderate",
    surface: "Paved residential climb",
    summary: "A short, sharp after-work loop through Guzape's ridge streets — popular for interval training.",
    profile: [5, 35, 60, 72, 50, 66, 40, 20, 5],
  },
];

function buildElevationPath(points, width, height) {
  const max = Math.max(...points);
  const stepX = width / (points.length - 1);
  const coords = points.map((point, index) => {
    const x = index * stepX;
    const y = height - (point / max) * (height - 8) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linePath = `M${coords.join(" L")}`;
  const fillPath = `${linePath} L${width},${height} L0,${height} Z`;
  return { linePath, fillPath };
}

function renderTrailCards() {
  const container = document.querySelector("[data-trail-cards]");
  if (!container) return;

  const cardsMarkup = TRAILS.map((trail) => {
    const { linePath, fillPath } = buildElevationPath(trail.profile, 240, 70);
    return `
      <article class="card" id="${trail.id}">
        <span class="difficulty" data-level="${trail.difficulty}">${trail.difficulty}</span>
        <h3>${trail.name}</h3>
        <p class="meta">
          <span>${trail.distanceKm} km</span>
          <span>${trail.elevationM} m gain</span>
          <span>${trail.surface}</span>
        </p>
        <svg class="profile-chart" viewBox="0 0 240 70" role="img" aria-label="Elevation profile for ${trail.name}, peak gain ${trail.elevationM} meters">
          <path class="fill" d="${fillPath}"></path>
          <path class="line" d="${linePath}"></path>
        </svg>
        <p>${trail.summary}</p>
      </article>
    `;
  }).join("");

  container.innerHTML = cardsMarkup;
}

/* ---------------------------------------------------------------------
   3. eBike recommendation data + rendering (icons live inline in HTML;
      this fills in the spec rows from data so copy and specs never drift)
--------------------------------------------------------------------- */
const EBIKES = [
  {
    id: "commuter",
    name: "Commuter Class",
    bestFor: "Jabi Lake Circuit, weekday rides",
    range: "45–60 km",
    motor: "Hub motor, 250W",
    note: "Lightest to carry up an apartment stairwell; the club's most recommended first eBike.",
  },
  {
    id: "trail",
    name: "Trail / Gravel Class",
    bestFor: "Bwari Hills Climb, Aso Rock Loop",
    range: "50–70 km",
    motor: "Mid-drive, 500W+",
    note: "Torque sensor handles Bwari's switchbacks far better than throttle-only hub motors.",
  },
  {
    id: "cargo",
    name: "Long-Range / Cargo Class",
    bestFor: "Gwagwalada Backroads, group support rides",
    range: "80–110 km",
    motor: "Mid-drive, dual battery option",
    note: "Carries repair kit and water for the group on the longest backroad routes.",
  },
];

function renderEbikeSpecs() {
  const container = document.querySelector("[data-ebike-specs]");
  if (!container) return;

  const rows = EBIKES.map((bike) => {
    return `
      <tr>
        <th scope="row">${bike.name}</th>
        <td>${bike.bestFor}</td>
        <td>${bike.range}</td>
        <td>${bike.motor}</td>
        <td>${bike.note}</td>
      </tr>
    `;
  }).join("");

  container.innerHTML = rows;
}

/* ---------------------------------------------------------------------
   4. Next group ride countdown — conditional branching over an array
--------------------------------------------------------------------- */
const UPCOMING_RIDES = [
  { date: "2026-08-02", route: "Jabi Lake Circuit", meet: "Jabi Lake Gate 2, 6:15am" },
  { date: "2026-08-09", route: "Aso Rock Loop", meet: "Sheraton Roundabout, 6:00am" },
  { date: "2026-08-16", route: "Bwari Hills Climb", meet: "Bwari Market Junction, 5:45am" },
  { date: "2026-08-23", route: "Gwagwalada Backroads", meet: "Kubwa Overpass, 5:30am" },
  { date: "2026-08-30", route: "Guzape Ridge", meet: "Guzape District Park, 6:15am" },
];

function findNextRide(rides, referenceDate) {
  const upcoming = rides.filter((ride) => new Date(ride.date) >= referenceDate);
  if (upcoming.length > 0) {
    return upcoming[0];
  }
  // Conditional branch: if every listed ride has already passed, loop the
  // schedule forward by re-using the first entry as "next season".
  return rides[0];
}

function initNextRide() {
  const daysTarget = document.querySelector("[data-ride-days]");
  const detailTarget = document.querySelector("[data-ride-detail]");
  if (!daysTarget || !detailTarget) return;

  const today = new Date();
  const nextRide = findNextRide(UPCOMING_RIDES, today);
  const rideDate = new Date(nextRide.date);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysAway = Math.max(0, Math.round((rideDate - today) / msPerDay));

  daysTarget.textContent = `${daysAway}`;

  const formattedDate = rideDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  detailTarget.innerHTML = `
    <strong>${nextRide.route}</strong> — ${formattedDate}<br>
    Meet at ${nextRide.meet}
  `;
}

/* ---------------------------------------------------------------------
   5. Membership form — validation, localStorage, roster rendering
--------------------------------------------------------------------- */
const MEMBERS_KEY = "cidol-members";

function readMembers() {
  const raw = localStorage.getItem(MEMBERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveMembers(members) {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

function renderRoster() {
  const rosterTarget = document.querySelector("[data-roster]");
  const countTarget = document.querySelector("[data-roster-count]");
  if (!rosterTarget) return;

  const members = readMembers();

  if (countTarget) {
    countTarget.textContent = `${members.length}`;
  }

  if (members.length === 0) {
    rosterTarget.innerHTML = `<li>No members saved on this device yet — the form below adds one.</li>`;
    return;
  }

  const items = members
    .map((member, index) => {
      return `
        <li>
          <span>${member.name} — <em>${member.bikeType}</em></span>
          <button type="button" data-remove-member="${index}">Remove</button>
        </li>
      `;
    })
    .join("");

  rosterTarget.innerHTML = items;
}

function validateField(field, condition, message) {
  const wrapper = field.closest(".field");
  const errorTarget = wrapper ? wrapper.querySelector(".error-msg") : null;

  if (condition) {
    if (wrapper) wrapper.classList.remove("has-error");
    if (errorTarget) errorTarget.textContent = "";
    return true;
  }

  if (wrapper) wrapper.classList.add("has-error");
  if (errorTarget) errorTarget.textContent = message;
  return false;
}

function initMembershipForm() {
  const form = document.querySelector("[data-membership-form]");
  const status = document.querySelector("#form-status");
  if (!form) return;

  renderRoster();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = form.querySelector("#member-name");
    const emailField = form.querySelector("#member-email");
    const bikeField = form.querySelector("#member-bike");
    const experienceChecked = form.querySelector('input[name="member-experience"]:checked');
    const termsField = form.querySelector("#member-terms");

    const namePattern = /^[a-zA-Z\s'-]{2,60}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const nameOk = validateField(nameField, namePattern.test(nameField.value.trim()), "Enter a name using letters only, 2–60 characters.");
    const emailOk = validateField(emailField, emailPattern.test(emailField.value.trim()), "Enter a valid email address.");
    const bikeOk = validateField(bikeField, bikeField.value !== "", "Choose the eBike class that best matches your bike.");
    const termsOk = validateField(termsField, termsField.checked, "You must agree to the ride-safety code to join.");

    const allValid = nameOk && emailOk && bikeOk && termsOk;

    if (!allValid) {
      if (status) {
        status.dataset.state = "error";
        status.textContent = `Please fix the highlighted fields before submitting.`;
      }
      return;
    }

    const members = readMembers();
    const newMember = {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      bikeType: bikeField.options[bikeField.selectedIndex].text,
      experience: experienceChecked ? experienceChecked.value : "New rider",
      joinedOn: new Date().toISOString().slice(0, 10),
    };

    members.push(newMember);
    saveMembers(members);
    renderRoster();
    form.reset();

    if (status) {
      status.dataset.state = "success";
      status.textContent = `Welcome, ${newMember.name}! Your membership request is saved on this device and our director will follow up by email.`;
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches("[data-remove-member]")) return;

    const index = Number(target.getAttribute("data-remove-member"));
    const members = readMembers();
    const remaining = members.filter((_, memberIndex) => memberIndex !== index);
    saveMembers(remaining);
    renderRoster();
  });
}

/* ---------------------------------------------------------------------
   6. Gear checklist — persisted per-item state in localStorage
--------------------------------------------------------------------- */
const GEAR_KEY = "cidol-gear-checklist";
const DEFAULT_GEAR = [
  { id: "helmet", label: "Certified helmet" },
  { id: "lights", label: "Front + rear lights" },
  { id: "charger", label: "Battery charger / power bank" },
  { id: "spares", label: "Spare tube + multitool" },
  { id: "water", label: "2L water minimum" },
  { id: "id", label: "ID + club membership card" },
];

function readGearState() {
  const raw = localStorage.getItem(GEAR_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function saveGearState(state) {
  localStorage.setItem(GEAR_KEY, JSON.stringify(state));
}

function renderGearChecklist() {
  const list = document.querySelector("[data-gear-list]");
  const progress = document.querySelector("[data-gear-progress]");
  if (!list) return;

  const state = readGearState();
  const packedCount = DEFAULT_GEAR.filter((item) => state[item.id]).length;

  if (progress) {
    progress.textContent = `${packedCount} of ${DEFAULT_GEAR.length} packed`;
  }

  const items = DEFAULT_GEAR.map((item) => {
    const packed = Boolean(state[item.id]);
    return `
      <li data-packed="${packed}">
        <input type="checkbox" id="gear-${item.id}" data-gear-id="${item.id}" ${packed ? "checked" : ""}>
        <label for="gear-${item.id}">${item.label}</label>
      </li>
    `;
  }).join("");

  list.innerHTML = items;
}

function initGearChecklist() {
  const list = document.querySelector("[data-gear-list]");
  if (!list) return;

  renderGearChecklist();

  list.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.matches("[data-gear-id]")) return;

    const state = readGearState();
    const gearId = target.getAttribute("data-gear-id");
    state[gearId] = target.checked;
    saveGearState(state);
    renderGearChecklist();
  });
}

/* ---------------------------------------------------------------------
   Boot
--------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  renderTrailCards();
  renderEbikeSpecs();
  initNextRide();
  initMembershipForm();
  initGearChecklist();
});
