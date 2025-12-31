// mockApi.js
// Simulates backend responses: available rides and fare comparison.
import mockRides from './mockRides.json'

/**
 * Get mock rides near a route
 * @param {Object} query {start, end, time}
 */
export function findRides(query) {
  // naive filter: return rides whose start/end contain same tokens
  const s = (query.start || '').toLowerCase()
  const e = (query.end || '').toLowerCase()
  const matches = mockRides.filter(r => {
    return r.start.toLowerCase().includes(s.split(' ')[0] || '') ||
           r.end.toLowerCase().includes(e.split(' ')[0] || '')
  })
  // sort by overlapScore descending (mock)
  return Promise.resolve(matches)
}

/**
 * Get mock fare estimates from ride-hailing apps
 * Replace with real API calls and server-side secret handling
 */
export function compareFares({start, end}) {
  // return fixed mock results; in production call Uber/Ola APIs server-side
  const distanceKm = 12 // mock
  return Promise.resolve([
    { provider: 'HopInHub Carpool', price: 90, eta: 12, type: 'carpool' },
    { provider: 'Ola Mini', price: 220, eta: 9, type: 'taxi' },
    { provider: 'Uber Go', price: 240, eta: 8, type: 'taxi' },
    { provider: 'Rapido Bike', price: 130, eta: 6, type: 'bike' }
  ])
}
