// Asegúrate de configurar la dirección del contrato inteligente y la dirección del usuario.
const contractAddress = "CONTRATO_ADDRESS";
const userAddress = "TU_ADDRESS";

const contractABI = []; // Define aquí el ABI del contrato

// Conectar al contrato
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Función para obtener el saldo y dividendos del usuario
async function updateUserInfo() {
    const balance = await contract.methods.userDeposits(userAddress).call();
    const dividends = await contract.methods.userDividends(userAddress).call();
    document.getElementById("balance").textContent = balance;
    document.getElementById("dividends").textContent = dividends;
}

// Función para depositar USDT
async function deposit() {
    const amount = prompt("Ingrese la cantidad de USDT a depositar:");
    if (amount) {
        await contract.methods.deposit(amount).send({ from: userAddress });
        updateUserInfo();
    }
}

// Función para retirar USDT
async function withdraw() {
    await contract.methods.withdraw().send({ from: userAddress });
    updateUserInfo();
}

// Función para reclamar dividendos
async function claimDividends() {
    await contract.methods.claimDividends().send({ from: userAddress });
    updateUserInfo();
}

// Función para retirar dividendos acumulados
async function withdrawDividends() {
    await contract.methods.withdrawDividends().send({ from: userAddress });
    updateUserInfo();
}

// Inicializar la página
updateUserInfo();
