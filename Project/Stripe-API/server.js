const express = require('express');
const stripe = require('stripe')('');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.post('/charge', async (req, res) => {
  try {
    console.log("Entra a charge");
    console.log(req.body);
    let { token, amount } = req.body;
    console.log("token:", token);
    console.log("amount:", amount);
    let charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token.id,
      description: 'Prueba de pago'
    });
    res.status(200).send(charge);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3002, () => {
  console.log('Servidor corriendo en puerto 3002');
});