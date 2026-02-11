import React, { useEffect, useState } from "react";
import axios from "axios";
import SlotCard from "../components/SlotCard";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function Dashboard() {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  // Helper: get auth token headers
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch slots + user booking info
  const fetchSlots = async () => {
    if (!date) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/slots?date=${date}`,
        { headers: getAuthHeader() }
      );
      console.log("slots received:",res.data);
      
      setSlots(res.data);
      // console.log("slots:",slots);
      //(5) [{…}, {…}, {…}, {…}, {…}]0: {_id: '696db8a348fb9406d1066a1d', time: '06:00 AM - 07:00 AM', date: '2026-01-26', bookedCount: 2, __v: 0}1: {_id: '696db8a348fb9406d1066a20', time: '06:00 PM - 07:00 PM', date: '2026-01-26', bookedCount: 2, __v: 0}2: {_id: '696db8a348fb9406d1066a21', time: '07:00 PM - 08:00 PM', date: '2026-01-26', bookedCount: 1, __v: 0}3: {_id: '696db8a348fb9406d1066a1e', time: '07:00 AM - 08:00 AM', date: '2026-01-26', bookedCount: 2, __v: 0}4: {_id: '696db8a348fb9406d1066a1f', time: '05:00 PM - 06:00 PM', date: '2026-01-26', bookedCount: 1, __v: 0}length: 5[[Prototype]]: Array(0)

    } catch (err) {
      console.error("Error fetching slots:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        alert("Failed to load slots. Try again later.");
      }
    }
  };

  // Book a slot
  const handleBook = async (slotId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        { slotId, date },
        { headers: getAuthHeader() }
      );
      if (res.data.success) {
        alert("Slot booked successfully!");
      } else {
        alert(res.data.message || "Booking failed.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed.");
    } finally {
      fetchSlots(); // refresh slots & booking status
    }
  };

  // Cancel booking
  const handleCancel = async (slotId) => {
    try {
      await axios.delete(
        "http://localhost:5000/api/bookings",
        {
          headers: getAuthHeader(),
          data: { slotId, date },
        }
      );
      alert("Booking cancelled successfully!");
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    } finally {
      fetchSlots();
    }
  };

  // Fetch slots when date changes
  useEffect(() => {
    fetchSlots();
  }, [date]);

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("Please log in first!");
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    console.log("Slots updated:", slots);
  }, [slots]);


  // Tomorrow date for datepicker min attr
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold text-primary">
        🏋️‍♂️ Book Your Gym Slot
      </h2>

      <div className="text-center mb-4">
        <label htmlFor="datePicker" className="form-label fw-semibold">
          Select Date:
        </label>
        <input
          id="datePicker"
          type="date"
          className="form-control w-auto d-inline-block mx-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={tomorrowStr}
        />
      </div>

      {date ? (
        <div className="row">
          {slots.length > 0 ? (
            slots.map((slot) => (
              <div
                key={slot._id}
                className="col-md-4 col-sm-6 mb-4 d-flex justify-content-center"
              >
                {/* <SlotCard
                  slot={slot}
                  userHasBooked={slot.userHasBooked}
                  onBook={() => handleBook(slot._id)}
                  onCancel={() => handleCancel(slot._id)}
                /> */}

                <SlotCard
                  slot={slot}
                  userHasBooked={slot.userHasBooked}
                  onBook={() => handleBook(slot._id)}
                  onCancel={() => handleCancel(slot._id)}
                />

              </div>
            ))
          ) : (
            <p className="text-center text-muted">
              No slots available for this date.
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-muted mt-3">
          Please select a date to view available slots.
        </p>
      )}
    </div>
  );
}

export default Dashboard;

