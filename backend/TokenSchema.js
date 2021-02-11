const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    id:  String,
    symbol: String,
    name:   String,
    image: Object,
    market_data: {
        current_price:Object,
        price_change_24h: Number,
        price_change_percentage_24h: Number,
        price_change_percentage_7d: Number,
        price_change_percentage_14d: Number,
        price_change_percentage_30d: Number,
        price_change_percentage_60d: Number,
        price_change_percentage_200d: Number,
        price_change_percentage_1y: Number
    }
});

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token