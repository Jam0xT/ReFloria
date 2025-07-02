export function encode(msg: Object): string {
    return JSON.stringify(msg)
}

export function decode(buffer: ArrayBuffer): Object {
    console.log(buffer)
    return JSON.parse(buffer)
}