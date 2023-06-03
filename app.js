const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public')); // static folder called 'public' where we have those static files
// change the paths in HTML file relative to this 'public' folder

app.get('/', function(req,res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    // console.log(firstName, lastName, email);
    
    var data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/8caf5062bb";
    const auth1 = "1a8aa0b7";
    const auth2 =  "4ed6fd1b26565f";
    const auth3 =  "216821429d";
    const options = {
        method: "POST",
        auth: "vineet09:"+auth1+auth2+auth3+"-us21"
    }
    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});


// list id
// 8caf5062bb