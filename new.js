// Written by Allen Joseph
// Language used: Javascript

const csv = require("csvtojson");
const fs = require("fs");

const maxBlockWeight = 4000000; // Max Block Weight
const myBlock = []; // Final block array

let i = 0;

class Transaction {
  // Transaction Class
  constructor(tx_id, fee, weight, faw, parents) {
    this.tx_id = tx_id;
    this.fee = fee;
    this.weight = weight;
    this.faw = faw;
    this.parents = parents.split(";");
  }
}

(async () => {
  // Load the mempool
  const mempool = await csv().fromFile("mempool.csv"); // Reading the csv file

  // Reading the mempool as objects
  var Trans = new Array();
  for (i = 0; i < mempool.length; i++) {
    Trans[i] = new Transaction(
      mempool[i].tx_id,
      mempool[i].fee,
      mempool[i].weight,
      mempool[i].fee / mempool[i].weight, // Dividing fee/weight
      mempool[i].parents
    );
  }

  // Sorting the mempool by dividing fee/weight objects
  Trans.sort(function (a, b) {
    return b.faw - a.faw;
  });

  //console.log(Trans);

  var currBlockWeight = 0; // Current Block Weight
  var totalFee = 0; // Current Block Weight
  var totalTrans = 0; // Current Block Weight
  var allParentsDone = 1;

  // Logic to check
  i = 0;

  while (currBlockWeight < maxBlockWeight && i < Trans.length - 1) {
    if (currBlockWeight + parseInt(Trans[i].weight) > maxBlockWeight) {
      i++;
      continue;
    }
    //console.log(Trans[i].parents.length);
    if (Trans[i].parents.length == 1) {
      myBlock.push(Trans[i].tx_id);
      currBlockWeight += parseInt(Trans[i].weight);
      totalFee += parseInt(Trans[i].fee);
      totalTrans++;
      i++;
    } else if (Trans[i].parents) {
      if (myBlock.includes(`${Trans[i].parents}`)) {
        myBlock.push(Trans[i].tx_id);
        currBlockWeight += parseInt(Trans[i].weight);
        totalFee += parseInt(Trans[i].fee);
        totalTrans++;
        i++;
      } else {
        i++;
      }
    }
  }

  // Printhing Total Weight, Fees and Transactions
  console.log("Total Weight:" + currBlockWeight);
  console.log("Total Transactions:" + totalTrans);
  console.log("Total Fee:" + totalFee);

  // Wrtting the transactions to a file named block.txt
  for (i = 0; i < myBlock.length; i++) {
    fs.writeFile(
      "block.txt",
      myBlock[i].toString() + "\r\n",
      {
        flag: "a",
      },
      (err) => {
        if (err) throw err;
      }
    );
  }
})();
