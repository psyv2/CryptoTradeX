const express = require('express');
const app = express();
const cryptoPortfolio = require("../models/registers")

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

router.route('/')
    .get((req, res) => {
        console.log("Register")
        res.send({ msg: "OK" })
    })

    .post(async (req, res) => {
        try {
            console.log("body : - ", req.body)
            const check_Username_available =
                await cryptoPortfolio.findOne({ username: req.body.Choosen_username });
            if (check_Username_available != null) {
                // already tacken
                res.send({
                    error: 1,
                    msg: "Username Not Available"
                })
            }
            else if (req.body.Choosen_username == "") {
                res.send({
                    error: 1,
                    msg: "Username Not valid"
                })
            }
            else {
                // available
                // save to database and update current username


                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'dummycrypto2@gmail.com',
                        pass: 'emegjafppuucwhhj'
                    }
                });


                var mailOptions = {
                    from: 'dummycrypto2@gmail.com',
                    to: req.body.myemail,
                    // to: 'anujsherma21@gmail.com',
                    subject: `Successful registration on CryptoTradex`,
                    html: `Dear <strong style="color: blue;">${ req.body.fname} ${ req.body.lname} </strong> , you have successfully registered on Dummy Crypto platform.
                    <br>

                    Login Credentials are
                    <br>
                    Username :- <strong style="color: red;">${ req.body.Choosen_username}</strong>
                    <br>
                    Password :- <strong style="color: green;">${ req.body.Choosen_password}</strong>
                    <br>
                    <br>
                    Information you submitted
                    <br>
                    Name :-${ req.body.fname} ${ req.body.lname} 
                    <br>
                    Email :- ${req.body.myemail}

                 
                   
                 `,

                };

                const as = await transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('RG Email nahi hua: ');
                        console.log(error.message);

                    } else {
                        console.log('RG Email sent: ' + info.response);
                    }
                });
                const hashedPass = await hashPassword(req.body.Choosen_password);
                console.log("hashed = ",hashedPass)

                const ppp = new cryptoPortfolio({
                    username: req.body.Choosen_username,
                    password: hashedPass,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.myemail,

                    no_of_holdings: 0,
                    available_balance: 10000,
                    total_profit: 0,

                    emailOnOff: "OFF",

                    C_total_invested_value: 0,
                    C_total_current_value: 0,
                    C_portfolio_total_profit: 0,

                    Holding: [],
                    History: [],

                    C_available_balance: 5000,
                    C_total_profit: 0,
                    C_no_of_holdings: 0,

                    contestHolding: [],
                })
                const updating2 = ppp.save();
                console.log("user Registered", req.body.Choosen_username);
                let username1 = req.body.Choosen_username;
                const token = jwt.sign({ username1 }, 'secret-key', { expiresIn: '1h' });
                res.send({
                    error: 0,
                    msg: "Correct",
                    token: token
                })
            }
        }
        catch (er) {
            console.log("error in register :- ", er);
            res.send({
                error: 1,
                msg: "error"
            });
        }
    })





module.exports = router;