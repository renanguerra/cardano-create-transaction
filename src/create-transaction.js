const cardano = require("./cardano");
const wallets = require("./wallets");

wallets.map((wallet) => {
  const sender = cardano.wallet(wallet);

  console.log(
    "Balance of Sender wallet: " +
      cardano.toAda(sender.balance().value.lovelace) +
      " ADA"
  );

  //  carteira do drop
  const receiver = "addr1qx0h74gvmyxv5ursv5etjzj8yzx42gv8hwdykdduq3tp6vvsjwhkz9y6ma5d3hnel3uux89un0e0sh2hx0825xlszvsqpr45l0";

  //  valor do drop
  const dropValue = 66;

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
