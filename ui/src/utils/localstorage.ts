import { config, versionsAvailable } from '../../../dataing/config'

/**
 * You know what you took, you know what you put and you know what there is.
 * Only thing missing is what it has before.
 */
const allowedListOfStorableFields = [
    "settingsGeneral",
    "settingsDex",
    "settingsTheme",
    "settingsBuilder",
    "settingsCalc",
] as const
// as const ensure the array type is inferred to ["gameData", "setttings"] instead of string[].

export type AllowedListOfStorableFields = (typeof allowedListOfStorableFields)[number]

const listOfGameData = versionsAvailable.map(x => `GameDataV${x}`)

// stolen code from https://mmazzarolo.com/blog/2022-06-25-local-storage-status/
function isQuotaExceededError(err: unknown): boolean {
    return (
      err instanceof DOMException && 
      (
        // everything except Firefox
        err.name === "QuotaExceededError" ||
        // Firefox
        err.name === "NS_ERROR_DOM_QUOTA_REACHED")
    );
}

 /**
 * In case of someone fork my code, in order not to get mixed with the localstorage data of 
 * another app similar on the same Domaine name.
 * Since most people uses github.io as free hosting service for those kind of projects in 2024
 * It would collide as localstorage is "bound to the website origin".
*/
const APP_NAME = config.appName
// some outdated browsers don't support localstorage (often A**le)
// which is my fear and is a reason why I guard localstorage with this wrapper.
// Also there's space limits, and once the limit is reached, 
// (which happens very often with this app)
// which will causes some bad errors
export const wrapperLocalStorage = {
    available: localStorage ? true : false,
    _private_keyprefixing(key: string){
        return APP_NAME + "-" + key
    },
    getItem(key: AllowedListOfStorableFields, defaultValue = ""){
        if (!this.available) return defaultValue
        const value = localStorage.getItem(this._private_keyprefixing(key))
        // technically it will work for undefined too 
        if (value == null) return defaultValue 
        return value
    },
    setItem(key: AllowedListOfStorableFields, value: string | object, retryAfterClear=false) {
        if (!this.available) return
        try{
            if ( typeof value === "string"){
                localStorage.setItem(this._private_keyprefixing(key), value)
            } else {
                localStorage.setItem(this._private_keyprefixing(key), JSON.stringify(value))
            }
            
        } catch(err){
            if (isQuotaExceededError(err)){
                if (retryAfterClear){
                    console.warn('Local storage is full, it is not possible add more')
                } else {
                    this.clearGameDataStored()
                    this.setItem(key, value, true)
                }
            } else {
                console.error(err)
            }
        }
        
    },
    setGameData(key: string, value: string | object, retryAfterClear=false){
        if (!this.available) return
        try{
            if ( typeof value === "string"){
                localStorage.setItem(this._private_keyprefixing(key), value)
            } else {
                localStorage.setItem(this._private_keyprefixing(key), JSON.stringify(value))
            }
            
        } catch(err){
            if (isQuotaExceededError(err)){
                if (retryAfterClear){
                    console.warn('Local storage is full, it is not possible add more')
                } else {
                    this.clearGameDataStored()
                    this.setGameData(key, value, true)
                }
            } else {
                console.error(err)
            }
        }
    },
    getGameData(key: string){
        if (!this.available) return undefined
        const value = localStorage.getItem(this._private_keyprefixing(key))
        // technically it will work for undefined too 
        if (value == null) return undefined 
        return value
    },
    rmItem(key: string){
        if (!this.available) return
        localStorage.removeItem(key)
    },
    /**
     * All data is kept in memory but often we reach the limit allowed by the browser.
     * which is usually 5MB
     * To keep working, data needs to be cleared, not all, the big ones
     */
    clearGameDataStored(){
        const fields = Object.keys(localStorage)
        for (const field of fields){
            if (listOfGameData.includes(field)){
                this.rmItem(field)
            } 
        }
    }
}