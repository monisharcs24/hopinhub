import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import mockRides from '../api/mockRides.json'

export default function Carpool(){
  const { rideId } = useParams()
  const nav = useNavigate()
  const ride = mockRides.find(r => r.id === rideId)
  if (!ride) return <div>Ride not found</div>

  function handleJoin(){
    // In real app: send booking request to backend
    alert(`Requested to join ${ride.driver}'s ride. Contact via chat once confirmed.`)
    nav(`/chat/${ride.id}`)
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Carpool: {ride.driver}</h2>
      <p className="text-gray-600 mb-4">{ride.start} → {ride.end} · Departure: {new Date(ride.departure).toLocaleString()}</p>
      <p className="mb-4">Seats available: {ride.seats} · Price per seat: ₹{ride.pricePerSeat}</p>
      <button onClick={handleJoin} className="px-5 py-3 bg-eco text-white rounded-md">Hop In</button>
    </div>
  )
}
