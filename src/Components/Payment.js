import Paypal from "../Components/PayPal";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomDetails, startDate, endDate, guests, totalprice } = location.state || {};
    
    if (!roomDetails || !startDate || !endDate || !guests || !totalprice) {
        return (
            <div className="error-message">
                <p>Reservation details are missing.Go back to reserve a room.</p>
                <button onClick={() => navigate("/reserve")}>Back to Reserve</button>
            </div>
        );
    }

    const durationInDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;

    return (
        <div className="payment-container">
            <h2>Complete your payment</h2>
            <h3>Details</h3>
            <p>Room:{roomDetails.roomName}</p>
            <p>Duration: {durationInDays} day(s)</p>
            <p>Guests: {guests}</p>
            <p>Total Price: R{totalprice}</p>
            <Paypal />  
           </div>
        );
};

export default Payment;