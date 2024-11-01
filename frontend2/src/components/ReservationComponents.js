import React, { useState, useEffect } from 'react';

export function ReservationList() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetch('/api/reserves/')
      .then(response => response.json())
      .then(data => setReservations(data))
      .catch(error => console.error('Error fetching reservations:', error));
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Reservations</h2>
      <div className="grid gap-4">
        {reservations.map(reservation => (
          <div key={reservation.id} className="border p-4 rounded">
            <p className="text-lg">Date: {new Date(reservation.date_time).toLocaleString()}</p>
            <p className="text-gray-600">Duration: {reservation.duration} minutes</p>
            <p className="text-gray-600">User ID: {reservation.reservor_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreateReservation() {
  const [userId, setUserId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${userId}/reserves/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date_time: new Date(dateTime).toISOString(),
          duration: parseInt(duration),
        }),
      });

      if (response.ok) {
        setMessage('Reservation created successfully!');
        setDateTime('');
        setDuration('60');
      } else {
        const error = await response.json();
        setMessage(error.detail || 'Failed to create reservation');
      }
    } catch (error) {
      setMessage('Error creating reservation');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Create Reservation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">User ID:</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Date and Time:</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Duration (minutes):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Create Reservation
        </button>
      </form>
      {message && (
        <div className={`mt-4 p-2 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
