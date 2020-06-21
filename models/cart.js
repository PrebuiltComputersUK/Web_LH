module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = Math.ceil(((cart.totalPrice * 1.029) + 25.29)) || 0;

    this.add = function(item, ProductID) {
        var cartItem = this.items[ProductID];
        if (!cartItem) {
            cartItem = this.items[ProductID] = { item: item, quantity: 0, Cost: 0 };
        }
        cartItem.quantity++;
        cartItem.Cost = cartItem.item.Cost * cartItem.quantity;
        this.totalItems++;
        this.totalPrice += cartItem.item.Cost;
    };

    this.remove = function(ProductID) {
        this.totalItems -= this.items[ProductID].quantity;
        this.totalPrice -= this.items[ProductID].Cost;
        delete this.items[ProductID];
    };

    this.getItems = function() {
        var arr = [];
        for (var ProductID in this.items) {
            arr.push(this.items[ProductID]);
        }
        return arr;
    };
};