const express = require("express");
const parser = require("body-parser");
// const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(parser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    const first = req.body.firstName;
    const last = req.body.lastName;
    const email = req.body.email;
    const data = {                      // using MailChimp's format of key:value pairs for how data should be accessed/sent
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first,
                    LNAME: last
                }

            }
        ]
    }

    app.post("/failure", (req, res) => {
        res.redirect("/");
    })

    const jsonData = JSON.stringify(data);  // compressing the data to be sent to MailChimp in single line string JSON with stringify method
    const url = "https://us2.api.mailchimp.com/3.0/lists/1fc29fdaae"
    const options = {
        method: "POST",
        auth: "redpanda19:8414125744b28cad371468832e1eee28-us2",      /* auth option from node HTTPS module for basic authentication 
        in the following username:apikey format (username can be anything)*/
    }

    const request = https.request(url, options, (resp) => {             //making a post request to MailChimp API to fetch the data in JSON format afterwards

        if (resp.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }
        resp.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

    console.log(first, last);
})

app.listen(process.env.PORT || 3000, () => {
    console.log("server started at port 3000 sucessfuly");
})

//api key: 8414125744b28cad371468832e1eee28-us2
//audience/list id : 1fc29fdaae