
export function boolTilNorsk (value) {
  return value ? 'JA' : 'NEI';
}

export function norskTilBool (value) {
  return value ? (value.toLowerCase() === 'ja') : false;
}

export function boolTilStreng (value) {
  if (value === undefined) { return undefined; }
  return value ? 'true' : 'false';
}

export function strengTilBool (value) {
  return value === 'true';
}

export function strengTilInt (value) {
  return parseInt(value, 10) || 0;
}

export function tekstEllerDash(data) {
  return data || '-';
}

export function isEmpty(streng) {
  return streng && streng.length === 0;
}
export function sammensattNavn(fornavn, etternavn) {
  return (isEmpty(fornavn) || isEmpty(etternavn)) ? undefined : `${fornavn} ${etternavn}`;
}
