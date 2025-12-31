import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import { compareFares, findRides } from '../api/mockApi'
import RideCard from '../components/RideCard'

export default function Results(){
  const loc = useLocation()
  const { pickup = '', destination = '' } = loc.state || {}
  const [fares, setFares] = useState([])
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      const f = await compareFares({start: pickup, end: destination})
      const r = await findRides({start: pickup, end: destination})
      setFares(f)
      setRides(r)
      setLoading(false)
    }
    load()
  }, [pickup, destination])

  if (loading) return <div>Loading options...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Price Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fares.map(f => (
            <div key={f.provider} className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
              <div>
                <div className="font-semibold">{f.provider}</div>
                <div className="text-sm text-gray-500">{f.type} · ETA: {f.eta} mins</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-sky">₹{f.price}</div>
                <button className="mt-2 px-3 py-1 rounded bg-white border">Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Carpool Matches</h2>
        <div className="space-y-3">
          {rides.length ? rides.map(r => <RideCard key={r.id} ride={r} />) : <div className="text-gray-500">No matches found.</div>}
        </div>
      </div>
    </div>
  )
}
