const cardano = require("./cardano");

const wallets = ["carteira01","carteira02","carteira03"];

wallets.map((wallet) => {
  console.log("Balanço da carteira: ",wallet)
  const sender = cardano.wallet(wallet);

  console.log(cardano.toAda(sender.balance().value.lovelace));
  console.log("--------------------------")
});
