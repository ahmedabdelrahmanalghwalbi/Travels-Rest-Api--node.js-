var paypal = require('paypal-rest-sdk');
//sandbox for testing and live for production
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'ATeba3lYWfKFoi7ehv1ewxGQOUC0PLDc4XpBKRnoOSPJh1VKz54VUVlEbfMSsxStgOydCMn1B7ZYU52m',
  'client_secret': 'EKL8XVPdWOy7f9nDUyKnW25fiCIlA0aVXZxB3E7o46tUxIGi3FJu0pt96zcSXziheVZUXPm1k4CqAnK4'
});

exports.paymentPaypal = async (req, res, next) => {
    try {
        const { name, price, quantity } = req.params;
    var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
        },
    //here we add the links if the proccess success to execute it and if the process cancel
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://cancel.url"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": name,
                "sku": "item",
                "price": price,
                "currency": "USD",
                "quantity": quantity
            }]
        },
        "amount": {
            "currency": "USD",
            "total": price*quantity
        },
        "description": "This is the payment description."
    }]
};
paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        console.log("Create Payment Response");
        console.log(payment);
        for (let i = 0; i < payment.links.length; i++){
            if (payment.links[i].rel === "approval_url") {
                res.redirect(payment.links[i].href);
            }
        }
    }
});
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `payment failed ${ex}`
        });
        console.log(ex);
        next();
    }
}

exports.paymentExecute = async (req, res, next) => {
    try {
        const { price, quantity } = req.params;
        //i will use req.booking.isPaied to check if the payment execute and mark the user that he has paied.
        req.booking.isPaied == true;
        var execute_payment_json = {
    "payer_id": req.query.PayerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": price*quantity
        }
    }]
};

var paymentId = req.query.paymentId;
paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
    }
});
    } catch (ex) {
         res.status(400).json({
            status: "fail",
            message: `payment execution failed ${ex}`
        });
        console.log(ex);
        next();
    }
}