import { ref, computed } from 'vue'

const services = ref([
    {
        id: 1,
        title: "Hyperlocal, foraged fare by Clair",
        description: "Authentic Roman meal",
        price: "From €164 / guest",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/FF6B6B/FFFFFF?text=Hyperlocal"
    },
    {
        id: 2,
        title: "Authentic Roman meal",
        description: "Individual host",
        price: "From €65 / guest",
        rating: "★ 4.97",
        img: "https://via.placeholder.com/180x140/4ECDC4/FFFFFF?text=Authentic"
    },
    {
        id: 3,
        title: "Luxury Private Dining by Chef Jimmy Matiz",
        description: "From €1120 / min. 2 guests",
        price: "€1120 min",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/45B7D1/FFFFFF?text=Luxury"
    },
    {
        id: 4,
        title: "Behind the flame and fusion flavors by Eric",
        description: "From €113 / min. 5 guests",
        price: "€113 min.",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/96CEB4/FFFFFF?text=Behind"
    },
    {
        id: 5,
        title: "Vibrant Cal-Mediterranean menus by Liza",
        description: "From €872 / min. 2 guests",
        price: "€872 min.",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/F7DC6F/FFFFFF?text=Vibrant"
    },
    {
        id: 6,
        title: "Catalan cuisine by Cristina",
        description: "Individual host",
        price: "From €40 / guest",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/BB8FCE/FFFFFF?text=Catalan"
    },
    {
        id: 7,
        title: "The Vegan Experience: Plant-based Private Chef",
        description: "From €43 / guest",
        price: "From €43 / guest",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/FF9FF3/FFFFFF?text=Vegan"
    }
])

const titles = computed(() => services.value.map(s => s.title))

export function useServices() {
    return { services, titles }
}

const servicesTraining = ref([
    {
        id: 8,
        title: "Total body training by Peter",
        description: "Pasadena, United States",
        price: "From €43 / guest",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/5F27CD/FFFFFF?text=Total"
    },
    {
        id: 9,
        title: "Yoga & embodiment by Julia",
        description: "From €12 / min. 2 guests",
        price: "€12 min.",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/54A0FF/FFFFFF?text=Yoga"
    },
    {
        id: 10,
        title: "Personal Training & Group Fitness",
        description: "Westmount, Canada",
        price: "From €74 / guest",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/FF6B35/FFFFFF?text=Fitness"
    },
    {
        id: 11,
        title: "Restorative fitness by Taylor",
        description: "Los Angeles, United States",
        price: "From €73 / guest",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/FF6B35/FFFFFF?text=Restorative"
    },
    {
        id: 12,
        title: "High-energy workouts by Vicky",
        description: "Redondo Beach, United States",
        price: "From €138 / guest",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/FF6B35/FFFFFF?text=HighEnergy"
    },
    {
        id: 13,
        title: "Sun-sweat by Nishant",
        description: "San Diego, United States",
        price: "From €86 / guest",
        rating: "★ 5.0",
        img: "https://via.placeholder.com/180x140/FF6B35/FFFFFF?text=SunSweat"
    }
])

const titlesTraining = computed(() => servicesTraining.value.map(s => s.title))

export function useServicesTraining() {
    return { servicesTraining, titlesTraining }
}
