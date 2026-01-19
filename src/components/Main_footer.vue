<script setup>
import { ref } from "vue";
import {RouterLink} from "vue-router";
import "@/styles/main_footer.css"

const activeTab = ref('domestic');

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

</script>

<template>
   <footer>
     <section class="popular-section">
       <h1 class="popular-title">Popular with travellers from Slovakia</h1>
      <div class="tabs">
        <button 
          class="tab" 
          :class="{ active: activeTab === 'domestic' }"
          @click="setActiveTab('domestic')"
        >
          Domestic cities
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'international' }"
          @click="setActiveTab('international')"
        >
          International cities
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'regions' }"
          @click="setActiveTab('regions')"
        >
          Regions
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'countries' }"
          @click="setActiveTab('countries')"
        >
          Countries
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'places' }"
          @click="setActiveTab('places')"
        >
          Places to stay
        </button>
      </div>
       <div class="hotels-grid">
         <RouterLink to="#" class="hotel-link">Bratislava hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Žilina hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Štrbské Pleso hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Donovaly hotels</RouterLink >
         <RouterLink to="#" class="hotel-link">Stará Ľubovňa hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Košice hotels</RouterLink>
         <RouterLink to ="#" class="hotel-link">Banská Štiavnica hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Zvolen hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Trenčianske Teplice hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Show more</RouterLink>
         <RouterLink to="#" class="hotel-link">Vysoké Tatry hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Banská Bystrica hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Prešov hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Poprad hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Tatranská Lomnica hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Nitra hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Trnava hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Komárno hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Bojnice hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Demänovská Dolina hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Martin hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Trenčín hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Spišská Nová Ves hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Smokovec hotels</RouterLink>
         <RouterLink to="#" class="hotel-link">Piešťany hotels</RouterLink>
       </div>
       <div class="filters">
         <span class="filter-item">Countries</span>
         <span class="filter-item">Regions</span>
         <span class="filter-item">Cities</span>
         <span class="filter-item">Districts</span>
         <span class="filter-item">Airports</span>
         <span class="filter-item">Places of interest</span>
         <span class="filter-item">Holiday homes</span>
         <span class="filter-item">Apartments</span>
         <span class="filter-item">Resorts</span>
         <span class="filter-item">Villas</span>
         <span class="filter-item">Hotels</span>
         <span class="filter-item">B&Bs</span>
         <span class="filter-item">Guest houses</span>
         <span class="filter-item">Unique places to stay</span>
         <span class="filter-item">All destinations</span>
       </div>
       <div class="footer-nav">
         <div class="footer-column">
           <h3>Support</h3>
           <RouterLink to="#" class="footer-link">Manage your trips</RouterLink>
           <RouterLink to="#" class="footer-link">Contact Customer Service</RouterLink>
           <RouterLink to="#" class="footer-link">Safety resource centre</RouterLink>
           <RouterLink to="#" class="footer-link">Flight finder</RouterLink>
           <RouterLink to="#" class="footer-link">Restaurant reservations</RouterLink>
           <RouterLink to="#" class="footer-link">Booking.com for Travel Agents</RouterLink>
         </div>
         <div class="footer-column">
           <h3>Terms and settings</h3>
           <RouterLink to="#" class="footer-link">Manage cookie settings</RouterLink>
           <RouterLink to="#" class="footer-link">Privacy & cookies</RouterLink>
           <RouterLink to="#" class="footer-link">Terms of Service</RouterLink>
           <RouterLink to="#" class="footer-link">Accessibility Statement</RouterLink>
           <RouterLink to="#" class="footer-link">Dispute resolution</RouterLink>
           <RouterLink to="#" class="footer-link">Modern Slavery Statement</RouterLink>
           <RouterLink to="#" class="footer-link">Human Rights Statement</RouterLink>
           <RouterLink to="#" class="footer-link">Manage personalised recommendations</RouterLink>
         </div>
         <div class="footer-column">
           <h3>Partners</h3>
           <RouterLink to="#" class="footer-link">Extraneous login</RouterLink>
           <RouterLink to="#" class="footer-link">Partner help</RouterLink>
           <RouterLink to="#" class="footer-link">List your property</RouterLink>
           <RouterLink to="#" class="footer-link">Become an affiliate</RouterLink>
         </div>
         <div class="footer-column">
           <h3>About</h3>
           <RouterLink to="#" class="footer-link">About Booking.com</RouterLink>
           <RouterLink to="#" class="footer-link">How we work</RouterLink>
           <RouterLink to="#" class="footer-link">Sustainability</RouterLink>
           <RouterLink to="#" class="footer-link">Press centre</RouterLink>
           <RouterLink to="#" class="footer-link">Careers</RouterLink>
           <RouterLink to="#" class="footer-link">Investor relations</RouterLink>
           <RouterLink to="#" class="footer-link">Corporate contact</RouterLink>
           <RouterLink to="#" class="footer-link">Content guidelines and reporting</RouterLink>
         </div>
       </div>
       <div class="bottom-bar">
         <span>🇬🇧 EUR</span>
         <span>Booking.com for Travel Agents</span>
       </div>
     </section>
   </footer>
</template>
