/**
 * City names vary wildly in length, so the place line steps down a size rather
 * than wrapping or truncating. Thresholds are character counts, which track
 * rendered width closely enough on the fixed reference canvas.
 */
const LONG_PLACE_CHARS = 18
const VERY_LONG_PLACE_CHARS = 28

export function getPlaceSizeClass(place: string): string {
  const length = place.trim().length
  if (length > VERY_LONG_PLACE_CHARS) return 'is-very-long'
  if (length > LONG_PLACE_CHARS) return 'is-long'

  return ''
}
