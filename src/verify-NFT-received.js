const cardano = require("./cardano");
const wallets = require("./wallets");

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
