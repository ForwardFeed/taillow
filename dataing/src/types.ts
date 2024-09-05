
export type NestedString = string | string[] | NestedString[]
// this retroactive type often pains to read, but with some examples it's quite simple
const _simple1  : NestedString = ""
const _simple2  : NestedString = ["", ""]
const _complex1 : NestedString = ["", ["", ""]]
const _complex2 : NestedString = ["", "", ["", "", ["", ""]]]


export type StringPacks= Array<string[]>



export enum Delimiter{
    SPACE    = ' ',
    PLUS     = '+',
    MINUS    = '-',
    WILDCARD = '*',
    SLASH    = '/',
    GT       = '>',
    LT       = '<',
    EQUALS   = '=',
    COMMA    = ',',
    SEMICOL  = ';',
    PERCENT  = '%',
    OPNPAR   = '(', // Open Parenthehis
    CLSPAR   = ')', // Close Parenthesis
    OPNBRCK  = '{', // Open Bracket
    CLSBRCK  = '}', // Close Bracket
    OPNABRCK = '[', // Open Angular Bracket
    CLSABRCK = ']', // Close Angulat Bracket
    BOR      = '|',
    BAND     = '&',
    XOR      = '^',
    EXCLAM   = '!',
    QUESTION = '?',
    DD       = ':',
    DOT      = '.',
    ENDLINE  = '\n',
    TAB      = '\t',
    DQUOTE   = '"',
    TILDE    = "~"
}

export enum Operator{
    PLUS     = '+',
    MINUS    = '-',
    WILDCARD = '*',
    SLASH    = '/',
    GT       = '>',
    GTE      = '>=',
    LT       = '<',
    LTE      = '<=',
    EQUALS   = '=',
    DEQUALS  = '==',
    OR       = '||',
    BOR      = '|',
    AND      = '&&',
    BAND     = '&',
    XOR      = '^',
    EXCLAM   = '!',
    
}

export const C_Keywords: Array<string> = [
    "auto",
    "break",
    "case",
    "char", 
    "const",
    "continue",
    "default",
    "do", 
    "double",
    "else",
    "enum",
    "extern", 
    "float",
    "for",
    "goto",
    "if", 
    "int",
    "long",
    "register",
    "return", 
    "short",
    "signed",
    "sizeof",
    "static", 
    "struct",
    "switch",
    "typedef",
    "union", 
    "unsigned",
    "void",
    "volatile",
    "while"
]


export enum PreprocessorDirective{
    DEFINE   = "#define",
    UNDEFINE = "#undef",
    INCLUDE  = "#include",
    IFDEF    = "#ifdef",
    IFNDEF   = "#ifndef",
    IF       = "#if",
    ELSE     = "#else",
    ELIF     = "#elif",
    ENDIF    = "#endif",
    ASSERT   = "#assert"
}

/**
 * Pre-Processing Macros
 */
export type PPMacros = Map<string, string[]>