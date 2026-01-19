<script setup>
import { ref } from "vue";
import "@/styles/findCoHosts.css"
import "@/styles/navbar.css"

const showLogin = ref(false)

function closeLoginPopup() {
  showLogin.value = false
}

function handleContinue() {
  alert('Continue clicked (demo)')
  closeLoginPopup()
}
</script>

<template>

  <header>
    <h1>CoHostify</h1>
    <a href="#" @click.prevent="showLogin = true">Log in / Sign up</a>
  </header>

  <div class="search-container">
    <input type="text" placeholder="Find co-hosts near Nitra, Slovakia">
    <button>Search</button>
  </div>

  <div class="result-box">
    <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="No co-hosts">
    <h2>No co-hosts nearby</h2>
    <p>Sign up to be notified if one becomes available.</p>
    <button>Notify me</button>
  </div>

  <footer class="footer">
    <div class="footer-container">
      <div class="footer-column">
        <h4>Support</h4>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Get help with a safety issue</a></li>
          <li><a href="#">AirCover</a></li>
          <li><a href="#">Anti-discrimination</a></li>
          <li><a href="#">Disability support</a></li>
          <li><a href="#">Cancellation options</a></li>
          <li><a href="#">Report neighborhood concern</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h4>Hosting</h4>
        <ul>
          <li><a href="#">Airbnb your home</a></li>
          <li><a href="#">Airbnb your experience</a></li>
          <li><a href="#">Airbnb your service</a></li>
          <li><a href="#">AirCover for Hosts</a></li>
          <li><a href="#">Hosting resources</a></li>
          <li><a href="#">Community forum</a></li>
          <li><a href="#">Hosting responsibly</a></li>
          <li><a href="#">Airbnb-friendly apartments</a></li>
          <li><a href="#">Join a free Hosting class</a></li>
          <li><a href="#">Find a co-host</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h4>Airbnb</h4>
        <ul>
          <li><a href="#">2025 Summer Release</a></li>
          <li><a href="#">Newsroom</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Investors</a></li>
          <li><a href="#">Gift cards</a></li>
          <li><a href="#">Airbnb.org emergency stays</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>
        © 2025 Airbnb, Inc. · <a href="#">Terms</a> · <a href="#">Sitemap</a> ·
        <a href="#">Privacy</a> · <a href="#">Your Privacy Choices</a>
      </p>
      <div class="footer-icons">
        <select>
          <option>English (US)</option>
          <option>Slovak (SK)</option>
        </select>
        <span>€ EUR</span>
        <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="#"><i class="fa-brands fa-x-twitter"></i></a>
        <a href="#"><i class="fa-brands fa-instagram"></i></a>
      </div>
    </div>
  </footer>

  <!-- LOGIN POPUP -->
  <div
      v-if="showLogin"
      class="overlay"
      @click.self="closeLoginPopup"
  >
    <div class="popup">
      <button class="close-btn" @click="closeLoginPopup">✕</button>

      <!-- Tabs -->
      <div class="tabs" style="margin-top:8px;">
        <button class="active">Log in</button>
      </div>

      <!-- Main grid -->
      <div class="login-grid" style="margin-top:8px;">
        <div class="login-left">
          <h2>Welcome to Brand</h2>

          <label class="label" for="country-login">Country code</label>
          <select id="country-login" class="select country-select">
            <option value="+421">Slovakia (+421)</option>
            <option value="+1">United States (+1)</option>
            <option value="+44">United Kingdom (+44)</option>
          </select>

          <label class="label" for="phone-login">Phone number</label>
          <input
              id="phone-login"
              class="phone-input"
              type="tel"
              placeholder="Phone number"
          />

          <p style="color:var(--muted); font-size:13px; margin-bottom:12px;">
            We'll call or text you to confirm your number. Standard message and data rates apply.
            <a href="#" style="color:var(--accent)">Privacy Policy</a>
          </p>

          <button
              class="continue-btn"
              @click="handleContinue"
          >
            Continue
          </button>

          <div class="or-row" style="margin-top:18px;">or</div>

          <div>
            <button class="social-btn">
              <svg viewBox="0 0 24 24" fill="none" style="width:18px;height:18px;">
                <path
                    d="M21 12.2c0-.68-.06-1.32-.18-1.95H12v3.7h5.6c-.24 1.3-.97 2.42-2.06 3.16v2.6h3.34C19.67 18.2 21 15.5 21 12.2z"
                    fill="#4285F4"
                />
              </svg>
              Continue with Google
            </button>

            <button class="social-btn">
              <svg viewBox="0 0 24 24" fill="none" style="width:18px;height:18px;">
                <path
                    d="M16 1.2c0 .9-.3 1.9-.8 2.7-.4.6-1 1.3-1.7 1.3-.1 0-.2-.1-.3-.2-.9-.8-1.9-1.1-3.1-.9-1.2.2-2.5.9-3.3 1.9-.9 1.1-1.2 2.5-1.1 3.8.1 1.3.5 2.6 1.2 3.6.6.9 1.6 1.8 2.6 1.8.6 0 1.2-.2 1.8-.6.6-.3 1.1-.8 1.6-1.4.2-.2.5-.3.8-.2.5.1 1 .5 1.1 1.1.2.9.6 1.7 1.2 2.4 1 .9 2.3.8 3.3.1.1-.1.2-.2.3-.3-1.6-1.3-2.8-3.5-3-6-.1-1.1.1-2.1.6-3 .8-1.6 2.6-1.6 3.8-1.1-.4-.6-1-1-1.6-1.4-.8-.5-1.6-.9-2.6-1-.4-.1-.9 0-1.3.1z"
                    fill="#fff"
                />
              </svg>
              Continue with Apple
            </button>

            <button class="social-btn">Continue with email</button>
            <button class="social-btn">Continue with Facebook</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>