const express = require('express');
const router = express.Router();
const fs = require('fs');
const request = require("request");

router.get('/', function(req, res, next) {
    res.render("index", {
        title: "Home, Office, Gaming & Professional Computers",
        products: products,
    });
});

const products = require('../products');

router.get(`/build`, function(req, res, next) {
    const buildFiles = fs.readdirSync('../builds').filter(file => file.endsWith('.js'));
    for (const file of buildFiles) {
        const buildFile = require(`../builds/${file}`);
    }
}); // router

router.get(`/build/:buildName`, function(req, res, next) {

    const builds = require(`../builds/${req.params.buildName}`);

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
    
    function getItems(itemIds) {
        const items = itemIds.map((id) => findById(id));
        return items;
    }
    
    function findById(id) {
        return products.find((product) => product.ProductID === id);
    }
    
    function init(itemIds) {
        const items = getItems(itemIds);
        console.log(items);
        return items;
    }
    
    const items = init([
        builds.mb.Product,
        builds.cpu.Product,
        builds.cooling.Product,
        builds.gpu.Product,
        builds.mem.Product,
        builds.psu.Product,
        builds.case.Product,
        builds.drive1.Product,
        builds.drive2.Product,
        builds.drive3.Product,
        builds.drive4.Product,
        builds.optical.Product,
        builds.accessories.Product,
        builds.fans.Product
    ]);

    res.render('builds', {
        title: builds.title,
        build: builds,
        mb:items[0],cpu:items[1],cooling:items[2],gpu:items[3],
        mem:items[4],psu:items[5],case:items[6],
        drive1:items[7],drive2:items[8],drive3:items[9],drive4:items[10],
        optical:items[11],access:items[12],fans:items[13],
        dateMin: dateMin,
        dateMax: dateMax
    });

}); // router

const Cart = require('../models/cart');

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

router.get('/returns', function(req, res, next) {
    res.render('Returns', {
        title: 'Returns Policy'
    });
});

router.get('/disclaimer', function(req, res, next) {
    res.render('disclaimer', {
        title: 'Disclaimer Policy'
    });
});

router.get('/cookies', function(req, res, next) {
    res.render('cookies', {
        title: 'Cookies Policy'
    });
});

router.get('/home-office', function(req, res, next) {
    res.render('office', {
        title: 'Home/Office Computers'
    });
});

router.get('/gaming', function(req, res, next) {
    res.render('ga', {
        title: 'Gaming Computers'
    });
});

router.get('/workstations', function(req, res, next) {
    res.render('workstation', {
        title: 'Workstations'
    });
});

router.get('/laptops', function(req, res, next) {
    res.render('laptops', {
        title: 'Laptops'
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