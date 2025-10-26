<script setup>
  import { ref, onMounted, onBeforeUnmount, computed } from "vue";
  import { RouterLink } from "vue-router";
  import { useExperiences } from "@/composables/useExperiences.js";
  import { useServices, useServicesTraining } from "@/composables/useServices.js";
  import "@/styles/navbar.css";

  // ✅ Define props for reusability
  const props = defineProps({
  title: { type: String, default: "NEW" },
  date: { type: String, default: "Add date" },
  be_host: { type: String, default: "Become a host" },
});

  // ✅ Composables
  const { title: experienceTitle } = useExperiences();
  const { services, titles } = useServices();
  const { servicesTraining, titlesTraining } = useServicesTraining();

  // ✅ Dropdown state
  const dropdownActive = ref(false);
  const toggleDropdown = () => (dropdownActive.value = !dropdownActive.value);

  // ✅ Language/Currency popup
  const popupVisible = ref(false);
  const activeTab = ref("language");

  const openPopup = (tab = "language") => {
  activeTab.value = tab;
  popupVisible.value = true;
};
  const closePopup = () => (popupVisible.value = false);

  // ✅ WHERE popup
  const popupWhere = ref(false);
  const whereTab = ref("where");
  const selectedDestination = ref("Where");

  const openWhere = () => {
  popupWhere.value = true;
  whereTab.value = "where";
};
  const closeWhere = () => (popupWhere.value = false);
  const selectDestination = (city) => {
  selectedDestination.value = city;
  closeWhere();
};

  // ✅ DATE popup
  const popupDate = ref(false);
  const dateTab = ref("date");

  const openDate = () => {
  popupDate.value = true;
  dateTab.value = "date";
};

  //registation popup
  const showPopup = ref(false);
  const activeTAB = ref("phone"); // default tab

  const closeDate = () => (popupDate.value = false);

  const selectedDates = ref([]); // store up to 2 selected dates

  function selectDay(monthName, day) {
    const year = 2025;
    const fullDate = new Date(`${monthName} ${day}, ${year}`);

    // if no date or only one selected, add it
    if (selectedDates.value.length < 2) {
      // prevent duplicate selection of same day
      const alreadySelected = selectedDates.value.some(
          d => d.month === monthName && d.day === day
      );
      if (!alreadySelected) {
        selectedDates.value.push({ month: monthName, day, fullDate });
      }
    } else {
      // if two already selected → reset and start over
      selectedDates.value = [{ month: monthName, day, fullDate }];
    }

    // sort by chronological order
    selectedDates.value.sort((a, b) => a.fullDate - b.fullDate);
  }

  function isSelected(monthName, day) {
    return selectedDates.value.some(
        d => d.month === monthName && d.day === day
    );
  }

  function isInRange(monthName, day) {
    if (selectedDates.value.length < 2) return false;
    const year = 2025;
    const current = new Date(`${monthName} ${day}, ${year}`);
    const [start, end] = selectedDates.value;
    return current > start.fullDate && current < end.fullDate;
  }



  // ✅ Helper functions for calendar
  function getDaysInMonth(monthName) {
  const year = 2025;
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

  function getEmptyDays(monthName) {
  const year = 2025;
  const firstDay = new Date(`${monthName} 1, ${year}`).getDay();
  return Array.from({ length: firstDay });
}

  function changeDate(days) {
    const year = 2025;

    if (selectedDates.value.length === 0) {
      console.log("No date selected yet.");
      return;
    }

    // If only one date selected → add new one offset by +days
    if (selectedDates.value.length === 1) {
      const first = selectedDates.value[0];
      const firstDate = new Date(`${first.month} ${first.day}, ${year}`);
      const newDate = new Date(firstDate);
      newDate.setDate(firstDate.getDate() + days);

      const monthName = newDate.toLocaleString("default", { month: "long" });
      const day = newDate.getDate();

      selectedDates.value.push({ month: monthName, day, fullDate: newDate });
      selectedDates.value.sort((a, b) => a.fullDate - b.fullDate);
      return;
    }

    // If two dates selected → shift both by ±days
    selectedDates.value = selectedDates.value.map(d => {
      const newDate = new Date(d.fullDate);
      newDate.setDate(newDate.getDate() + days);
      const monthName = newDate.toLocaleString("default", { month: "long" });
      const day = newDate.getDate();
      return { month: monthName, day, fullDate: newDate };
    });

    selectedDates.value.sort((a, b) => a.fullDate - b.fullDate);
  }

  // ✅ GUEST popup
  const popupGuests = ref(false);
  const openGuests = () => (popupGuests.value = true);
  const closeGuests = () => (popupGuests.value = false);

  const guests = ref([
  { label: "Adults", sub: "Ages 13 or above", count: 0 },
  { label: "Children", sub: "Ages 2 – 12", count: 0 },
  { label: "Infants", sub: "Under 2", count: 0 },
  { label: "Pets", sub: "", count: 0 },
  ]);

  const increment = (i) => guests.value[i].count++;
  const decrement = (i) => {
  if (guests.value[i].count > 0) guests.value[i].count--;
};

  const totalGuests = computed(() =>
  guests.value.reduce((sum, g) => sum + g.count, 0)
  );

  // ✅ Currency list
  const currencies = [
    { name: "Australian Dollar", code: "AUD", symbol: "$" },
    { name: "Euro", code: "EUR", symbol: "€" },
    { name: "US Dollar", code: "USD", symbol: "$" },
    { name: "British Pound", code: "GBP", symbol: "£" },
    { name: "Japanese Yen", code: "JPY", symbol: "¥" },
    { name: "Swiss Franc", code: "CHF", symbol: "Fr." },
    { name: "Polish Zloty", code: "PLN", symbol: "zł" },
    { name: "Czech Koruna", code: "CZK", symbol: "Kč" },
    { name: "Hungarian Forint", code: "HUF", symbol: "Ft" },
    { name: "Canadian Dollar", code: "CAD", symbol: "CA$" },
    { name: "New Zealand Dollar", code: "NZD", symbol: "$" },
    { name: "Singapore Dollar", code: "SGD", symbol: "$" },
    { name: "Hong Kong Dollar", code: "HKD", symbol: "$" },
    { name: "Norwegian Krone", code: "NOK", symbol: "kr" },
    { name: "Swedish Krona", code: "SEK", symbol: "kr" },
    { name: "Danish Krone", code: "DKK", symbol: "kr" },
    { name: "Chinese Yuan", code: "CNY", symbol: "¥" },
    { name: "South Korean Won", code: "KRW", symbol: "₩" },
    { name: "Indian Rupee", code: "INR", symbol: "₹" },
    { name: "Brazilian Real", code: "BRL", symbol: "R$" },
    { name: "Mexican Peso", code: "MXN", symbol: "$" },
    { name: "Turkish Lira", code: "TRY", symbol: "₺" },
    { name: "Thai Baht", code: "THB", symbol: "฿" },
    { name: "Israeli Shekel", code: "ILS", symbol: "₪" },
    { name: "South African Rand", code: "ZAR", symbol: "R" },
    { name: "Indonesian Rupiah", code: "IDR", symbol: "Rp" },
    { name: "Malaysian Ringgit", code: "MYR", symbol: "RM" },
    { name: "Philippine Peso", code: "PHP", symbol: "₱" },
    { name: "Vietnamese Dong", code: "VND", symbol: "₫" },
    { name: "UAE Dirham", code: "AED", symbol: "د.إ" },
    { name: "Saudi Riyal", code: "SAR", symbol: "﷼" },
    { name: "Egyptian Pound", code: "EGP", symbol: "£" },
    { name: "Argentine Peso", code: "ARS", symbol: "$" },
    { name: "Chilean Peso", code: "CLP", symbol: "$" },
    { name: "Colombian Peso", code: "COP", symbol: "$" },
    { name: "Icelandic Krona", code: "ISK", symbol: "kr" },
    { name: "Romanian Leu", code: "RON", symbol: "lei" },
    { name: "Bulgarian Lev", code: "BGN", symbol: "лв" },
    { name: "Croatian Kuna", code: "HRK", symbol: "kn" },
    { name: "Serbian Dinar", code: "RSD", symbol: "дин" },
  ];


  // ✅ Handle dropdown clicks outside
  const handleClickOutside = (event) => {
  const dropdown = document.getElementById("dropdown-menu");
  const menuBtn = document.getElementById("menu-btn");
  if (dropdown && menuBtn && !dropdown.contains(event.target) && !menuBtn.contains(event.target)) {
  dropdownActive.value = false;
}
};

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });
  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  // ✅ Reactive state for popup visibility
  const showLogin = ref(false)

  // ✅ Close popup
  function closeLoginPopup() {
    showLogin.value = false
  }

  // ✅ Handle continue button
  function handleContinue() {
    alert('Continue clicked (demo)')
    closeLoginPopup()
  }




  // Host popup
  const showHost = ref(false)

  function closeHostPopup (){
    showHost.value = false;
  }

  function handleContinueHost(){
    alert('Continue clicked (demo)')
    closeHostPopup()
  }




