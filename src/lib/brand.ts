// A brand-system "render": every visual shares the same light, palette and composition,
// only the placement of the two glows varies.
export function brandTileBg(i: number) {
  const a = 20 + ((i * 37) % 60)
  const b = 30 + ((i * 53) % 50)
  return `radial-gradient(80% 90% at ${a}% ${b}%, rgba(2,151,222,.85), transparent 60%),
          radial-gradient(70% 80% at ${100 - a}% ${100 - b}%, rgba(252,115,77,.8), transparent 60%), #02070a`
}
