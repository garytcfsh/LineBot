'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const googleSpreadsheet = require("google-spreadsheet");
const {google} = require('googleapis');
const {googleAuth} = require('google-auth-library');

//spreadsheet key is the long id in the sheets URL
//const accountSheet = new googleSpreadsheet('xxx');
const mySheetId = 'xxx';


const ct = xxx;
const cs = xxx;
// create LINE SDK config from env variables
const config = {
    channelAccessToken: ct,
    channelSecret: cs,
};

const myClientSecret = xxx;

//const auth = new googleAuth();
//const oauth2Client = new auth.OAuth2(myClientSecret.installed.client_id,myClientSecret.installed.client_secret, myClientSecret.installed.redirect_uris[0]);

const oauth2Client = new google.auth.OAuth2(myClientSecret.installed.client_id,myClientSecret.installed.client_secret, myClientSecret.installed.redirect_uris[0]);


oauth2Client.credentials = {"access_token":"ya29.GluuBl8UM3IF6vsrShvB4BLy3e3cNmrAljwIU0KzXXlq_ltC1TmAdZ8DxWIpIdyx6N5QAM8KmeCaMbBiVcHKOIw1hbTenpBI7U2rXkMqpXRCD-XWkaYx1EcdE2ig","refresh_token":"1/EKpt-N6nJsdXIypudddM0Zrg8RxfhoyortjmNVwWJxw","scope":"https://www.googleapis.com/auth/spreadsheets.readonly","token_type":"Bearer","expiry_date":1549991934862};

//set userId
const userId_TP = 'xxx';
const userId_MR = 'xxx';


//image url
var randomIndex;
var imageMessage;
var image_TP = [];
var image_MR = [];
var image_together = [];
image_TP[0] = 'https://imgur.com/3n0IZ1b.jpg';
image_TP[1] = 'https://imgur.com/ZCR7Qhc.jpg';
image_TP[2] = 'https://imgur.com/AgpXfVH.jpg';
image_TP[3] = 'https://imgur.com/GbU4dOz.jpg';
image_TP[4] = 'https://imgur.com/42wh5Eu.jpg';
image_TP[5] = 'https://imgur.com/OY5BNmG.jpg';
image_TP[6] = 'https://imgur.com/yyGzAkx.jpg';
image_TP[7] = 'https://imgur.com/lAww11r.jpg';
image_TP[8] = 'https://imgur.com/i26mjXQ.jpg';
image_TP[9] = 'https://imgur.com/r7WYQKO.jpg';
image_TP[10] = 'https://imgur.com/XIQYt9a.jpg';
image_TP[11] = 'https://imgur.com/yyPUg3d.jpg';
image_TP[12] = 'https://imgur.com/iE8YsL3.jpg';
image_TP[13] = 'https://imgur.com/bFJMlec.jpg';
image_TP[14] = 'https://imgur.com/auJ2GaF.jpg';

image_MR[0] = 'https://imgur.com/XzxYbSW.jpg';
image_MR[1] = 'https://imgur.com/2BpRdqX.jpg';
image_MR[2] = 'https://imgur.com/ztgBRa0.jpg';
image_MR[3] = 'https://imgur.com/8xhojjc.jpg';
image_MR[4] = 'https://imgur.com/vPkNyED.jpg';
image_MR[5] = 'https://imgur.com/dM8ODfz.jpg';
image_MR[6] = 'https://imgur.com/mBjWaJJ.jpg';
image_MR[7] = 'https://imgur.com/jvMw0VI.jpg';
image_MR[8] = 'https://imgur.com/ShAKvgb.jpg';
image_MR[9] = 'https://imgur.com/7r5c5jK.jpg';
image_MR[10] = 'https://imgur.com/Tu7cqB7.jpg';


