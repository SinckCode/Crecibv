/**
 * Recursively merges source into target.
 * Arrays are replaced wholesale (not concatenated) so Firestore
 * socialMedia[] overwrites defaults entirely.
 */
export function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;

  const result = { ...target };

  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(tgtVal, srcVal);
    } else if (srcVal !== undefined) {
      result[key] = srcVal;
    }
  }

  return result;
}
