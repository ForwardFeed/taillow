
// remove some stuff made for better human readibility to more readable by a parser
export function normalize(str: string): string{
    return str
        // ANTISLASH END OF LINES
        //.replace(/\\\n/g, '')
        // ALL MULTIPLE SPACES TO ONE SPACE
        .replace(/[\t ]+/g, ' ')
}

export function clearEmptyLines(str: string): string{
    return str
        .replace(/\n[\s]{1,}\n/g, '\n')
}