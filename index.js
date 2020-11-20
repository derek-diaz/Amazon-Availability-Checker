var Product  = require('amazonproductscraper').Product;
const {SID, TOKEN, TO_PHONES, FROM, ITEM, ITEM_PRICE, MSG}  = require('./config');


var sendAlert = function(sendTo) {
    var client = require('twilio')(SID, TOKEN),
        body   = MSG;

    client.messages
        .create({
            to: sendTo,
            body: body,
            from: FROM
        })
        .then(function() {
            console.log('Text alert sent to: ' + sendTo);
        }).done();
};

async function checkAvailability() {
    var item = await new Product(ITEM).init();
    var time = new Date();

    console.log("---------------------------------------------------")
    console.log("Time Stamp:",
        time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    );
    console.log("PRODUCT: ", item.getTitle());
    console.log("AVAILABILITY: ", item.getPrice());
    var isProductAvailable = item.getPrice() === ITEM_PRICE;

    if (isProductAvailable) {
        console.log("ITEM IS IN-STOCK!", item.getPrice());
        TO_PHONES.forEach(p => sendAlert(p));
    } else {
        console.log('Product Not Available, checking again in 1m');
        setTimeout(function() {
            checkAvailability();
        }, 60000);
    }
}

checkAvailability();