

export function tablize(table: string[], item: string | undefined): number{
    if (item === undefined)
        return -1
    if (!~table.indexOf(item))
        table.push(item)
    return table.indexOf(item)
}