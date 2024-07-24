import { StringDecoder } from "string_decoder";

export default function sanitize(input) {
  console.log(input)
  const map = {
    '&': '&amp',
    '<':'&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2f'
  };
   
    const reg = /[[&<>"'/]/ig;
    if(input.length==0) {
      console.log('sanitize an empty string')
      return '';
    }
    console.log(input + input.toString())
    console.log(toString(input).replace(reg, (match) => (map[match])))
    return input.toString().replace(reg, (match) => (map[match]))
}