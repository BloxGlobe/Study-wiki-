const BAD_WORDS = [
  'badword','idiot','darn','fuck','fucker','shit','bitch','sexy','sex','bitches','motherfucker','ass','sexyass','67'
];

export function containsBadWords(text){
  if (!text) return false;
  const t = String(text).toLowerCase();
  return BAD_WORDS.some(b => t.includes(b));
}

export function sanitizeText(text){
  if (!text) return text;
  let out = String(text);
  BAD_WORDS.forEach(b => {
    const re = new RegExp(b, 'gi');
    out = out.replace(re, '***');
  });
  return out;
}

export default { containsBadWords, sanitizeText };
