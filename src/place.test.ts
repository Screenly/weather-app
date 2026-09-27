import { describe, expect, test } from 'bun:test'
import { getPlaceSizeClass } from './place'

describe('getPlaceSizeClass', () => {
  test('leaves an ordinary city at the full size', () => {
    expect(getPlaceSizeClass('Berlin, DE')).toBe('')
    expect(getPlaceSizeClass('a'.repeat(18))).toBe('')
  })

  test('steps down for a long name', () => {
    expect(getPlaceSizeClass('Mountain View, US')).toBe('')
    expect(getPlaceSizeClass('a'.repeat(19))).toBe('is-long')
    expect(getPlaceSizeClass('a'.repeat(28))).toBe('is-long')
  })

  test('steps down again for a very long name', () => {
    expect(getPlaceSizeClass('a'.repeat(29))).toBe('is-very-long')
    expect(getPlaceSizeClass('Llanfairpwllgwyngyllgogerychwyrndrobwll')).toBe(
      'is-very-long',
    )
  })

  test('ignores surrounding whitespace', () => {
    expect(getPlaceSizeClass('  Berlin, DE  ')).toBe('')
  })
})
