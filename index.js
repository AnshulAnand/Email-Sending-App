const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

app.set("view engine", "ejs");

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("form");
});

app.post("/send", (req, res) => {
  // Data to be used by output.ejs
  const Data = {
    name: req.body.Name,
    subject: req.body.Subject,
    body: req.body.Body,
  };

  const mail = `
    <h3>${req.body.Name}</h3>
    <p>${req.body.Subject}</p>
    <p>${req.body.Body}</p>
    <p>This email is sent via nodemailer.</p>
    `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "mail.google.com",
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "emailusedforprojects@gmail.com",
      pass: "spoilerspoiler2022",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: `${req.body.Name} <emailusedforprojects@gmail.com>`, // sender address
    to: req.body.Email, // list of receivers
    subject: req.body.Subject, // Subject line
    text: "Hello world?", // plain text body
    html: mail, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("output", { Data: Data });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running at port ${PORT}`));
