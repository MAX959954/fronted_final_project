import { ref, computed } from 'vue'
import fImage from '@/img/f.jpg';
import cImage from '@/img/ashim-d-silva-UjxL9x0nwQ8-unsplash.jpg';
import dImage from '@/img/mountain-7978816_1920.jpg';
import gImage from '@/img/shannia-christanty-BqebfuZ2yk4-unsplash.jpg';
import qImage from '@/img/beach-1867524_1920.jpg';
import rImage from '@/img/kayak-5543935_1920.jpg';
import tImage from '@/img/mountains-7846880_1920.jpg';
import jImage from '@/img/paraglider-4806383_1920.jpg';
import pImage from '@/img/sea-2602227_1920.jpg';
import sImage from '@/img/pexels-yaroslav-shuraev-4763756.jpg';
import iImage from '@/img/pexels-jonathanborba-3076509.jpg';
import kImage from '@/img/pexels-mikebirdy-445849.jpg';

export function useExperiences() {
    //Automatically updates the UI when data changes
    const experiences = ref([
        {
            id: 1,
            title: "Cooking Class with Local Chef",
            description: "Learn traditional Slovak recipes in a cozy kitchen. Hands-on session with fresh ingredients.",
            price: "€50",
            duration: "3 hours",
            rating: "★★★★☆ (45 reviews)",
            image: fImage
        },
        {
            id: 2,
            title: "Guided Hiking Tour in High Tatras",
            description: "Explore breathtaking mountain trails with a certified guide. Moderate difficulty, stunning views.",
            price: "€35",
            duration: "4 hours",
            rating: "★★★★★ (128 reviews)",
            image: cImage
        },
        {
            id: 3,
            title: "Wine Tasting in Small Carpathians",
            description: "Sample award-winning wines from family vineyards. Includes cheese pairings and stories from winemakers.",
            price: "€45",
            duration: "2.5 hours",
            rating: "★★★★☆ (89 reviews)",
            image: dImage
        },
        {
            id: 4,
            title: "Street Photography Workshop in Bratislava",
            description: "Capture the city's hidden gems with a professional photographer. Tips on composition and editing.",
            price: "€40",
            duration: "3 hours",
            rating: "★★★★★ (67 reviews)",
            image: gImage
        },
        {
            id: 5,
            title: "Ultimate Relaxing Wellness Spa Day in Piešťany",
            description: "Indulge in thermal baths and massages at a historic spa resort. Wellness treatments included.",
            price: "€60",
            duration: "5 hours",
            rating: "★★★★☆ (112 reviews)",
            image: qImage
        },
        {
            id: 6,
            title: "Fun and Delicious Chocolate Making Class in Modra",
            description: "Taste authentic Slovak dishes from street vendors to hidden eateries. Cultural insights included.",
            price: "€55",
            duration: "3.5 hours",
            rating: "★★★★★ (95 reviews)",
            image: rImage
        },
        {
            id: 7,
            title: "Traditional Folk Dance Workshop in Liptovský Mikuláš",
            description: "Immerse yourself in Slovak heritage with lively folk dances taught by local experts. Includes music and costumes for an authentic experience.",
            price: "€30",
            duration: "2 hours",
            rating: "★★★★★ (76 reviews)",
            image: tImage
        },
        {
            id: 8,
            title: "Kayaking Adventure on the Dunajec River",
            description: "Paddle through scenic gorges and rapids with a guide. Suitable for beginners, with safety gear and post-paddle picnic.",
            price: "€42",
            duration: "3.5 hours",
            rating: "★★★★☆ (101 reviews)",
            image: jImage
        },
        {
            id: 9,
            title: "Interactive Chocolate Making Workshop Class in Modra",
            description: "Craft your own gourmet chocolates using local cocoa and flavors. Take home your creations and learn the art of tempering.",
            price: "€38",
            duration: "2 hours",
            rating: "★★★★★ (54 reviews)",
            image: pImage
        },
        {
            id: 10,
            title: "Birdwatching Tour in the Slovak Paradise National Park",
            description: "Spot rare birds and wildlife with an ornithologist guide. Binoculars provided, plus tips on photography and conservation.",
            price: "€28",
            duration: "4 hours",
            rating: "★★★★☆ (82 reviews)",
            image: sImage
        },
        {
            id: 11,
            title: "Creative and Fun Pottery Workshop in Banská Štiavnica",
            description: "Shape clay on a wheel and glaze your piece in a UNESCO-listed mining town. Fire and collect your pottery later.",
            price: "€52",
            duration: "4 hours",
            rating: "★★★★★ (63 reviews)",
            image: iImage
        },
        {
            id: 12,
            title: "Unforgettable Hot Air Balloon Ride over the Danube",
            description: "Soar above Bratislava's skyline and the river at sunrise. Includes briefing, flight, and celebratory toast on landing.",
            price: "€65",
            duration: "2 hours",
            rating: "★★★★★ (137 reviews)",
            image: kImage
        }// ... keep the rest of your data here
    ])

    const titles = computed(() => experiences.value.map(e => e.title))
    return { experiences, titles }
}