image_together[0] = 'https://imgur.com/021BTSc.jpg';
image_together[1] = 'https://imgur.com/ub3f85Y.jpg';
image_together[2] = 'https://imgur.com/8UE7yOP.jpg';
image_together[3] = 'https://imgur.com/xpDltuw.jpg';
image_together[4] = 'https://imgur.com/VuNIVvM.jpg';
image_together[5] = 'https://imgur.com/AdYqIZj.jpg';
image_together[6] = 'https://imgur.com/e2fqzic.jpg';
image_together[7] = 'https://imgur.com/eGAGpVd.jpg';
image_together[8] = 'https://imgur.com/i0DmGb9.jpg';
image_together[9] = 'https://imgur.com/J6PbRCs.jpg';
image_together[10] = 'https://imgur.com/xoy1owk.jpg';
image_together[11] = 'https://imgur.com/pAiSAeU.jpg';
image_together[12] = 'https://imgur.com/cKp2UUX.jpg';
image_together[13] = 'https://imgur.com/69aRNnr.jpg';
image_together[14] = 'https://imgur.com/1g5lRbZ.jpg';
image_together[15] = 'https://imgur.com/V8gUfNm.jpg';
image_together[16] = 'https://imgur.com/kpB557M.jpg';
image_together[17] = 'https://imgur.com/ruLIZ74.jpg';



//calculate account
var startDate = '20181201';
var endDate = '20181231';
var total = 0;
var total_Da = 0;
var total_Lin = 0;
var Da_to_Lin = 0;//if positive, Da need pay money to Lin

var date = [];
var money = [];
var payer = [];
var check = 0;
var echoCount = 0;
var randomIndexEcho = 5;

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }

    //calculate account
    var mesgArray = [];
    mesgArray = String(event.message.text).split('/');
    if (mesgArray[0] == 'settle') {
        startDate = mesgArray[1];
        endDate = mesgArray[2];

        return funcRead(funcCal, event);
//promise test
//        return client.replyMessage(event.replyToken, DtoL);
//        funcRead.then(funcCal).then(function(){
//            DtoL = { type: 'text', text: String(Da_to_Lin) };
//            startDate = '22222222';
//            return client.replyMessage(event.replyToken, DtoL);
//       });
    }
    
    //reply images
    if (event.message.text == '抽' && event.source.userId == userId_TP)
    {
        randomIndex = Math.random()*100%image_MR.length;
        randomIndex = Math.floor(randomIndex);
        console.log('random index = ', randomIndex);
        imageMessage = { "type": "image", "originalContentUrl": image_MR[randomIndex], "previewImageUrl": image_MR[randomIndex]};
        return client.replyMessage(event.replyToken, imageMessage);
    }
    else if (event.message.text == '抽' && event.source.userId == userId_MR)
    {
        randomIndex = Math.random()*100%image_TP.length;
        randomIndex = Math.floor(randomIndex);
        console.log('random index = ', randomIndex);
        imageMessage = { "type": "image", "originalContentUrl": image_TP[randomIndex], "previewImageUrl": image_TP[randomIndex]};
        return client.replyMessage(event.replyToken, imageMessage);
    }
    else if (event.message.text == '抽抽')
    {
        randomIndex = Math.random()*100%image_together.length;
        randomIndex = Math.floor(randomIndex);
        console.log('random index = ', randomIndex);
        imageMessage = { "type": "image", "originalContentUrl": image_together[randomIndex], "previewImageUrl": image_together[randomIndex]};
        return client.replyMessage(event.replyToken, imageMessage);
    }
    
    
    //decrease the frequence of echoing
    check++;
    if (check == randomIndexEcho)
    {
        check = 0;
        randomIndexEcho = Math.random()*100%20;
        randomIndexEcho = Math.ceil(randomIndexEcho);
        
        // create a echoing text message
        const echo = { type: 'text', text: '好羨慕你們哦\n時時刻刻都想著彼此'};
//        const echo = { type: 'text', text: event.message.text };
        // use reply API
        return client.replyMessage(event.replyToken, echo);
    }
}



