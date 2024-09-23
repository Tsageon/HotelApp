const express = require('express');
const bodyParser = require('body-parser');
const paypal = require('@paypal/checkout-server-sdk');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Configure PayPal SDK
const environment = new paypal.core.SandboxEnvironment('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET');
const client = new paypal.core.PayPalHttpClient(environment);

// Create Order endpoint
app.post('/api/orders', async (req, res) => {
    const { totalprice } = req.body.cart;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: totalprice.toString(), // Convert to string
                breakdown: {
                    item_total: {
                        currency_code: 'USD',
                        value: totalprice.toString() // Convert to string
                    }
                }
            }
        }]
    });

    try {
        const order = await client.execute(request);
        res.status(201).json({ id: order.result.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating PayPal order');
    }
});

// Capture Order endpoint
app.post('/api/orders/:orderId/capture', async (req, res) => {
    const request = new paypal.orders.OrdersCaptureRequest(req.params.orderId);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        res.status(200).json(capture.result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error capturing PayPal order');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
