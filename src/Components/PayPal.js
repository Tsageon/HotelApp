import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const initialOptions = {
    clientId: "ATwp-NmB8ehhPMPHigRkdZ85dAmLIM51g-_YY0rsRUeRSiaeYVthITPu3fQAxgVbPlgTNdjymAwhkgcT",
    currency: "USD",
    intent: "capture",
};

export default function paypal() {
    return (
        <PayPalScriptProvider options={initialOptions}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <PayPalButtons      
                    style={{
                        layout: 'vertical',
                        color: 'blue',
                        shape: 'rect',
                        label: 'paypal',
                        tagline: false
                    }}
                />
            </div>
        </PayPalScriptProvider>
    );
}