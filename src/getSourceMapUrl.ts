export function getSourceMapUrl(code: string): string | undefined {
  /** Check for both `//` and `/*` comments */
  const match
    = /\/(\/)[#@] *sourceMappingURL=([^\s]+)/.exec(code)
    || /\/(\*)[#@] *sourceMappingURL=((?:[^\s*]|\*[^/])+)(?:[^*]|\*[^/])*\*\//.exec(code)

  return match?.[2]
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it.each([
    '//# sourceMappingURL=data:application/json,{}',
    '//@ sourceMappingURL=data:application/json,{}',
    '/*# sourceMappingURL=data:application/json,{} */',
    '/*@ sourceMappingURL=data:application/json,{} */',
  ])('get source map data uri', (code) => {
    expect(getSourceMapUrl(code)).toBe('data:application/json,{}')
  })

  it('get source map link', () => {
    expect(getSourceMapUrl('//# sourceMappingURL=http://example.com/index.js.map')).toBe('http://example.com/index.js.map')
  })

  it('get source map file name', () => {
    expect(getSourceMapUrl('//# sourceMappingURL=index.js.map')).toBe('index.js.map')
  })
}
