'use strict';

/**
 *
 * PayPal Node JS SDK dependency
 */
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

/**
 *
 * Returns PayPal HTTP client instance with environment that has access
 * credentials context. Use this instance to invoke PayPal APIs, provided the
 * credentials have access.
 */
function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

/**
 *
 * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
 * This sample uses SandboxEnvironment. In production, use LiveEnvironment.
 *
 */
function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID || 'Af4l6MV89841SFWc20VsEvCZxz-gM6Owl2S2pjXqAmG4xQRBG9smAtU5xgjobAKF70DnGb_K63D6XdgT';
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'EDo4L2KuXiy3iYkRP0O3ppn1ABprnCG0aphvt2_JUsLJ1_A1TnviDA33Ip7C19bXBYkaDcEWh8HqQWP3';

    return new checkoutNodeJssdk.core.SandboxEnvironment(
        clientId, clientSecret
    );
}

function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID || 'AUwms2AwgeHsx55D1pqJTm829Q_CsvKA0oUpc3bGbk7R7T1L3xcIgL8gb-xbH4jR4d_2fWcbilGvfCFN';
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'EN-j3hDAixC6TdsjRVAX4BzBnwdR-bPOL0gDEhedk8jfkSLlfckIlZgc8Zjz8Sp1q-a2p5TScyATUImB';

    return new checkoutNodeJssdk.core.LiveEnvironment(
        clientId, clientSecret
    );
}

async function prettyPrint(jsonData, pre = "") {
    let pretty = "";

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    for (let key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            if (isNaN(key))
                pretty += pre + capitalize(key) + ": ";
            else
                pretty += pre + (parseInt(key) + 1) + ": ";
            if (typeof jsonData[key] === "object") {
                pretty += "\n";
                pretty += await prettyPrint(jsonData[key], pre + "    ");
            } else {
                pretty += jsonData[key] + "\n";
            }

        }
    }
    return pretty;
}

module.exports = { client: client, prettyPrint: prettyPrint };