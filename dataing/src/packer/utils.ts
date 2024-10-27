

export function tablize(table: string[], item: string | undefined): number{
    if (item === undefined)
        return -1
    if (!~table.indexOf(item))
        table.push(item)
    return table.indexOf(item)
}

export function upperCaseFirst(word: string): string{
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function Xtox(prefix: string | RegExp, X: string): string{
    return X .replace(prefix, '')
                .toLowerCase().replace(/_/g, ' ')
                .split(' ')
                .map((x)=> upperCaseFirst(x))
                .join(' ')
}