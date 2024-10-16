import { SpecieSpriteData } from "../grabber/sprites.ts/sprites";
import { PNG } from 'pngjs';
import fs from 'node:fs'
import fsPromise from "node:fs/promises"
import { logError } from "../logging";
import ReadableStreamClone from "readable-stream-clone";
import { join } from "node:path";

type Pal =  [[number, number, number, number]?]

function readPalFile(palFileData: string){
    const palData: Pal = []
    const lines = palFileData.split("\n")
    const len = +lines[2]
    // skipping the header
    for (let i = 3; i < len; i++){
        const line = lines[i].split(' ')
        const r = +line[0]
        const g = +line[1]
        const b = +line[2]
        const a = +line[3] || 255
        palData.push([r,g,b,a])
    }
    return palData
}

function applyPal(png: PNG, outPath: string, imgPal: Pal, pal: Pal, firstColorIsTransparent: boolean){
    for (let y = 0; y < png.height; y++){
        for(let x = 0; x < png.width; x++){
            const idx = (png.width * y + x) << 2;
            const r = png.data[idx]
            const g = png.data[idx + 1];
            const b = png.data[idx + 2];
            const palIndex = imgPal.findIndex(x => x && x[0] == r && x[1] == g && x[2] == b)
            //put transparency on the color 1 (index 0)  if it's set
            if (firstColorIsTransparent && palIndex === 0){
                png.data[idx + 3] = 0
            } else {
                for (let i = 0; i < 3; i++){
                    png.data[idx + i] = pal[palIndex]?.[i] || png.data[idx + i]
                }
            }
        }
    }
    png.pack().pipe(fs.createWriteStream(outPath))
}

function nameByPalNumber(base: string, n: number){
    const map = [
        base,
        base.replace(".png", "_SHINY.png")
    ]
    return map[n] || n + base
}

function applyPals(inPath: string, baseOutPath: string, pals:Pal[], firstColorIsTransparent: boolean){
    const image = fs.createReadStream(inPath)
    // open the file one time but parse it in a different PNG instance each time
    // because rewriting over the same instance may cause issue with palette interference
    for (let palIndex = 0; palIndex < pals.length; palIndex++){
        const xd = new ReadableStreamClone(image)
        .pipe(new PNG())
        .on("parsed", function(){
            //@ts-ignore
            const imgPal = this._parser._parser._palette as Pal
            const pal = pals[palIndex]
            const outPath = nameByPalNumber(baseOutPath, palIndex)
            applyPal(this, outPath, imgPal, pal, firstColorIsTransparent)
        })
    } 
}

function openPalettes(spritesFilesPaths: string[]): Promise<Pal[]>{
    return new Promise((resolve, reject)=>{
        const palPromises = spritesFilesPaths.map(x => fsPromise.readFile(x, "utf8"))
        Promise.all(palPromises)
            .then((fileDatas: string[])=>{
                resolve(fileDatas.map(x => readPalFile(x)))
            })
            .catch((err)=>{
                reject(err)
            })
    })
}
export function exportSprites(sprites: SpecieSpriteData[], projectPath: string, outdir: string){
    for (const sprite of sprites){
        const palsFiles = [
            sprite.pal,
            sprite.shinyPal
        ]
        openPalettes(palsFiles)
            .then((pals)=>{
                applyPals(join(projectPath, sprite.front), join(outdir, sprite.specie), pals, true)
                applyPals(join(projectPath, sprite.back), join(outdir, sprite.specie + "_BACK"), pals, true)
            })
            .catch((err)=>{
                logError("Failed in open palette : " + err)
            })
    }
}