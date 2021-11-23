const cardano = require("./cardano")

const sender = cardano.wallet("firstWallet")

console.log(
    sender.balance()
)