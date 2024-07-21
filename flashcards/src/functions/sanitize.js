
export default function sanitize(input) {
  const map = {
    '&': '&amp',
    '<':'&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2f'};

    const reg = /[[&<>"'/]/ig;
    return String.replace(reg, (match) => (map[match]))
}