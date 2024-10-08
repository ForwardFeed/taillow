
// sub route of settings

export type SettingsRouteData = {
    name: string,
    path: string,
    component: any,
}

export const settingsRoutes: SettingsRouteData[] = [
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