var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
const products = require('../products');
const nodemailer = require('nodemailer')
var Recaptcha = require('express-recaptcha').RecaptchaV3;
var Recaptcha = new Recaptcha('6LcMpacZAAAAAEXA1g3YmgEubyfa_X5kRvjmKVWA', '6LcMpacZAAAAAMNx000DUQ9Xf5WL5a0JO-omxgQc', {callback:'cb'});

router.get('/', function(req, res, next) {
    res.render("index", {
        title: "Home, Office, Gaming & Professional Computers",
        products: products,
    });
});

router.get('/item/add/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    var product = products.filter(function(item) {
        return item.ProductID == productId;
    });

    cart.add(product[0], productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

router.get('/item/:id', function(req, res, next) {
    var itemproduct = products.filter(function(el) {
        return el.ProductID == req.params.id;
    });
    console.log(itemproduct);
    function deliver(inDays, startingOn) {
        var s, f = 0,
            d;
        if (!inDays) inDays = 0;
        s = !startingOn ? new Date : new Date(startingOn);
        for (var i = 0, n, t = 0, l = inDays; i < l; i++, t += 86400000) {
            n = new Date(s.getTime() + t).getDay();
            if (n === 0 || n === 6) f++;
        }
        d = new Date(s.getTime() + 86400000 * (inDays + f));
        return d.toLocaleDateString();
    }
    var dateMin = deliver(5);
    var dateMax = deliver(7);

    res.render('listing', {
        title: 'Item Listing',
        product: itemproduct,
        dateMin: dateMin,
        dateMax: dateMax
    });
});

router.get('/item/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

router.get('/cart', function(req, res, next) {
    function deliver(inDays, startingOn) {
        var s, f = 0,
            d;
        if (!inDays) inDays = 0;
        s = !startingOn ? new Date : new Date(startingOn);
        for (var i = 0, n, t = 0, l = inDays; i < l; i++, t += 86400000) {
            n = new Date(s.getTime() + t).getDay();
            if (n === 0 || n === 6) f++;
        }
        d = new Date(s.getTime() + 86400000 * (inDays + f));
        return d.toLocaleDateString();
    }
    var dateMin = deliver(5);
    var dateMax = deliver(7);

    if (!req.session.cart) {
        return res.render('cart', {
            title: "Cart is Empty",
            products: null,
            dateMin: dateMin,
            dateMax: dateMax
        });
    }

    var cart = new Cart(req.session.cart);
    res.render('cart', {
        title: 'Cart',
        products: cart.getItems(),
        totalPrice: cart.totalPrice,
        dateMin: dateMin,
        dateMax: dateMax
    });
});

router.get('/contact', function(req, res, next) {
    res.render('contact', {
        title: 'Contact Us',
        captcha: Recaptcha.renderWith({'hl':'en'})
    });
});

router.post('/send-contact', function(req, res, next) {
    const output = `
        <p>This email was sent as proof that the email has been received by contact@prebuiltcomputers.uk and is for your eyes only.</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.prebuiltcomputers.uk',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'contact@prebuiltcomputers.uk',
            pass: 'Eggshells_21'
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"System " <contact@prebuiltcomputers.uk>', // sender address
        to: `contact@prebuiltcomputers.uk`, // list of receivers
        subject: `${req.body.name} has sent a Contact Request.`, // Subject line
        text: '', // plain text body
        html: output // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('contact', {msg:'Email has been sent to contact@prebuiltcomputers.uk.'});
    });
});

router.get('/terms', function(req, res, next) {
    res.render('terms', {
        title: 'Terms and Conditions Policy'
    });
});

router.get('/privacy', function(req, res, next) {
    res.render('privacy', {
        title: 'Privacy Policy'
    });
});

router.get('/desktops', function(req, res, next) {
    res.render('desktops', {
        title: 'Desktop PCs',
        builds: builds
    });
});

router.get('/gaming-desktops', function(req, res, next) {
    res.render('gaming_desktops', {
        title: 'Gaming Desktop PCs'
    });
});

router.get('/workstation', function(req, res, next) {
    res.render('workstation_desktops', {
        title: 'Workstation Desktop PCs'
    });
});

router.get('/laptops', function(req, res, next) {
    var itemproduct = products.filter(function(el) {
        return el.ProductID == req.params.id;
    });
    res.render('laptops', {
        title: 'Laptop PCs'
    });
});

router.get('/accessories', function(req, res, next) {
    res.render('accessories', {
        title: 'Computer Accessories'
    });
});

router.get('/amd', function(req, res, next) {
    res.render('amd-builds', {
        title: 'AMD'
    });
});

router.get('/amd-about', function(req, res, next) {
    res.render('amd-about', {
        title: 'About AMD'
    });
});

router.get('/intel', function(req, res, next) {
    res.render('intel-builds', {
        title: 'Intel'
    });
});

router.get('/intel', function(req, res, next) {
    res.render('intel-about', {
        title: 'About Intel'
    });
});

module.exports = router;