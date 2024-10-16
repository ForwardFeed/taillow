import { cPreprocessFileNest2, PProcessorData } from "../../extractor/preprocessor"
import { tokenize } from "../../extractor/tokenizer"
import { extendNestedFilePathWithProjectPath } from "../../extractor/parse_utils"
import { projectPath } from "../../config_handler"
import { logError, logInform, logWarn } from "../../logging"
import { TokenReader} from "../token_reader"
import { getItemFromMap, resolveNumber, resolveString } from "../utils"
import { ErSpecieData, Evolution, initERSpecieData, initSpecieData, LevelUpMove, SpecieData } from "./types"
import { NestedString } from "../../utils"


type speciesData =  Map<string, ErSpecieData>
type Reader = TokenReader<TemplateState, speciesData>

const pokedexTextMap = new Map<string, string>()
const levelUpMap     = new Map<string, LevelUpMove[]>()
const formMap        = new Map<string, string[]>()
const graphicsMap    = new Map<string, string>()

type TemplateState = "AwaitBegin" | "pokedex_text" | "pokedex_entries" | "species_names" |
 "base_stats" | "evolution" | "evolutionForms" | "egg_moves" | "level_up_learnsets" | "level_up_learnset_pointers" |
 "tmhm_learnsets" | "tutor_learnsets" | "form_species_tables" | "form_species_table_pointers"


const XStateMap: Record<TemplateState, (reader: Reader)=>void> = {
    AwaitBegin: (reader: Reader) => {
    },
    base_stats: (r: Reader) => {
        const obj = r.parseC()
        const keys = Object.keys(obj)
        for (const NAME of keys){
            const data = obj[NAME]
            const specie = { 
                NAME: NAME,
                name: "",
                types: [resolveString(data.type1), resolveString(data.type2)],
                abilities: data.abilities?.map((x: string[]) => resolveString(x)),
                baseStats: {
                    hp   : resolveNumber(data.baseHP),
                    atk  : resolveNumber(data.baseAttack),
                    def  : resolveNumber(data.baseDefense),
                    spa  : resolveNumber(data.baseSpAttack),
                    spd  : resolveNumber(data.baseSpDefense),
                    spe  : resolveNumber(data.baseSpeed),
                },
                description: "",
                evolutions: [],
                levelupMoves: [],
                tmhm: [],
                tutors: [],
                eggmoves: [],
                dimensions: {height: 0, weight: 0},
                forms: [],
                innates: data.innates?.map((x: string[]) => resolveString(x)),
                internalID: -1
            }
            r.data.set(NAME, specie)
        }
        r.deactivateStateUntilTrans()
    },
    pokedex_text: (r: Reader): void => {
        if (r.checkPattern("const", "u8")) {
            pokedexTextMap.set(r.peekToken(2), r.multiTokenPattern("=", ";").join(''))
        }
    },
    pokedex_entries: (r: Reader) => {
        const obj = r.parseC()
        const keys = Object.keys(obj)
        for (let NAME of keys){
            const fields = obj[NAME]
            NAME = NAME.replace("NATIONAL_DEX", "SPECIES")
            const specie = getItemFromMap(r.data, NAME, undefined, "pokedex_entries")
            if (!specie)
                continue
            specie.description = getItemFromMap(pokedexTextMap, fields.description?.join(''), "", "pokedex_entries2")
            specie.dimensions = {
                height: fields.height?.join(''),
                weight: fields.weight?.join(''),
            }
        }
        r.deactivateStateUntilTrans()
    },
    species_names: (r: Reader) => {
        const obj = r.parseC()
        const keys = Object.keys(obj)
        for (const NAME of keys){
            const fields = obj[NAME]
            const specie = getItemFromMap(r.data, NAME, undefined, "species_names")
            if (!specie)
                continue
            specie.name = fields.join('')
        }
        r.deactivateStateUntilTrans()
    },
    evolution: (r: Reader) => {
        const obj = r.parseC()
        const keys = Object.keys(obj)
        for (const NAME of keys){
            const fields = obj[NAME]
            const specie = getItemFromMap(r.data, NAME, undefined, "evolution")
            if (!specie)
                continue
            specie.evolutions = fields.map((x: string[][])=>{
                return{
                    kind: x[0].join(''),
                    value: x[1].join(''),
                    into: x[2].join(''), 
                } as Evolution
            })
        }
        r.deactivateStateUntilTrans()
    },
    evolutionForms: (r: Reader) => {
        
    },
    egg_moves: (r: Reader) => {
        if (r.checkPattern('(', undefined, '+', "20000", ")")){
            const NAME = r.getToken(1)
            const moves = r.multiTokenPattern(',', ',')
            if (!r.data.has(NAME)){
                return logWarn("egg_moves: couldn't find specie " + NAME)
            }
            const specie = r.data.get(NAME) as ErSpecieData
            specie.eggmoves = moves
        }
    },
    level_up_learnsets: (r: Reader) => {
        if (r.checkPattern("struct", "LevelUpMove")){
            const pointer = r.getToken(2)
            const obj = r.parseC()
            const sets = obj.map((x: any) => {
                if (x[0] == "LEVEL_UP_END"){
                    return{
                        lvl: "",
                        move: ""
                    }
                }
                return {
                    lvl: x.level.join(''),
                    move: x.move.join('')
                }
            })
            sets.splice(sets.length - 1)
            levelUpMap.set(pointer, sets)
        }
    },
    level_up_learnset_pointers: (r: Reader) => {
        const obj = r.parseC()
        const keys = Object.keys(obj)
        for (const NAME of keys){
            const fields = obj[NAME]
            const specie = getItemFromMap(r.data, NAME, undefined, "level_up_learnset_pointers")
            if (!specie)
                continue
            const sets = getItemFromMap(levelUpMap, fields[0], undefined, "level_up_learnset_pointers2")
            if (!sets)
                continue
            specie.levelupMoves = sets
        }
        r.deactivateStateUntilTrans()
    },
    tmhm_learnsets: (r: Reader) => {
        if (r.checkToken('gTMHMLearnsets')){
            r.pushCursor(4)
        }
        if (r.checkPattern('[', undefined, ']')){
            const NAME = r.getToken(1)
            const moves = r.multiTokenPattern("TMHM_LEARNSET", "TMHM_LEARNSET_END", ["TM", "(", ")"])
            const specie = getItemFromMap(r.data, NAME, undefined, "tmhm_learnsets")
            if (!specie)
                return
            specie.tmhm = moves

        }
    },
    tutor_learnsets: (r: Reader) => {
        if (r.checkToken('gTutorLearnsets')){
            r.pushCursor(4)
        }
        if (r.checkPattern('[', undefined, ']')){
            const NAME = r.getToken(1)
            const moves = r.multiTokenPattern("TUTOR_LEARNSET", "TUTOR_LEARNSET_END", ["TUTOR", "(", ")"])
            const specie = getItemFromMap(r.data, NAME, undefined, "tutor_learnsets")
            if (!specie)
                return
            specie.tutors = moves

        }
    },
    form_species_tables: (r: Reader) => {
        if (r.checkPattern('u16', undefined, '[')){
            const pointer = r.getToken(1)
            const forms = r.multiTokenPattern("{", "FORM_SPECIES_END", [","])
            formMap.set(pointer, forms)
        }
    },
    form_species_table_pointers: (r: Reader) => {
        const obj = r.parseC()
        const keys = Object.keys(obj)
        for (const NAME of keys){
            const fields = obj[NAME]
            const specie = getItemFromMap(r.data, NAME, undefined, "form_species_table_pointers")
            if (!specie)
                continue
            const forms = getItemFromMap(formMap, fields[0], undefined, "form_species_table_pointers2")
            if (!forms)
                continue
            specie.forms = forms
        }
        r.deactivateStateUntilTrans()
    },
}

