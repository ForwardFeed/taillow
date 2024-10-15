import { SpecieSpriteData } from "../grabber/sprites.ts/sprites";
import { PNG } from 'pngjs';
import fs from 'node:fs'

export function exportSprites(sprites: SpecieSpriteData[]){
    for (const sprite of sprites){
        setFirstColorTransparent(sprite.front, "")
    }
}

function setFirstColorTransparent(inPath: string, outPath: string){
    fs.createReadStream(inPath)
    .pipe(
        new PNG()
    )
    .on("parsed", function(){
        //@ts-ignore
        const pal = this._parser._parser._palette as [[number, number, number, number]]
        for (let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                const idx = (this.width * y + x) << 2;
                const r = this.data[idx]
                const g = this.data[idx + 1];
                const b = this.data[idx + 2];
                //console.log([r,g,b,a])
                //put transparency on the color 1 (index 0)
                if (pal.findIndex(x => x[0] == r && x[1] == g && x[2] == b) == 0){
                    this.data[idx + 3] = 0
                }
            }
        }
        this.pack().pipe(fs.createWriteStream(outPath))
    })
    .on("metadata", function(metadata){
        //console.log("metadata", metadata)
    })
}


exportSprites([])