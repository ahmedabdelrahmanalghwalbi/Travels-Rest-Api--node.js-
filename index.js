const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const tourRouter = require("./routes/tourRoute");
const authRouter = require("./routes/userRoute");
const adminRouter = require("./routes/admin_crud_users");
const reviewRouter = require("./routes/reviewRoute");
const { paymentPaypal,paymentExecute } = require("./middlewares/paypal");

mongoose.connect("mongodb://localhost:27017/tours", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to the data base successfully");
}).catch((ex) => {
    console.log(`failed to connect with the database ${ex}`);
});

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//CORS
app.use((req, res, next) => {
    res.setHeader("Access-Controll-Allow-Orign", "*");
    res.setHeader("Access-Controll-Allow-Methods", "*");
    res.setHeader("Access-Controll-Allow-Headers", "Authorization");
    next();
});

//routes
app.use('/tour', tourRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/review', reviewRouter);
app.get('/pay/:name/:price/:quentity', paymentPaypal);
app.get('/success/:price/:quentity', paymentExecute);

process.on('uncaughtException', (ex) => {
    console.log(`error here ${ex}`);
});
process.on('unhandledRejection', (ex) => {
    console.log(`error 2 here ${ex}`);
})
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `can't find ${req.originalUrl} on this server`
    });
    next();
})


app.listen(8080, () => {
    console.log("server on ...!")
})