/*
var funcRead = new Promise(function(resolve, reject){
    const sheets = google.sheets('v4');
    //get date data
    sheets.spreadsheets.values.get({
        auth: oauth2Client,
        spreadsheetId: mySheetId,
        range: 'B:B'
    }, function (err, response) {
        if (err) {
            console.log('reading error: ' + err);
        }
        date = String(response.data.values).split(',');
//        console.log('reading response: ' + date);
        check++;
        if (check === 3) {
//            callback();
        }
    });
    //get money data
    sheets.spreadsheets.values.get({
        auth: oauth2Client,
        spreadsheetId: mySheetId,
        range: 'E:E'
    }, function (err, response) {
        if (err) {
            console.log('reading error: ' + err);
        }
        money = String(response.data.values).split(',');
//        console.log('reading response: ' + money);
        check++;
        if (check === 3) {
//            callback();
        }
    });
    //get payer data
    sheets.spreadsheets.values.get({
        auth: oauth2Client,
        spreadsheetId: mySheetId,
        range: 'F:F'
    }, function (err, response) {
        if (err) {
            console.log('reading error: ' + err);
        }
        payer = String(response.data.values).split(',');
//        console.log('reading response: ' + payer);
        check++;
        if (check === 3) {
//            callback();
        }
    });
})

function funcCal() {
    var num = date.length;
    for (var i = 1; i < num; i++) {
        if (date[i] >= startDate && date[i] <= endDate) {
            total = total + Number(money[i]);
            if (payer[i][0] == 'D')
                total_Da = total_Da + Number(money[i]);
            if (payer[i][0] == 'L')
                total_Lin = total_Lin + Number(money[i]);
//            console.log(date[i]);
        }
    }
    Da_to_Lin = total_Lin - total / 2;
//    Da_to_Lin = 0;
    

//    console.log(total);
//    console.log(total_Lin);
//    console.log(Da_to_Lin);
    
}
*/


//read account
function funcRead(callback, event) {
    
    const sheets = google.sheets('v4');
    console.log('google.sheets successful');
    //get date data
    sheets.spreadsheets.values.get({
        auth: oauth2Client,
        spreadsheetId: mySheetId,
        range: 'B:B'
    }, function (err, response) {
        if (err) {
            console.log('readinggggg error: ' + err);
        }
        date = String(response.data.values).split(',');
//        console.log('reading response: ' + date);
        check++;
        if (check === 3) {
            return callback(event);
        }
    });
    //get money data
    sheets.spreadsheets.values.get({
        auth: oauth2Client,
        spreadsheetId: mySheetId,
        range: 'E:E'
    }, function (err, response) {
        if (err) {
            console.log('reading error: ' + err);
        }
        money = String(response.data.values).split(',');
//        console.log('reading response: ' + money);
        check++;
        if (check === 3) {
            return callback(event);
        }
    });
    //get payer data
    sheets.spreadsheets.values.get({
        auth: oauth2Client,
        spreadsheetId: mySheetId,
        range: 'F:F'
    }, function (err, response) {
        if (err) {
            console.log('reading error: ' + err);
        }
        payer = String(response.data.values).split(',');
//        console.log('reading response: ' + payer);
        check++;
        if (check === 3) {
            return callback(event);
        }
    });
}

function funcCal(event) {
    console.log('entry funcCal');
    var num = date.length;
    for (var i = 1; i < num; i++) {
        if (date[i] >= startDate && date[i] <= endDate) {
            total = total + Number(money[i]);
            if (payer[i][0] == 'D')
                total_Da = total_Da + Number(money[i]);
            if (payer[i][0] == 'L')
                total_Lin = total_Lin + Number(money[i]);
//            console.log(date[i]);
        }
    }
    Da_to_Lin = total_Lin - total / 2;
    
    check = 0;//reset callback check
    total = 0;//reset ...
    total_Da = 0;//reset ...
    total_Lin = 0;//reset ...

    var DtoL = { type: 'text', text: 'error error' };
    if (Da_to_Lin > 0)
        DtoL = { type: 'text', text: '大大謙給三歲合' + String(Da_to_Lin) };
    else
        DtoL = { type: 'text', text: '三歲合給大大謙' + String(Da_to_Lin*-1) };
        
    return client.replyMessage(event.replyToken, DtoL);
    
    
//    console.log(total);
//    console.log(total_Lin);
//    console.log(Da_to_Lin);
    
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});