<script setup>
import "@/styles/cohost.css"

const handleContinue = () => alert("Continue button clicked")
</script>

<template>
  <main class="refer-host-page">
    <!-- Login Section -->
    <section class="login-section">
      <div class="login-container">
        <div class="login-left">
          <h1 class="page-title">Welcome to Brand</h1>

          <p class="intro-text">
            Log in or sign up to refer a host. We'll help you get started quickly.
          </p>
          <form class="login-form" @submit.prevent="handleContinue">
            <label class="label" for="country">Country code</label>
            <select id="country" class="select country-select">
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
            />

            <p class="privacy-text">
              We’ll call or text you to confirm your number. Standard message and data rates apply.
              <a href="#">Privacy Policy</a>
            </p>

            <button class="continue-btn" type="submit">Continue</button>

            <div class="or-row">or</div>

            <div class="social-buttons">
              <button class="social-btn">Continue with Google</button>
              <button class="social-btn">Continue with Apple</button>
              <button class="social-btn">Continue with Email</button>
              <button class="social-btn">Continue with Facebook</button>
            </div>
          </form>
        </div>

        <div class="login-right">
          <img
              src="https://a0.muscache.com/im/pictures/airbnb_landing_example.jpg"
              alt="Refer a Host Illustration"
              class="login-image"
          />
        </div>
      </div>
    </section>

    <!-- Footer -->
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
  </main>
</template>
