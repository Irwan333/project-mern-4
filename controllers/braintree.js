const User = require("../models/user");
const braintree = require("braintree");
const midtransClient = require("midtrans-client");
require("dotenv").config();

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox, // Production
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Create Snap API instance, empty config
// let snap = new midtransClient.Snap();
// snap.apiConfig.set({
//   isProduction: false,
//   serverKey: "SB-Mid-server-HZsFXwZyE6DP8GxlRbkqpevo",
//   clientKey: "SB-Mid-client-msexMfdBqk9kBb7K",
// });

// You don't have to re-set using all the options,
// i.e. set serverKey only
// snap.apiConfig.set({ serverKey: "SB-Mid-server-HZsFXwZyE6DP8GxlRbkqpevo" });

// let parameter = {
//   transaction_details: {
//     order_id: "test-transaction-123",
//     gross_amount: 200000,
//   },
//   credit_card: {
//     secure: true,
//   },
// };

// snap.createTransaction(parameter)
//     .then((transaction)=>{
//         // transaction token
//         let transactionToken = transaction.token;
//         console.log('transactionToken:',transactionToken);
//     })

// alternative way to create transactionToken
// snap.createTransactionToken(parameter)
//     .then((transactionToken)=>{
//         console.log('transactionToken:',transactionToken);
//     })

exports.generateToken = (req, res) => {
  //   snap.createTransaction(parameter).then((transaction) => {
  //     // transaction token
  //     let transactionToken = transaction.token;
  //     console.log("transactionToken:", transactionToken);
  //   });
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  // charge
  let newTransaction = gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.json(result);
      }
    }
  );
};
