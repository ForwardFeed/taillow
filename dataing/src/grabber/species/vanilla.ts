import { cPreprocessFileNest2, PProcessorData } from "../../extractor/preprocessor"
import { tokenize } from "../../extractor/tokenizer"
import { extendNestedFilePathWithProjectPath } from "../../extractor/parse_utils"
import { projectPath } from "../../config_handler"
import { logError, logInform } from "../../logging"
import { TokenReader} from "../token_reader"
import { getItemFromMap, resolveNumber, resolveString, sliceLast } from "../utils"
import { Evolution, initSpecieData, LevelUpMove, SpecieData } from "./types"


// buffer variables, care to reset them before use
// but's that on you, can't ask TS to check that
let specie = initSpecieData()
const levelUpMap: Map<string, LevelUpMove[]> = new Map()
const teacheableMap: Map<string, string[]> = new Map()
const eggMovesMap: Map<string, string[]> = new Map()
const formMap: Map<string, string[]> = new Map()

type SpeciesData = SpecieData[]
type Reader = TokenReader<StatesSpecies, SpeciesData>
type StatesSpecies =  "AwaitBegin" | "ParseLevelUpLearnset"| "ParseTeacheable" | "ParseEggMoves" | "form_change_tables" | "ParseSpecies" 

const SpecieStateMap: Record<StatesSpecies, (reader: Reader)=>void> = {
    AwaitBegin: (reader: Reader) => {
        if (reader.tokenToState("sNoneLevelUpLearnset", "ParseLevelUpLearnset")) {
            reader.pushCursor(-4)
        }
    },
    ParseLevelUpLearnset: (r: Reader) => {
        if (r.tokenToState(filesSeparator, "ParseTeacheable"))
            return
        if (r.checkPattern("struct", "LevelUpMove")) {
            r.pushCursor(1)
            const pointer = r.getNextToken()
            levelUpMap.set(pointer, 
                r.parseC().map((x: { level: any; move: any }) => {return {
                    lvl: x.level,
                    move: x.move

                } as LevelUpMove})
            )
        }
    },
    ParseTeacheable: (r: Reader) => {
        if (r.tokenToState(filesSeparator, "ParseEggMoves"))
            return
        if (r.checkPattern("const", "u16")) {
            const pointer = r.peekToken(2)
            teacheableMap.set(pointer, r.parseC())
        }
    },
    ParseEggMoves: function (r: Reader): void {
        if (r.tokenToState(filesSeparator, "form_change_tables")){
            return
        }
        if (r.checkPattern("const", "u16")) {
            const pointer = r.peekToken(2)
            eggMovesMap.set(pointer, r.parseC())
        }
    },
    form_change_tables: function (r: Reader): void {
        if (r.tokenToState(filesSeparator, "ParseSpecies")){
            return
        }
        if (r.checkPattern("struct", "FormChange")) {
            const pointer = r.peekToken(2)
            formMap.set(pointer, r.parseC())
        }
    },
    ParseSpecies: (r: Reader): void => {
        // read to the end of the file 
        if (r.checkPattern("[", undefined, "]", "=")) {
            if (specie.NAME) {
                r.data.push(specie)
            }
            const NAME = r.peekToken(1)
            const obj = r.parseC()
            specie = {
                ...initSpecieData(),
                NAME: NAME,
                name: obj.speciesName,
                baseStats: {
                    hp: resolveNumber(obj.baseHP),
                    atk: resolveNumber(obj.baseAttack),
                    def: resolveNumber(obj.baseDefense),
                    spa: resolveNumber(obj.baseSpAttack),
                    spd: resolveNumber(obj.baseSpDefense),
                    spe: resolveNumber(obj.baseSpeed)
                },
                abilities: obj.abilities,
                types: obj.types,
                description: obj.description,
                evolutions: sliceLast(sliceLast(obj.evolutions)),
                levelupMoves: sliceLast(getItemFromMap(levelUpMap, obj.levelUpLearnset, [], "levelupMoves")),
                tmhm: sliceLast(getItemFromMap(teacheableMap, obj.teachableLearnset, [], "tmhm")),
                eggmoves: sliceLast(getItemFromMap(eggMovesMap, obj.eggMoveLearnset, [], "eggmoves")),
                dimensions: {
                    height: resolveNumber(obj.height),
                    weight: resolveNumber(obj.weight)
                },
                forms: sliceLast(getItemFromMap(formMap, obj.formChangeTable, [], "forms"))

            }
            return
        }
    }
}

const vanillaFileNest = [
    "include/config/species_enabled.h",
    "include/config/pokemon.h", [
        "src/data/pokemon/level_up_learnsets/gen_9.h",
        "src/data/pokemon/teachable_learnsets.h",
        "src/data/pokemon/egg_moves.h",
        "src/data/pokemon/form_change_tables.h",
        "src/data/pokemon/species_info.h", [
            "src/data/pokemon/species_info/gen_1_families.h",
            "src/data/pokemon/species_info/gen_2_families.h",
            "src/data/pokemon/species_info/gen_3_families.h",
            "src/data/pokemon/species_info/gen_4_families.h",
            "src/data/pokemon/species_info/gen_5_families.h",
            "src/data/pokemon/species_info/gen_6_families.h",
            "src/data/pokemon/species_info/gen_7_families.h",
            "src/data/pokemon/species_info/gen_8_families.h",
            "src/data/pokemon/species_info/gen_9_families.h",
        ]
    ]
]
const cInject = `
#define _(A) A
#define DEFAULT(A, B) B
#define COMPOUND_STRING(...) __VA_ARGS__
`
const filesSeparator = "__END_OF_FILE__"
export function getVanillaSpecies(precursor: PProcessorData,finalCb: (speciesData: SpeciesData)=>void){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(vanillaFileNest, projectPath), precursor, cInject, filesSeparator)
    .then((ppmd)=>{
        //console.log(ppmd.str)
        const data = reader(ppmd.str)
        finalCb(data)
    })
    .catch((err)=>{
        logError("getVanillaSpecies text preprocessing: " + err)
    })
    
}

function reader(fileData: string){

    const reader = new TokenReader<StatesSpecies, SpeciesData>({
        tokens: tokenize(fileData),
        stateRec: SpecieStateMap,
        startState: "AwaitBegin",
        data: [],
        name: "species - vanilla",
    })
    return reader.start()
}