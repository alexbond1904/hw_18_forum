export function encodeBase64(password: string) {
    return Buffer.from(password).toString('base64');
}


export function decodeBase64(password: string) {
    return Buffer.from(password, 'base64').toString('utf-8');
}