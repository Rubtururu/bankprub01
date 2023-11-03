// Asegúrate de configurar la dirección del contrato inteligente y la dirección del usuario.
const contractAddress = "CONTRATO_ADDRESS";
const userAddress = "TU_ADDRESS";

const contractABI = []; // Define aquí el ABI del contrato

// Conectar al contrato
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Función para obtener el saldo y dividendos del usuario, así como el saldo en las pools
async function updateUserInfoAndPools() {
    const balance = await contract.methods.userDeposits(userAddress).call();
    const dividends = await contract.methods.userDividends(userAddress).call();
    const treasuryBalance = await contract.methods.treasuryPool().call();
    const dividendPool = await contract.methods.dividendPool().call();
    const totalDividendsWithdrawn = await contract.methods.userDividendsWithdrawn(userAddress).call();
    const dailyDistribution = await contract.methods.dailyDistribution().call();
    const userDailyDividends = await contract.methods.getUserDailyDividends(userAddress).call();

    document.getElementById("balance").textContent = balance;
    document.getElementById("dividends").textContent = dividends;
    document.getElementById("treasuryBalance").textContent = treasuryBalance;
    document.getElementById("dividendPool").textContent = dividendPool;
    document.getElementById("totalDividendsWithdrawn").textContent = totalDividendsWithdrawn;
    document.getElementById("dailyDistribution").textContent = dailyDistribution;
    document.getElementById("userDailyDividends").textContent = userDailyDividends;
}

// Función para mostrar el tiempo restante para reclamar dividendos
function updateCountdown() {
    const currentTime = Math.floor(Date.now() / 1000);
    const lastClaimTime = await contract.methods.lastDividendClaim(userAddress).call();
    const timeRemaining = 86400 - (currentTime - lastClaimTime); // 86400 segundos = 24 horas
    if (timeRemaining < 0) {
        document.getElementById("countdown").textContent = "00:00:00";
    } else {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        document.getElementById("countdown").textContent = `${hours}:${minutes}:${seconds}`;
    }
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

// Actualización del tiempo restante y la información del usuario cada segundo
setInterval(() => {
    updateCountdown();
    updateUserInfoAndPools();
}, 1000);

// Inicializar la página
updateUserInfoAndPools();
updateCountdown();