</script>

<template>
  <!-- === NAVBAR === -->
  <header class="navbar">
    <div class="navbar-left">
      <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"
          alt="Airbnb"
          class="logo"
      />
    </div>

    <nav class="navbar-center">
      <RouterLink to="/apartment" class="active">🏠 Apartment</RouterLink>
      <RouterLink :to="{ name: 'Experience' }" class="experience-link">
        🎈 Experience
      </RouterLink>
      <RouterLink to="/services">
        🛎️ Services <span class="badge">{{ props.title }}</span>
      </RouterLink>
    </nav>

    <div class="navbar-right">
      <button class="icon-btn" @click="openPopup('language')">🌐</button>
      <button class="icon-btn" @click="openPopup('currency')">💰</button>
      <button class="icon-btn" id="menu-btn" @click="toggleDropdown">☰</button>
    </div>
  </header>

  <div class="search-container">
    <div class="search-bar">
      <!-- WHERE -->
      <div class="search-item hoverable" @click="openWhere">
        <span class="label">Where</span>
        <span class="placeholder">
          {{ selectedDestination !== 'Where' ? selectedDestination : 'Search destinations' }}
        </span>
      </div>

      <div class="divider"></div>

      <!-- WHEN -->
      <div class="search-item hoverable" @click="openDate">
        <span class="label">When</span>
        <span class="placeholder">
          {{ props.date || 'Add dates' }}
        </span>
      </div>

      <div class="divider"></div>

      <!-- WHO -->
      <div class="search-item hoverable" @click="openGuests">
        <span class="label">Who</span>
        <span class="placeholder">
          {{ totalGuests > 0 ? totalGuests + ' guests' : 'Add guests' }}
        </span>
      </div>

      <button class="search-btn" aria-label="Search">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

    </div>
  </div>


  <!-- === DROPDOWN === -->
  <div class="dropdown" id="dropdown-menu" :class="{ active: dropdownActive }">
    <RouterLink to="#" class="dropdown-item"><strong>Help Center</strong></RouterLink>
    <div class="divider"></div>
    <RouterLink to="#" class="dropdown-item" @click.prevent="showHost = true">
      <strong>{{ props.be_host }}</strong>
      <span>It's easy to start hosting and earn extra income.</span>
    </RouterLink>
    <div class="divider"></div>
    <RouterLink to="#" class="dropdown-item">Refer a Host</RouterLink>
    <RouterLink to="#" class="dropdown-item" >Find a co-host</RouterLink>
    <div class="divider"></div>
    <RouterLink to="#" class="dropdown-item" @click.prevent="showLogin = true"
    >
      Log in or sign up
    </RouterLink>
  </div>


  <!--HOST POPUP -->
  <div v-if="showHost" class="host-overlay">
    <div class="host-popup">
      <button class="host-close-btn" @click="closeHostPopup">&times;</button>
      <h2 class="host-popup-title">What would you like to host?</h2>

      <div class="host-options">
        <div class="host-card">
          <img src="https://img.icons8.com/emoji/96/house-emoji.png" alt="Home">
          <p>Home</p>
        </div>
        <div class="host-card">
          <img src="https://img.icons8.com/emoji/96/hot-air-balloon.png" alt="Experience">
          <p>Experience</p>
        </div>
        <div class="host-card">
          <img src="https://img.icons8.com/emoji/96/bellhop-bell.png" alt="Service">
          <p>Service</p>
        </div>
      </div>

      <button class="host-next-btn" @click="handleContinueHost">Next</button>
    </div>
  </div>



  <!---LOG IN POPUP -->
  <div
      v-if="showLogin"
      id="login-overlay"
      class="overlay"
      aria-hidden="false"
      role="dialog"
      aria-modal="true"
      @click.self="closeLoginPopup"
  >
    <div class="popup" role="document" aria-labelledby="popup-title">
      <!-- Close button -->
      <button
          class="close-btn"
          id="close-login"
          aria-label="Close popup"
          @click="closeLoginPopup"
      >
        ✕
      </button>

      <!-- Tabs -->
      <div class="tabs" role="tablist" style="margin-top:8px;">
        <button class="active" role="tab" aria-selected="true">Log in</button>
      </div>

      <!-- Main grid -->
      <div class="login-grid" style="margin-top:8px;">
        <!-- left column -->
        <div class="login-left">
          <h2 id="popup-title">Welcome to Brand</h2>

          <label class="label" for="country">Country code</label>
          <select id="country" class="select country-select" aria-label="Country code">
            <option value="+421">Slovakia (+421)</option>
            <option value="+1">United States (+1)</option>
            <option value="+44">United Kingdom (+44)</option>
          </select>

          <label class="label" for="phone">Phone number</label>
          <input
              id="phone"
              class="phone-input"
              type="tel"
              placeholder="Phone number"
              aria-label="Phone"
          />

          <p style="color:var(--muted); font-size:13px; margin-bottom:12px;">
            We’ll call or text you to confirm your number. Standard message and data rates apply.
            <a href="#" style="color:var(--accent)">Privacy Policy</a>
          </p>

          <button
              class="continue-btn"
              id="continue-login"
              @click="handleContinue"
          >
            Continue
          </button>

          <div class="or-row" aria-hidden="true" style="margin-top:18px;">or</div>

          <div>
            <button class="social-btn" aria-label="Continue with Google">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M21 12.2c0-.68-.06-1.32-.18-1.95H12v3.7h5.6c-.24 1.3-.97 2.42-2.06 3.16v2.6h3.34C19.67 18.2 21 15.5 21 12.2z"
                    fill="#4285F4"
                />
              </svg>
              Continue with Google
            </button>

            <button class="social-btn" aria-label="Continue with Apple">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M16 1.2c0 .9-.3 1.9-.8 2.7-.4.6-1 1.3-1.7 1.3-.1 0-.2-.1-.3-.2-.9-.8-1.9-1.1-3.1-.9-1.2.2-2.5.9-3.3 1.9-.9 1.1-1.2 2.5-1.1 3.8.1 1.3.5 2.6 1.2 3.6.6.9 1.6 1.8 2.6 1.8.6 0 1.2-.2 1.8-.6.6-.3 1.1-.8 1.6-1.4.2-.2.5-.3.8-.2.5.1 1 .5 1.1 1.1.2.9.6 1.7 1.2 2.4 1 .9 2.3.8 3.3.1.1-.1.2-.2.3-.3-1.6-1.3-2.8-3.5-3-6-.1-1.1.1-2.1.6-3 .8-1.6 2.6-1.6 3.8-1.1-.4-.6-1-1-1.6-1.4-.8-.5-1.6-.9-2.6-1-.4-.1-.9 0-1.3.1z"
                    fill="#fff"
                />
              </svg>
              Continue with Apple
            </button>

            <button class="social-btn" aria-label="Continue with email">Continue with email</button>
            <button class="social-btn" aria-label="Continue with Facebook">Continue with Facebook</button>
          </div>
        </div>

        </div>
    </div>
  </div>




  <div class="where_overlay" v-show="popupWhere" @click.self="closeWhere">
    <div class="wherePopup">
      <div class="whereTab">Suggested destinations</div>

      <div v-if="whereTab === 'where'" class="where-grid">
        <!-- Nearby -->
        <div class="where-item" @click="selectDestination('Nearby')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#4A90E2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 5a5 5 0 1 1-5 5 5 5 0 0 1 5-5Zm0 2a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z"/>
          </svg>
          <div>Nearby<br><small>Find what's around you</small></div>
        </div>

        <!-- Prague -->
        <div class="where-item" @click="selectDestination('Prague, Czechia')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#FF6F61">
            <path d="M3 21V9l9-7 9 7v12H3Zm9-14-5 4v9h10v-9l-5-4Z"/>
          </svg>
          <div>Prague, Czechia<br><small>For sights like Prague Castle</small></div>
        </div>

        <!-- Budapest -->
        <div class="where-item" @click="selectDestination('Budapest, Hungary')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#00A86B">
            <path d="M4 21V9l8-5 8 5v12H4Zm8-14-5 3v10h10V10l-5-3Z"/>
          </svg>
          <div>Budapest, Hungary<br><small>For its bustling nightlife</small></div>
        </div>

        <!-- Bratislava -->
        <div class="where-item" @click="selectDestination('Bratislava, Slovakia')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#8D6E63">
            <path d="M3 21v-8h18v8H3Zm2-6v4h14v-4H5Z"/>
          </svg>
          <div>Bratislava, Slovakia<br><small>Near you</small></div>
        </div>

        <!-- Vienna -->
        <div class="where-item" @click="selectDestination('Vienna, Austria')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#FF4081">
            <path d="M12 2 4 7v15h16V7l-8-5Zm0 3 5 3v11H7V8l5-3Z"/>
          </svg>
          <div>Vienna, Austria<br><small>For its stunning architecture</small></div>
        </div>

        <!-- Brno -->
        <div class="where-item" @click="selectDestination('Brno, Czechia')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#A0522D">
            <path d="M2 22V9l10-6 10 6v13H2Zm10-14-6 3.5V20h12v-8.5L12 8Z"/>
          </svg>
          <div>Brno, Czechia<br><small>For sights like Špilberk Castle</small></div>
        </div>

        <!-- Košice -->
        <div class="where-item" @click="selectDestination('Košice, Slovakia')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#9C27B0">
            <path d="M12 4 2 20h20L12 4Zm0 4.5 6.93 11.5H5.07L12 8.5Z"/>
          </svg>
          <div>Košice, Slovakia<br><small>For a trip abroad</small></div>
        </div>

        <!-- Barcelona -->
        <div class="where-item" @click="selectDestination('Barcelona, Spain')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#FFC107">
            <path d="M2 20h20v-2H2v2Zm0-4h20v-2H2v2Zm2-4h16l-8-6-8 6Z"/>
          </svg>
          <div>Barcelona, Spain<br><small>Popular beach destination</small></div>
        </div>

        <!-- Paris -->
        <div class="where-item" @click="selectDestination('Paris, France')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#E91E63">
            <path d="M12 2 6 22h2l1.5-5h5L16 22h2L12 2Zm0 6 1.8 6h-3.6L12 8Z"/>
          </svg>
          <div>Paris, France<br><small>For its top-notch dining</small></div>
        </div>

        <!-- London -->
        <div class="where-item" @click="selectDestination('London, United Kingdom')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#9E9E9E">
            <path d="M10 2h4v4h-4V2Zm-3 6v14h10V8H7Zm2 2h6v10H9V10Z"/>
          </svg>
          <div>London, United Kingdom<br><small>For sights like Buckingham Palace</small></div>
        </div>

        <!-- Milan -->
        <div class="where-item" @click="selectDestination('Milan, Italy')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#4CAF50">
            <path d="M4 22V8l8-6 8 6v14H4Zm8-14-5 3v9h10v-9l-5-3Z"/>
          </svg>
          <div>Milan, Italy<br><small>For its bustling nightlife</small></div>
        </div>

        <!-- Brussels -->
        <div class="where-item" @click="selectDestination('Brussels, Belgium')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#8B5E3C">
            <path d="M2 20V9l10-7 10 7v11H2Zm10-13-6 4v8h12v-8l-6-4Z"/>
          </svg>
          <div>Brussels, Belgium<br><small>For sights like Atomium</small></div>
        </div>

        <!-- Berlin -->
        <div class="where-item" @click="selectDestination('Berlin, Germany')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#757575">
            <path d="M3 22V8l9-6 9 6v14H3Zm9-10-4 2.5V20h8v-5.5L12 12Z"/>
          </svg>
          <div>Berlin, Germany<br><small>For a trip abroad</small></div>
        </div>

        <!-- Athens -->
        <div class="where-item" @click="selectDestination('Athens, Greece')">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#03A9F4">
            <path d="M2 21h20v-2H2v2Zm1-4h18v-2H3v2Zm2-4h14v-2H5v2Zm2-4h10V7H7v2Zm2-4h6V5H9V5Z"/>
          </svg>
          <div>Athens, Greece<br><small>For sights like Acropolis of Athens</small></div>
        </div>
      </div>
    </div>
  </div>


  <!-- === DATE PICKER POPUP === -->
  <div class="date_overlay" v-show="popupDate" @click.self="closeDate">
    <div class="date-picker-popup">
      <!---
      <div class="date-picker-header">
        <button class="tab" :class="{active: dateTab === 'date'}" @click="dateTab = 'date'">Dates</button>
        <button class="tab" :class="{active: dateTab === 'months'}" @click="dateTab = 'months'">Months</button>
        <button class="tab" :class="{active: dateTab === 'flexible'}" @click="dateTab = 'flexible'">Flexible</button>
      </div>
      -->
      <div v-show="dateTab === 'date'" class="calendar">
        <div class="months-container">
          <!-- October -->
          <div class="month">
            <h3>October 2025</h3>
            <div class="days">
              <div class="day-label">S</div><div class="day-label">M</div><div class="day-label">T</div>
              <div class="day-label">W</div><div class="day-label">T</div><div class="day-label">F</div><div class="day-label">S</div>

              <div
                  v-for="day in getDaysInMonth('October')"
                  :key="'oct-' + day"
                  :class="['day', { selected: isSelected('October', day), range: isInRange('October', day) }]"
                  @click="selectDay('October', day)"
              >
                {{ day }}
              </div>
            </div>
          </div>

          <!-- November -->
          <div class="month">
            <h3>November 2025</h3>
            <div class="days">
              <div class="day-label">S</div><div class="day-label">M</div><div class="day-label">T</div>
              <div class="day-label">W</div><div class="day-label">T</div><div class="day-label">F</div><div class="day-label">S</div>

              <div
                  v-for="day in getDaysInMonth('November')"
                  :key="'nov-' + day"
                  :class="['day', { selected: isSelected('November', day), range: isInRange('November', day) }]"
                  @click="selectDay('November', day)"
              >
                {{ day }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons for selecting ± days -->
      <div class="options">
        <button class="option" @click="changeDate(1)">± 1 day</button>
        <button class="option" @click="changeDate(2)">± 2 days</button>
        <button class="option" @click="changeDate(3)">± 3 days</button>
        <button class="option" @click="changeDate(7)">± 7 days</button>
        <button class="option" @click="changeDate(14)">± 14 days</button>
      </div>

    </div>


  </div>


  <!-- === GUESTS POPUP === -->
  <div class="guest_overlay" v-show="popupGuests" @click.self="closeGuests">
    <div class="guests-popup">
      <div class="guest-row" v-for="(item, index) in guests" :key="index">
        <div class="guest-info">
          <span class="guest-title">{{ item.label }}</span>
          <span class="guest-sub">{{ item.sub }}</span>
        </div>
        <div class="guest-controls">
          <button class="circle-btn" @click="decrement(index)" :disabled="item.count === 0">−</button>
          <span class="count">{{ item.count }}</span>
          <button class="circle-btn" @click="increment(index)">+</button>
        </div>
      </div>

      <div class="guest-row">
        <div class="guest-info">
          <span class="guest-title">Pets</span>
          <a href="#" class="guest-link">Bringing a service animal?</a>
        </div>
        <div class="guest-controls">
          <button class="circle-btn" @click="decrement(3)" :disabled="guests[3].count === 0">−</button>
          <span class="count">{{ guests[3].count }}</span>
          <button class="circle-btn" @click="increment(3)">+</button>
        </div>
      </div>
    </div>
  </div>






  <div class="overlay" v-show="popupVisible" @click.self="closePopup">
    <div class="popup">
      <button class="close-btn" @click="closePopup">✕</button>

      <!-- Tabs -->
      <div class="tabs">
        <button
            :class="{ active: activeTab === 'language' }"
            @click="activeTab = 'language'"
        >
          Region and language
        </button>
        <button
            :class="{ active: activeTab === 'currency' }"
            @click="activeTab = 'currency'"
        >
          Currency
        </button>
      </div>

      <hr/>

      <!-- Language Tab -->
      <div v-if="activeTab === 'language'">
        <div class="section-title">Recommended languages and regions</div>
        <div class="language-grid"> <div class="language-item">English<br/><small>United States</small></div>
          <div class="language-item">English<br/><small>United Kingdom</small></div>
          <div class="language-item">English<br/><small>Canada</small></div>
          <div class="language-item">English<br/><small>Australia</small></div>
          <div class="language-item">English<br/><small>India</small></div>
          <div class="language-item selected">Русский<br/><small>Украина</small></div>
          <div class="language-item">Русский<br/><small>Россия</small></div>
          <div class="language-item">Deutsch<br/><small>Deutschland</small></div>
          <div class="language-item">Deutsch<br/><small>Österreich</small></div>
          <div class="language-item">Deutsch<br/><small>Schweiz</small></div>
          <div class="language-item">Français<br/><small>France</small></div>
          <div class="language-item">Français<br/><small>Canada</small></div>
          <div class="language-item">Français<br/><small>Belgique</small></div>
          <div class="language-item">Español<br/><small>España</small></div>
          <div class="language-item">Español<br/><small>México</small></div>
          <div class="language-item">Español<br/><small>Argentina</small></div>
          <div class="language-item">Español<br/><small>Colombia</small></div>
          <div class="language-item">Português<br/><small>Brasil</small></div>
          <div class="language-item">Português<br/><small>Portugal</small></div>
          <div class="language-item">Italiano<br/><small>Italia</small></div>
          <div class="language-item">Italiano<br/><small>Svizzera</small></div>
          <div class="language-item">Polski<br/><small>Polska</small></div>
          <div class="language-item">Türkçe<br/><small>Türkiye</small></div>
          <div class="language-item">Українська<br/><small>Україна</small></div>
          <div class="language-item">Čeština<br/><small>Česká republika</small></div>
          <div class="language-item">Magyar<br/><small>Magyarország</small></div>
          <div class="language-item">日本語<br/><small>日本</small></div>
          <div class="language-item">한국어<br/><small>대한민국</small></div>
          <div class="language-item">中文<br/><small>中国</small></div>
          <div class="language-item">中文<br/><small>新加坡</small></div>
          <div class="language-item">繁體中文<br/><small>台灣</small></div>
          <div class="language-item">繁體中文<br/><small>香港</small></div>
          <div class="language-item">العربية<br/><small>المملكة العربية السعودية</small></div>
          <div class="language-item">العربية<br/><small>مصر</small></div>
          <div class="language-item">العربية<br/><small>الإمارات العربية المتحدة</small></div>
          <div class="language-item">Nederlands<br/><small>Nederland</small></div>
          <div class="language-item">Nederlands<br/><small>België</small></div>
          <div class="language-item">Svenska<br/><small>Sverige</small></div>
          <div class="language-item">Norsk<br/><small>Norge</small></div>
          <div class="language-item">Suomi<br/><small>Suomi</small></div>
          <div class="language-item">Dansk<br/><small>Danmark</small></div>
          <div class="language-item">हिन्दी<br/><small>भारत</small></div>
          <div class="language-item">Bahasa Indonesia<br/><small>Indonesia</small></div>
          <div class="language-item">ไทย<br/><small>ประเทศไทย</small></div>
          <div class="language-item">Tiếng Việt<br/><small>Việt Nam</small></div>
          <div class="language-item">Ελληνικά<br/><small>Ελλάδα</small></div>
          <div class="language-item">Română<br/><small>România</small></div>
          <div class="language-item">Български<br/><small>България</small></div>
          <div class="language-item">Hrvatski<br/><small>Hrvatska</small></div>
          <div class="language-item">Srpski<br/><small>Srbija</small></div>
          <div class="language-item">Slovenčina<br/><small>Slovensko</small></div>
          <div class="language-item">Slovenščina<br/><small>Slovenija</small></div>
          <div class="language-item">Latviešu<br/><small>Latvija</small></div>
          <div class="language-item">Lietuvių<br/><small>Lietuva</small></div>
          <div class="language-item">Eesti<br/><small>Eesti</small></div> </div> </div>

      <!-- Currency Tab -->
      <div v-if="activeTab === 'currency'">
        <h2>Select currency</h2>
        <div class="currency-grid">
          <div v-for="(currency, i) in currencies" :key="i" class="currency-item">
            <strong>{{ currency.name }}</strong>
            <br/>
            <small>{{ currency.code }} – {{ currency.symbol }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional custom navbar styles */
</style>
