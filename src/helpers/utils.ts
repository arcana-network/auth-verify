function percentToByte(p: string) {
  return String.fromCharCode(parseInt(p.slice(1), 16))
}

function byteToPercent(b: string) {
  return `%${`00${b.charCodeAt(0).toString(16)}`.slice(-2)}`
}

/**
 * Encodes a Base64 string. Safe for UTF-8 characters.
 * Original source is from the `universal-base64` NPM package.
 *
 * @source https://github.com/blakeembrey/universal-base64/blob/master/src/browser.ts
 */
function btoaUTF8(str: string) {
  return window.btoa(encodeURIComponent(str).replace(/%[0-9A-F]{2}/g, percentToByte))
}

/**
 * Decodes a Base64 string. Safe for UTF-8 characters.
 * Original source is from the `universal-base64` NPM package.
 *
 * @source https://github.com/blakeembrey/universal-base64/blob/master/src/browser.ts
 */
function atobUTF8(str: string) {
  return decodeURIComponent(Array.from(atob(str), byteToPercent).join(''))
}

/**
 * Given a JSON-serializable object, encode as a Base64 string.
 */
export function encodeJSON(options: JSON) {
  return btoaUTF8(JSON.stringify(options))
}

/**
 * Given a Base64 JSON string, decode a JavaScript object.
 */
export function decodeJSON(queryString: string) {
  return JSON.parse(atobUTF8(queryString))
}

export function cleanUrl() {
  const cleanUrl = window.location.origin + window.location.pathname
  window.history.replaceState(null, '', cleanUrl)
}

export function redirect(url: string) {
  setTimeout(() => (window.location.href = url))
}
