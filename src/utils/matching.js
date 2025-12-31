// utils/matching.js
export function simpleMatchScore(queryStart, queryEnd, rideStart, rideEnd) {
  // very simple token-based heuristic
  const s1 = (queryStart || '').toLowerCase()
  const e1 = (queryEnd || '').toLowerCase()
  const s2 = (rideStart || '').toLowerCase()
  const e2 = (rideEnd || '').toLowerCase()
  let score = 0
  if (s2.includes(s1.split(' ')[0])) score += 0.5
  if (e2.includes(e1.split(' ')[0])) score += 0.4
  return Math.min(1, score)
}
