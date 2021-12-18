const cardano = require("./cardano");

const wallets = ["carteira01","carteira02","carteira03"];

wallets.map((wallet) => {
  console.log("Ultimas transações da carteira: ",wallet)
  const sender = cardano.wallet(wallet);

  const transactions = sender.balance().utxo;

  transactions.map((tx) => {
    const txValue = { ...tx.value };
    console.log(txValue);
  });
  console.log("--------------------------")
});
