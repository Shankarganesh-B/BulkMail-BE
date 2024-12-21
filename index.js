const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://papayadbuser:furiosa555@cluster0.zntvp.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function () {
    console.log("connected to DataBase")
}).catch(function () { console.log("failed to connect with DB") })

const credential = mongoose.model("credential", {}, "bulkmail")



app.post("/sendemail", function (req, res) {

    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        }); new Promise(async function (resolve, reject) {
            try {
                for (i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        { 
                            from: "shankarganeshb08@gmail.com",
                            to: emailList[i],
                            subject: "Checking bulkmail app",
                            text: msg
                        }
                    )
                    console.log("email sent to" + emailList[i])
                }
                resolve("success")
            }
            catch (error) {
                reject("failed")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })
        console.log(data[0].toJSON())
    }).catch(function (error) {
        console.log(error)
    })
    
    // ,
    // function (error, info) {
    //     if (error) {
    //         console.log(error)
    //         res.send(false)
    //     }
    //     else { console.log(info) 
    //         res.send(true)
    //     }
    // }




})



// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);









app.listen(5000, function () {
    console.log("server started...")
})