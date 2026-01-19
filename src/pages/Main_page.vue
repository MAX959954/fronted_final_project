<script setup>
import "@/styles/main_page.css";
</script>

<template>
  <main>
    <section class="offers-section">
      <h2>Offers</h2>
      <p>Promotions, deals and special offers for you</p>
      <div class="offers-cards">
        <div class="card late-escape">
          <h3>Late Escape Deals</h3>
          <p>Go for a good time, not a long time</p>
          <p>Squeeze out the last bit of sun with at least 15% off</p>
          <button>Find deals</button>
        </div>
        <div class="card holiday-rentals">
          <h3>Holiday Rentals</h3>
          <p>Live the dream in a holiday home</p>
          <p>Choose from houses, villas, chalets and more</p>
          <button>Book yours</button>
        </div>
      </div>
    </section>

    <section class="trip-planner">
      <h2>Quick and easy trip planner</h2>
      <p>Pick a vibe and explore the top destinations in Slovakia</p>
      <div class="vibes">
        <button class="active">Cultural Exploration</button>
        <button>Christmas Markets</button>
        <button>Wine Tasting</button>
        <button>Food & Gastronomy</button>
        <button>Spa & Wellness</button>
        <button>Photography</button>
      </div>
      <div class="destinations">
        <div class="destination">
          <img src="../img/Bratislava.JPG" alt="Bratislava">
          <h3>Bratislava</h3>
          <p>2.1 km away</p>
        </div>
        <div class="destination">
          <img src="../img/trnava.jpg" alt="Trnava">
          <h3>Trnava</h3>
          <p>43 km away</p>
        </div>
        <div class="destination">
          <img src="../img/nitra.jpg" alt="Nitra">
          <h3>Nitra</h3>
          <p>75 km away</p>
        </div>
        <div class="destination">
          <img src="../img/Trenčiansky.jpg" alt="Trenčín">
          <h3>Trenčín</h3>
          <p>107 km away</p>
        </div>
        <div class="destination">
          <img src="../img/Banská_Bystrica.jpg" alt="Banská Bystrica">
          <h3>Banská Bystrica</h3>
          <p>130 km away</p>
        </div>
        <div class="destination">
          <img src="../img/zilina.jpg" alt="Žilina">
          <h3>Kosice</h3>
          <p>169 km away</p>
        </div>
        <div class="destination">
          <img src="../img/kosice.jpg" alt="Kosice">
          <h3>Presov</h3>
          <p>152 km away</p>
        </div>
        <div class="destination">
          <img src="../img/zvolen.jpg" alt="Žilina">
          <h3>Zvolen</h3>
          <p>143 km away</p>
        </div>
      </div>
    </section>

    <section class="property-types">
      <h2>Browse by property type</h2>
      <div class="types">
        <div class="type-card">
          <img src="../img/hotell.jpg" alt="Hotels">
          <h3>Hotels</h3>
        </div>
        <div class="type-card">
          <img src="../img/apartments.jpg" alt="Apartments">
          <h3>Apartments</h3>
        </div>
        <div class="type-card">
          <img src="../img/resorts.webp" alt="Resorts">
          <h3>Resorts</h3>
        </div>
        <div class="type-card">
          <img src="../img/villas.jpg" alt="Villas">
          <h3>Villas</h3>
        </div>
      </div>
    </section>

    <section class="explore-section">
      <h1>Explore Slovakia</h1>
      <p>These popular destinations have a lot to offer</p>
      <div class="destinations">
        <div class="destination">
          <img src="../img/hotel.jpg" alt="Bratislava">
          <h3>Bratislava</h3>
          <p>1,705 properties</p>
        </div>
        <div class="destination">
          <img src="../img/hotel_bb.jpg" alt="Košice">
          <h3>Košice</h3>
          <p>687 properties</p>
        </div>
        <div class="destination">
          <img src="../img/hotel_lm.jpg" alt="Banská Štiavnica">
          <h3>Banská Štiavnica</h3>
          <p>251 properties</p>
        </div>
        <div class="destination">
          <img src="../img/hotel_kosi.webp" alt="Banská Bystrica">
          <h3>Banská Bystrica</h3>
          <p>265 properties</p>
        </div>
        <div class="destination">
          <img src="../img/hotel_nr.jpg" alt="Nitra">
          <h3>Nitra</h3>
          <p>114 properties</p>
        </div>
        <div class="destination">
          <img src="../img/hotel_lm.webp" alt="Liptovský Mikuláš">
          <h3>Liptovský Mikuláš</h3>
          <p>515 properties</p>
        </div>
      </div>
    </section>

    <section class="trending-section">
      <h1>Trending destinations in Europe</h1>
      <p>Most popular choices for travelers from european people</p>
      <div class="destinations-grid">
        <div class="destination-card">
          <img src="../img/Oslo.avif" alt="Prague">
          <div class="destination-overlay">
            <h3><span class="flag">🇳🇴</span>Oslo</h3>
          </div>
        </div>
        <div class="destination-card">
          <img src="../img/Viena.webp" alt="Bratislava">
          <div class="destination-overlay">
            <h3><span class="flag">🇦🇹</span>Vienna</h3>
          </div>
        </div>
        <div class="destination-card">
          <img src="../img/Berlin.jpg" alt="Budapest">
          <div class="destination-overlay">
            <h3><span class="flag">🇩🇪</span>Berlin</h3>
          </div>
        </div>
        <div class="destination-card">
          <img src="../img/Paris.webp" alt="Košice">
          <div class="destination-overlay">
            <h3><span class="flag">🇫🇷</span>Paris</h3>
          </div>
        </div>
        <div class="destination-card">
          <img src="../img/barcelona.webp" alt="Brno">
          <div class="destination-overlay">
            <h3><span class="flag">🇪🇸</span>Barcelona</h3>
          </div>
        </div>
      </div>
    </section>
  </main>


</template>

<style scoped>

</style>