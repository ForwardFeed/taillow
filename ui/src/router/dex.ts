
// sub route of the dex

import type { SubRouteData } from './types';

export const dexRoutes: SubRouteData[] = [
    {   
        name: "Species",
        path: "species",
        component: ()=> import('../views/DexSpecies.vue')
    },
    {   
        name: "Abilities",
        path: "abilities",
        component: ()=> import('../views/DexAbilities.vue')
    },
    {   
        name: "Moves",
        path: "moves",
        component: ()=> import('../views/DexMoves.vue')
    },
    {   
        name: "Trainers",
        path: "trainers",
        component: ()=> import('../views/DexTrainers.vue')
    },
    {   
        name: "World",
        path: "world",
        component: ()=> import('../views/DexWorld.vue')
    },
]