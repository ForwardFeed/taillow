import type { SubRouteData } from './types';

export const settingsRoutes: SubRouteData[] = [
    {   
        name: "General",
        path: "general",
        component: ()=> import('../views/SettingsGeneral.vue')
    },
    {   
        name: "Theme",
        path: "theme",
        component: ()=> import('../views/SettingsTheme.vue')
    },
    {   
        name: "Dex",
        path: "dex",
        component: ()=> import('../views/SettingsDex.vue')
    },
    {   
        name: "Builder",
        path: "builder",
        component: ()=> import('../views/SettingsBuilder.vue')
    },
    {   
        name: "Calc",
        path: "calc",
        component: ()=> import('../views/SettingsCalc.vue')
    },
]