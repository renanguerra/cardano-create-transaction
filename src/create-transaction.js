const cardano = require("./cardano");

//carteiras

const wallets = ["carteira01","carteira02","carteira03"];

wallets.map((wallet) => {
  const sender = cardano.wallet(wallet);

  console.log(
    "Balance of Sender wallet: " +
      cardano.toAda(sender.balance().value.lovelace) +
      " ADA"
  );

  //  carteira do drop
  const receiver = "addr1v87y5s3wmp9tte5snqhxngkdmhw8p86zzxn4mh7kthpjchq39zgzj";

  //  valor do drop
  const dropValue = 18;

  const txInfo = {
    txIn: cardano.queryUtxo(sender.paymentAddr),
    txOut: [
      {
        address: sender.paymentAddr,
        value: {
          lovelace:
            sender.balance().value.lovelace - cardano.toLovelace(dropValue),
        },
      },
      {
        address: receiver,
        value: {
          lovelace: cardano.toLovelace(dropValue),
        },
      },
    ],
  };

  const raw = cardano.transactionBuildRaw(txInfo);

  const fee = cardano.transactionCalculateMinFee({
    ...txInfo,
    txBody: raw,
    witnessCount: 1,
  });

  txInfo.txOut[0].value.lovelace -= fee;

  const tx = cardano.transactionBuildRaw({ ...txInfo, fee });

  const txSigned = cardano.transactionSign({
    txBody: tx,
    signingKeys: [sender.payment.skey],
  });

  const txHash = cardano.transactionSubmit(txSigned);

  console.log(txHash);
});
