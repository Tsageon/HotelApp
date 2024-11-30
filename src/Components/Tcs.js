import React, { useState } from "react";
import "./Tcs.css";

const TermsAndConditions = ({ onAgree }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAgree = () => {
    setIsAgreed(true);
    onAgree();
    closeModal();
  };

  return (
    <div className="tcs-container">
      <button
        className={`tcs-button ${isAgreed ? "tcs-agreed" : ""}`}
        onClick={openModal}
      >
        {isAgreed ? "Agreed" : "T&Cs and CS"}
      </button>

      {isModalOpen && (
        <div className="tcs-modal">
          <div className="tcs-modal-content">
            <h2>Terms & Conditions</h2>
            <p>
              Welcome to [Hotel Name]! Please read our Terms and Conditions
              carefully before booking or using our services. These terms
              outline your rights and responsibilities when using our website
              or making a reservation.
            </p>
            <ul>
              <li>Guests must check in with valid ID and a reservation number.</li>
              <li>Bookings are subject to availability and may be canceled if payment is not completed.</li>
              <li>Pets are allowed only in designated rooms with prior notification.</li>
              <li>Check-in time is 3 PM, and check-out time is 11 AM.</li>
              <li>All services are subject to our cancellation policy.</li>
            </ul>
            <p>
              By proceeding, you agree to abide by these terms. For full
              details, contact us or refer to our website's policies page.
            </p>
            <button className="tcs-close-btn" onClick={closeModal}>
              Close
            </button>
            <button className="tcs-agree-btn" onClick={handleAgree}>
              I Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsAndConditions;
