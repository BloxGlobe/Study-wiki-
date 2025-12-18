const BAD_WORDS = [
  // general profanity
  'fuck','fucker','fucking','shit','bullshit','bitch','bitches','ass','asshole',
  'motherfucker','mf','wtf','damn','goddamn','crap','piss','pissed',

  // sexual / explicit
  'sex','sexy','sexyass','porn','porno','pornhub','nude','nudes','naked',
  'dick','cock','penis','vagina','pussy','boobs','tits','tit','cum','cumming',
  'ejaculate','orgasm','anal','anus','anus licker','blowjob','handjob',
  'horny','slut','whore','hoe','thot','fetish','bdsm','kink',

  // insults / harassment
  'gay','gayass','retard','idiot','stupid','dumb','moron','loser','trash',
  'badass','bish','bastard','scumbag','pervert','creep','weirdo',

  // abusive phrases
  'kill yourself','kys','die','go die','hate you','i hate you',

  // spam / misc
  '67','xxx','nsfw','onlyfans','link in bio','free sex','free porn',

  // edge cases (keep last)
  ''
];

export function containsBadWords(text){
  if (!text) return false;
  const t = String(text).toLowerCase();
  return BAD_WORDS.some(b => b && t.includes(b));
}

export function sanitizeText(text){
  if (!text) return text;
  let out = String(text);
  BAD_WORDS.forEach(b => {
    if (!b) return;
    const re = new RegExp(b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    out = out.replace(re, '***');
  });
  return out;
}

export default { containsBadWords, sanitizeText };
