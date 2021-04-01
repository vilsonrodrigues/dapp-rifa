// ENDEREÇO EHTEREUM DO CONTRATO
var contractAddress = "0x5F408b84B13F470C689311d130396E1dd6Db16B4";

// Inicializa o objeto DApp
document.addEventListener("DOMContentLoaded", onDocumentLoad);
function onDocumentLoad() {
  DApp.init();
}

// Nosso objeto DApp que irá armazenar a instância web3
const DApp = {
  web3: null,
  contracts: {},
  account: null,

  init: function () {
    return DApp.initWeb3();
  },

  // Inicializa o provedor web3
  initWeb3: async function () {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ // Requisita primeiro acesso ao Metamask
          method: "eth_requestAccounts",
        });
        DApp.account = accounts[0];
        window.ethereum.on('accountsChanged', DApp.updateAccount); // Atualiza se o usuário trcar de conta no Metamaslk
      } catch (error) {
        console.error("Usuário negou acesso ao web3!");
        return;
      }
      DApp.web3 = new Web3(window.ethereum);
    } else {
      console.error("Instalar MetaMask!");
      return;
    }
    return DApp.initContract();
  },

  // Atualiza 'DApp.account' para a conta ativa no Metamask
  updateAccount: async function() {
    DApp.account = (await DApp.web3.eth.getAccounts())[0];
    atualizaInterface();
  },

  // Associa ao endereço do seu contrato
  initContract: async function () {
    DApp.contracts.Rifa = new DApp.web3.eth.Contract(abi, contractAddress);
    return DApp.render();
  },

  // Inicializa a interface HTML com os dados obtidos
  render: async function () {
    inicializaInterface();
  },
};


// *** MÉTODOS (de consulta - view) DO CONTRATO ** //

function verRifas() {
  return DApp.contracts.Rifa.methods.verRifas().call({ from: DApp.account });
}

function verGanhador() {
  return DApp.contracts.Rifa.methods.verGanhador().call();
}

function verPreco() {
  return DApp.contracts.Rifa.methods.verPrecoDaRifa().call();
}

function verPremio() {
  return DApp.contracts.Rifa.methods.verPremio().call();
}

function verTotalDeRifas() {
  return DApp.contracts.Rifa.methods.verTotalDeRifas().call();
}

function ehDono() {
  return DApp.contracts.Rifa.methods.isOwner().call({ from: DApp.account });
}

// *** MÉTODOS (de escrita) DO CONTRATO ** //

function comprarRifa() {
  let quant = document.getElementById("quantidade").value;
  let preco = 100000000000000000 * quant;
  return DApp.contracts.Rifa.methods.comprarRifa(quant).send({ from: DApp.account, value: preco }).then(atualizaInterface);;
}

function sortear() {
  return DApp.contracts.Rifa.methods.sortearRifa().send({ from: DApp.account }).then(atualizaInterface);;
}

// *** ATUALIZAÇÃO DO HTML *** //

function inicializaInterface() {
    document.getElementById("btnSortear").onclick = sortear;
    document.getElementById("btnComprar").onclick = comprarRifa;
    atualizaInterface();
    DApp.contracts.Rifa.getPastEvents("RifaComprada", { fromBlock: 0, toBlock: "latest" }).then((result) => registraEventos(result));  
    DApp.contracts.Rifa.events.RifaComprada((error, event) => registraEventos([event]));  
}

function atualizaInterface() {
  verRifas().then((result) => {
    document.getElementById("total-rifas").innerHTML = result;
  });

  verTotalDeRifas().then((result) => {
    document.getElementById("total-geral").innerHTML = result;
  });

  verPremio().then((result) => {
    document.getElementById("premio").innerHTML =
      result / 1000000000000000000 + " ETH";
  });

  verPreco().then((result) => {
    document.getElementById("preco").innerHTML =
      "Preço da Rifa: " + result / 1000000000000000000 + " ETH";
  });

  verGanhador().then((result) => {
    document.getElementById("ganhador").innerHTML = result;
  });

  document.getElementById("endereco").innerHTML = DApp.account;

  document.getElementById("btnSortear").style.display = "none";
  ehDono().then((result) => {
    if (result) {
      document.getElementById("btnSortear").style.display = "block";
    }
  });
}

function registraEventos(eventos) {
  let table = document.getElementById("events");
  eventos.forEach(evento => {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.innerHTML = "<a href='https://ropsten.etherscan.io/address/"+ evento["returnValues"]["comprador"] +"'>" + evento["returnValues"]["comprador"] + "</a>";
    let td2 = document.createElement("td");
    td2.innerHTML = evento["returnValues"]["quant"];
    let td3 = document.createElement("td");  
    td3.innerHTML = "<a href='https://ropsten.etherscan.io/tx/"+ evento["transactionHash"] +"'>" + evento["transactionHash"] + "</a>";
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    table.appendChild(tr);
  });
}
