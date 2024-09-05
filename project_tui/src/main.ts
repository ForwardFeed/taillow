import { createApp } from 'vue-termui'
import App from './App.vue'

createApp(App).mount()

/*
import { createDatalink } from './src/datalink/datalink'
import { FullDatalinked } from './src/datalink/types'

// write the datalinked file for calc on the currently parsed version
const datalinkedFile = path.join(dataOutputDirectory, "datalinkedtest.json")
const datalinked: FullDatalinked = createDatalink(gameData)
fs.writeFile(datalinkedFile, JSON.stringify(datalinked), function(err){
    if (err){
        throw `Failed exporting datalinked to ${datalinkedFile}, reason:\n${err}`
    } else {
        logSuccess(`Exporting datalinked to ${datalinkedFile}`)
    }
})*/

