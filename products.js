const fs = require("fs");
const Client = require('ftp');
const time = 3600000;
const toExactHour = () => time - (new Date().getTime() % time);

function formatDecimal(val, n) {
    n = n || 2;
    var str = "" + Math.round(parseFloat(val) * Math.pow(10, n));
    while (str.length <= n) {
        str = "0" + str;
    }
    var pt = str.length - n;
    return str.slice(0, pt) + "." + str.slice(pt);
};

function ftpGamma() {
    let ftp = new Client();
    ftp.on('ready', function() {
        console.log("Ready");
        ftp.get('gamma.csv', function(err, stream) {
            if (err) throw err;
            stream.once('close', function() { ftp.end(); });
            stream.pipe(fs.createWriteStream('gamma.csv'));
            fs.stat("gamma.csv", function(err, stats) {
                let WrittenDoc = Date.now();
                console.log(`Successfully written to gamma.csv. at: ${stats.mtime} ${WrittenDoc}`);
                console.log(`Next Write in: ${Math.ceil(toExactHour() / 60000)} minutes`);
            });
        })
    })
    ftp.connect({
        host: '217.35.64.145',
        port: '21',
        user: 'gamma',
        password: '$$VT7624tc'
    })
}

ftpGamma();

setTimeout(function() {
    setInterval(ftpGamma, time);
    ftpGamma();
}, toExactHour());

var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

const papa = require("papaparse");
const request = require("request");

const options = {
    header: true
};

//const dataStream = request.get("https://prebuiltcomputers.uk/gamma.csv");
const parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);

fs.createReadStream("./gamma.csv").pipe(parseStream);
//dataStream.pipe(parseStream);

let products = [];
parseStream.on("data", chunk => {
    //products.push(chunk);
    products.push({
        ProductID: chunk["Product Number"],
        ManufacturerID: chunk["Manufacturer Number"],
        Category: chunk.Category,
        Manufacturer: chunk.Manufacturer,
        Description: chunk.Description,
        Cost: formatDecimal(Math.ceil(chunk.Cost * 1.35), 2),
        Stock: chunk["Stock Level"],
        Details: chunk["Product Details"],
        Specs: chunk.Specification,
        EAN: chunk["EAN Number"],
        Thumbnail: chunk.Thumbnail,
        Image: chunk["Main Image"],
        Weight: chunk.Weight
    });
    try {
        if (fs.existsSync("public/products/images/" + chunk["Product Number"] + ".jpg")) {
            
        } else {
            download(chunk["Main Image"], `public/products/images/` + chunk["Product Number"] + `.jpg`, function() {
                console.log("done " + chunk["Product Number"] + ".jpg");
            });
        }
    } catch (err) {
        console.error(err);
    }
});

parseStream.on("finish", () => {
    console.log(products.length + " items");
});

module.exports = products;