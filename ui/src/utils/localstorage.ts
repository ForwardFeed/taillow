


const allowedListOfStorableFields = [
    "gameData",
    "settings",
    "latestVersionUsed"
] as const
// as const ensure the array type is inferred to ["gameData", "setttings"] instead of string[].

type AllowedListOfStorableFields = (typeof allowedListOfStorableFields)[number]

const clearableListOfStorableFields: Partial<AllowedListOfStorableFields>[] = [
    "gameData"
]


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

export interface StorageUtils {
    available: boolean
    /**
     * An oversight probably, but in case of someone fork my code, in order to get mixed with the localstorage data of 
     * another app similar. Since most people uses github.io as free hosting service for those kind of projects in 2024
     * It would collide as localstorage is "bound to the website origin".
     * @TODO tell to rename the APP_NAME in the readme if people fork this for public usage.
     * @param key the key before and after interacting with localstorage
     * @returns the key with the prefix of the app-name 
     */
    _private_keyprefixing: (key: string) => string
    getItem: (key: AllowedListOfStorableFields, ifFailed: string | undefined) => string 
    setItem: (key: AllowedListOfStorableFields, value: string, retryAfterClear: boolean) => void
    rmItem:  (key: string) => void
    /**
     * All data is kept in memory but often we reach the limit allowed by the browser.
     * To keep working, data needs to be cleared, not all, the big ones
     */
    clearTooHeavyData: () => void
}

//TODO! make this value set in project on compile time!
export const APP_NAME = "ER-TAILLOW"
// some outdated browsers don't support localstorage (often A**le)
// which is my fear and is a reason why I guard localstorage with this wrapper.
// Also there's space limits, and once the limit is reached, 
// (which happens very often with this app)
// which will causes some bad errors
export const wrapperLocalStorage: StorageUtils =  {
    available: localStorage ? true : false,
    _private_keyprefixing(key: string){
        return APP_NAME + "-" + key
    },
    getItem(key: AllowedListOfStorableFields, ifFailed = ""){
        if (!this.available) return ifFailed
        const value = localStorage.getItem(this._private_keyprefixing(key))
        // technically it will work for undefined too 
        if (value == null) return ifFailed 
        return value
    },
    setItem(key: AllowedListOfStorableFields, value, retryAfterClear=false) {
        if (!this.available) return
        try{
            localStorage.setItem(this._private_keyprefixing(key), value)
        } catch(err){
            if (isQuotaExceededError(err)){
                if (retryAfterClear){
                    console.warn('Local storage is full, it is not possible add more')
                } else {
                    this.clearTooHeavyData()
                    this.setItem(key, value, true)
                }
            } else {
                console.error(err)
            }
        }
        
    },
    rmItem(key: string){
        if (!this.available) return
        localStorage.removeItem(key)
    },
    clearTooHeavyData(){
        const fields = Object.keys(localStorage)
        for (const field of fields){
            //@ts-ignore
            if (clearableListOfStorableFields.includes(field)){
                this.rmItem(field)
            } 
        }
    }
}