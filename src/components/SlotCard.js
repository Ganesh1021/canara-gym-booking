import React from "react";
import "./SlotCard.css";

function SlotCard({ slot, onBook, onCancel, userHasBooked }) {
  const isBookDisabled = slot.bookedCount >= 20 || userHasBooked;
  const isCancelDisabled = !userHasBooked;

  return (
    <div
      className={`card shadow-sm text-center p-3 ${
        slot.bookedCount >= 20 ? "border-danger" : "border-success"
      }`}
      style={{ width: "18rem", borderRadius: "15px" }}
    >
      <div className="card-body">
        <h5 className="card-title fw-bold">{slot.time}</h5>

        <p className="card-text">
          {slot.bookedCount}/20 booked
        </p>

        {/* Book Slot Button */}
        <button
          className={`btn me-2 ${isBookDisabled ? "btn-secondary" : "btn-primary"}`}
          onClick={onBook}
          disabled={isBookDisabled}
        >
          {slot.bookedCount >= 20
            ? "Full"
            : userHasBooked
            ? "Already Booked"
            : "Book Slot"}
        </button>

        {/* Cancel Booking Button */}
        <button
          className={`btn ${isCancelDisabled ? "btn-secondary" : "btn-danger"}`}
          onClick={onCancel}
          disabled={isCancelDisabled}
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );
}

export default SlotCard;
