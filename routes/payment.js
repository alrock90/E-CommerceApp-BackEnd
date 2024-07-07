const { Router } = require('express');
const router = Router();
const Stripe = require('stripe');
require('dotenv').config({ path: 'example.env' });
//const stripe = Stripe(stripeSecretKey);
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);




// Ruta para procesar el pago
//app.post('/api/payment', async (req, res) => {
const payment = async (req, res) => {
    const { amount, token } = req.body;

    try {
        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            source: token,
            description: 'Descripción del producto o servicio',
        });

        res.status(200).json({ success: true, charge });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

router.post('/api/payment', payment);

module.exports = router;