const cardano = require("./cardano");

//carteiras

const wallets = ["firstWallet"];

// transações por carteira

const transactionForWallets = 4;

wallets.map((wallet) => {
  for (let i = 0; i < transactionForWallets; i++) {
    const sender = cardano.wallet(wallet);

    console.log(
      "Balance of Sender wallet: " +
        cardano.toAda(sender.balance().value.lovelace) +
        " ADA"
    );

    //  carteira do drop
    const receiver =
      "addr1qym5zhd8r9l72ehx4asxqwayd0jsh4ul5rrt7zeyv37r6nhhn9xl6gkx58mszm7rnduz33scdp975zgf58ujjz9huzts6m46j0";

      //  valor do drop
    const dropValue = 1;

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
            // send NFT "ad9c09fa0a62ee42fb9555ef7d7d58e782fa74687a23b62caf3a8025.BerrySpaceGreen": 1
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
  }
});
