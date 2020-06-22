const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const products = require('../products');
const nodemailer = require('nodemailer');

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
        title: 'Contact Us'
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