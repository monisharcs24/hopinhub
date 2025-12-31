import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function RideCard({ride}) {
  const nav = useNavigate()
  return (
    <div className="bg-white rounded-md shadow p-4 flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">{ride.driver} · {ride.start} → {ride.end}</div>
        <div className="text-sm text-gray-500">Departure: {new Date(ride.departure).toLocaleString()}</div>
        <div className="text-sm text-gray-500">Seats: {ride.seats} · Overlap: {Math.round(ride.overlapScore*100)}%</div>
      </div>
      <div className="text-right">
        <div className="font-bold text-sky">₹{ride.pricePerSeat}</div>
        <button onClick={() => nav(`/carpool/${ride.id}`)} className="mt-3 px-4 py-2 bg-eco text-white rounded-md">Hop In</button>
      </div>
    </div>
  )
}
