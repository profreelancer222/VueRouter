import { normalizeLocation } from '../../../src/util/location'

describe('Location utils', () => {
  describe('normalizeLocation', () => {
    it('string', () => {
      const loc = normalizeLocation('/abc?foo=bar&baz=qux#hello')
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/abc')
      expect(loc.hash).toBe('#hello')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({
        foo: 'bar',
        baz: 'qux'
      }))
    })

    it('relative', () => {
      const loc = normalizeLocation('abc?foo=bar&baz=qux#hello', {
        path: '/root/next'
      })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/root/abc')
      expect(loc.hash).toBe('#hello')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({
        foo: 'bar',
        baz: 'qux'
      }))
    })

    it('relative append', () => {
      const loc = normalizeLocation('abc?foo=bar&baz=qux#hello', {
        path: '/root/next'
      }, true)
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/root/next/abc')
      expect(loc.hash).toBe('#hello')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({
        foo: 'bar',
        baz: 'qux'
      }))
    })

    it('relative query & hash', () => {
      const loc = normalizeLocation('?foo=bar&baz=qux#hello', {
        path: '/root/next'
      })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/root/next')
      expect(loc.hash).toBe('#hello')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({
        foo: 'bar',
        baz: 'qux'
      }))
    })

    it('object', () => {
      const loc = normalizeLocation({
        path: '/abc?foo=bar#hello',
        query: { baz: 'qux' },
        hash: 'lol'
      })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/abc')
      expect(loc.hash).toBe('#lol')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({
        foo: 'bar',
        baz: 'qux'
      }))
    })

    it('skip normalized', () => {
      const loc1 = {
        _normalized: true,
        path: '/abc?foo=bar#hello',
        query: { baz: 'qux' },
        hash: 'lol'
      }
      const loc2 = normalizeLocation(loc1)
      expect(loc1).toBe(loc2)
    })
  })
})