const speciesFileNets: NestedString = [
    'src/data/pokemon/base_stats.h',
    'src/data/pokemon/pokedex_text.h',
    'src/data/pokemon/pokedex_entries.h', 
    'src/data/text/species_names.h',
    'src/data/pokemon/evolution.h',
    'src/data/pokemon/egg_moves.h',
    'src/data/pokemon/level_up_learnsets.h',
    'src/data/pokemon/level_up_learnset_pointers.h',
    '!src/data/pokemon/tmhm_learnsets.h',
    '!src/data/pokemon/tutor_learnsets.h',
    '!src/data/pokemon/form_species_tables.h',
    'src/data/pokemon/form_species_table_pointers.h',
    'src/data/graphics/pokemon.h',
    'src/data/pokemon_graphics/front_pic_table.h', [
        "#include/constants/species.h"
    ]
]

const cInject = `
#define _(A...) A
#define TM_BIT_FIELD
`
const filesSeparator = "__END_OF_FILE__"

const TransitionsMap: Record<TemplateState, [string, TemplateState] | [string]>= {
    AwaitBegin: ["gBaseStats", "base_stats"],
    base_stats: [filesSeparator, "pokedex_text"],
    pokedex_text: [filesSeparator, "pokedex_entries"],
    pokedex_entries: [filesSeparator, "species_names"],
    species_names: [filesSeparator, "evolution"],
    evolution: ["gFormChangeTable", "evolutionForms"],
    evolutionForms: [filesSeparator, "egg_moves"],
    egg_moves: [filesSeparator, "level_up_learnsets"],
    level_up_learnsets: [filesSeparator, "level_up_learnset_pointers"],
    level_up_learnset_pointers: [filesSeparator, "tmhm_learnsets"],
    tmhm_learnsets: [filesSeparator, "tutor_learnsets"],
    tutor_learnsets: [filesSeparator, "form_species_tables"],
    form_species_tables: [filesSeparator, "form_species_table_pointers"],
    form_species_table_pointers: [filesSeparator],
}

export function getER21Species(precursor: PProcessorData, finalCb: (data: speciesData)=>void){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(speciesFileNets, projectPath), precursor, cInject, filesSeparator)
    .then((fileData)=>{
        const data = reader(fileData.str)
        data.forEach((val, key)=>{
            val.internalID = +(fileData.ppm.has(key) ? fileData.ppm.get(key)?.join() as string : -1)
        })
        finalCb(data)
    })
    .catch((err)=>{
        logError("ER2.1 getting species err: " + err)
    })

}

function reader(fileData: string){
    const reader = new TokenReader<TemplateState, speciesData>({
        tokens: tokenize(fileData),
        stateRec: XStateMap,
        startState: "AwaitBegin",
        data: new Map<string, ErSpecieData>(),
        transRec: TransitionsMap,
        name: "species - er2.1",
    })
    const data = reader.start()
    return data
}
