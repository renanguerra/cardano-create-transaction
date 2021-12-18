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
      "addr1q9msndeamvjajjpuy4797nuqtcqugndju8qw3p4dvechgwttfc9eszk67a5t9v3vddjvct4s3s89yrr8wjanvj46qehqhyecka";

    const txInfo = {
      txIn: cardano.queryUtxo(sender.paymentAddr),
      txOut: [
        {
          address: sender.paymentAddr,
          value: {
            lovelace: sender.balance().value.lovelace - (15846497 + 2000000 + 20000000),
          },
        },
        {
          address: receiver,
          value: {
            lovelace: (15846497 + 2000000 + 20000000) ,
            "523433c68bb669f450ed0a51514a47b09aecb705d4ee7e7efe49e3d6.BuddyxCrypties149": 1,
            "e54bcae2e9f4320346636bd9e662cd33a21fcd3a39f1e2ea19f7a0ee.POSS1OneEyedSharky0161": 1,
            '276663aa662470ffdd3bc3f529e2cbe06c6f920e4625c00d3fc2c88f.Weasel578': 1,
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
