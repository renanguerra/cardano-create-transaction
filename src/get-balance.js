const cardano = require("./cardano");
const wallets = require("./wallets");

wallets.map((wallet) => {
  console.log("Balanço da carteira: ", wallet);
  const sender = cardano.wallet(wallet);

  console.log(cardano.toAda(sender.balance().value.lovelace));
  console.log("--------------------------");
});
