import { ref, computed } from 'vue'

import Image1 from '@/img/mila_deva.jpg';
import cImage from '@/img/hami papi.jpg';
import dImage from '@/img/patriot.jpg';
import gImage from '@/img/pensione.jpg';
import qImage from '@/img/stara kotolna.jpg';
import rImage from '@/img/kayak-5543935_1920.jpg';
import tImage from '@/img/staryBiskupsky.jpg';
import jImage from '@/img/taban.jpg';
import pImage from '@/img/zanzibar.jpg';

import sImage from '@/img/fit_up.JPG';
import iImage from '@/img/fitko 9.jpg';
import kImage from '@/img/gym 75.jpg';
import fImage from '@/img/kalpa.jpg';
import lImage from '@/img/oysis.jpg';
import mImage from '@/img/unnamed.jpg';
import xImage from '@/img/yoga_house.jpg';
import Imagek from '@/img/pilates_studio.jpg';
import Imagef from '@/img/re-forma.jpg' ;


const services = ref([
    {
        id: 1,
        title: "Hyperlocal, foraged fare by Clair",
        description: "Authentic Roman meal",
        price: "From €164 / guest",
        rating: "★ 5.0",
        img: Image1
    },
    {
        id: 2,
        title: "Authentic Roman meal",
        description: "Individual host",
        price: "From €65 / guest",
        rating: "★ 4.97",
        img: cImage
    },
    {
        id: 3,
        title: "Luxury Private Dining by Chef Jimmy Matiz",
        description: "From €1120 / min. 2 guests",
        price: "€1120 min",
        rating: "★ 5.0",
        img: dImage
    },
    {
        id: 4,
        title: "Behind the flame and fusion flavors by Eric",
        description: "From €113 / min. 5 guests",
        price: "€113 min.",
        rating: "★ 5.0",
        img: gImage
    },
    {
        id: 5,
        title: "Vibrant Cal-Mediterranean menus by Liza",
        description: "From €872 / min. 2 guests",
        price: "€872 min.",
        rating: "★ 5.0",
        img: rImage
    },
    {
        id: 6,
        title: "Catalan cuisine by Cristina",
        description: "Individual host",
        price: "From €40 / guest",
        rating: "★ 5.0",
        img: tImage
    },
    {
        id: 7,
        title: "The Vegan Experience: Plant-based Private Chef",
        description: "From €43 / guest",
        price: "From €43 / guest",
        rating: "★ 5.0",
        img: qImage
    },
    {
        id: 8,
        title: "The Vegan Experience: Plant-based Private Chef",
        description: "From €43 / guest",
        price: "From €43 / guest",
        rating: "★ 5.0",
        img: jImage
    },
    {
        id: 9,
        title: "The Vegan Experience: Plant-based Private Chef",
        description: "From €43 / guest",
        price: "From €43 / guest",
        rating: "★ 5.0",
        img: pImage
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
        img:  sImage
    },
    {
        id: 9,
        title: "Yoga & embodiment by Julia",
        description: "From €12 / min. 2 guests",
        price: "€12 min.",
        rating: "★ 5.0",
        img: iImage
    },
    {
        id: 10,
        title: "Personal Training & Group Fitness",
        description: "Westmount, Canada",
        price: "From €74 / guest",
        rating: "★ 5.0",
        img: kImage
    },
    {
        id: 11,
        title: "Restorative fitness by Taylor",
        description: "Los Angeles, United States",
        price: "From €73 / guest",
        rating: "★ 5.0",
        img: fImage
    },
    {
        id: 12,
        title: "High-energy workouts by Vicky",
        description: "Redondo Beach, United States",
        price: "From €138 / guest",
        rating: "★ 5.0",
        img: lImage
    },
    {
        id: 13,
        title: "Sun-sweat by Nishant",
        description: "San Diego, United States",
        price: "From €86 / guest",
        rating: "★ 5.0",
        img: mImage
    } ,

    {
        id: 14,
        title: "Sun-sweat by Nishant",
        description: "San Diego, United States",
        price: "From €86 / guest",
        rating: "★ 5.0",
        img: xImage
    },
    {
        id: 15,
        title: "Sun-sweat by Nishant",
        description: "San Diego, United States",
        price: "From €86 / guest",
        rating: "★ 5.0",
        img: Imagek
    } ,
    {
        id: 16,
        title: "Sun-sweat by Nishant",
        description: "San Diego, United States",
        price: "From €86 / guest",
        rating: "★ 5.0",
        img: Imagef
    }
])

const titlesTraining = computed(() => servicesTraining.value.map(s => s.title))

export function useServicesTraining() {
    return { servicesTraining, titlesTraining }
}
