const csv = require("csvtojson");
const fs = require("fs");

const totalBlockWeight = 4000000;
const myBlock = [];

class Transaction {
  constructor(tx_id, fee, weight, faw, parents) {
    this.tx_id = tx_id;
    this.fee = fee;
    this.weight = weight;
    this.faw = faw;
    this.parents = parents;
  }
}

function isValid(tx_id) {
  for (i = 0; i < block.length; i++) {
    if (block[i].includes(tx_id)) {
      return true;
    } else {
      return false;
    }
  }
}

(async () => {
  // Load the mempool
  const mempool = await csv().fromFile("mempool.csv");

  // Show the mempool
  var Trans = new Array();
  for (i = 0; i < mempool.length; i++) {
    Trans[i] = new Transaction(
      mempool[i].tx_id,
      mempool[i].fee,
      mempool[i].weight,
      mempool[i].fee / mempool[i].weight,
      mempool[i].parents
    );
  }

  Trans.sort(function (a, b) {
    return b.faw - a.faw;
  });
  //console.log(Trans);

  var currBlockWeight = 0;
  var totalFee = 0;
  var totalTrans = 0;

  for (i = 0; i < mempool.length; i++) {
    if (currBlockWeight < totalBlockWeight) {
      if (Trans[i].parents.length > 1) {
        const usingSplit = Trans[i].parents.split(';');
      //  console.log(usingSplit);
        for (n = 0; n < usingSplit.length; n++) {
        for (j = 0; j < myBlock.length; j++) {
          if (myBlock[j] == usingSplit[n]) {
            myBlock.push(Trans[i].tx_id);
            currBlockWeight = currBlockWeight + parseInt(mempool[i].weight);
            totalFee = totalFee + parseInt(mempool[i].fee);
            totalTrans++;
          }
        }
        }
      } else {
        myBlock.push(Trans[i].tx_id);
        currBlockWeight = currBlockWeight + parseInt(mempool[i].weight);
        totalFee = totalFee + parseInt(mempool[i].fee);
        totalTrans++;
      }
    }
  }

  for(i=0;i<myBlock.length;i++){

  fs.writeFile('final.txt', myBlock[i]+"\r\n",     
  {
    flag: "a"
},(err) => { 
      
    // In case of a error throw err. 
    if (err) throw err; 
})
  }

  //console.log(myBlock[i]);

  console.log(totalTrans);
  console.log(currBlockWeight);
  //console.log(myBlock.length);
})();
