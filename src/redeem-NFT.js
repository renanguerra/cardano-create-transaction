const cardano = require("./cardano");

const readline = require("readline");
let resp = "";

const leitor = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

leitor.question("Para confirmar digite SIM: \n", function (answer) {
  resp = answer;
  if (resp === "SIM") {
    // carteira com o NFT
    const sender = cardano.wallet("carteira01");

    console.log(
      "Balance of Sender wallet: " +
        cardano.toAda(sender.balance().value.lovelace) +
        " ADA"
    );

    // carteira para onde vai o NFT
    const receiver =
      "addr1qyhakpc88d6gtxu3yh3zakc7h7xg5304twht7rwdyn6zp5v32datq2ygeu46ldhyyefr2j69p5t0aaa98h7rq70l232q6qzn8e";

    const txInfo = {
      txIn: cardano.queryUtxo(sender.paymentAddr),
      txOut: [
        {
          address: sender.paymentAddr,
          value: {
            lovelace: sender.balance().value.lovelace  - 2000000,
          },
        },
        {
          address: receiver,
          value: {
            lovelace: 2000000,
            '46f96dbed1e14d3fe1ca8ed08e7db2f848b50769b51ebf6547728ba2.WoodCastleWLS10584': 1,
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
  } else {
    console.log("----------------------");
    console.log("Cancelado");
  }
  leitor.close();
});
