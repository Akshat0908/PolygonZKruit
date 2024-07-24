let provider, signer, userAddress;
const API_BASE_URL = 'http://localhost:3001/api';

const networks = {
    mainnet: {
        chainId: '0x44d',  // 1101 in hex
        chainName: "Polygon zkEVM Mainnet",
        rpcUrls: ["https://zkevm-rpc.com"],
        nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://zkevm.polygonscan.com/"]
    },
    testnet: {
        chainId: '0x98c',  // 2442 in hex
        chainName: "Polygon zkEVM Cardona Testnet",
        rpcUrls: ["https://rpc.cardona.zkevm-rpc.com"],
        nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://cardona-zkevm.polygonscan.com/"]
    }
};

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            document.getElementById('walletAddress').textContent = `Connected: ${userAddress}`;
            document.getElementById('connectWallet').textContent = 'Wallet Connected';
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    } else {
        alert('Please install MetaMask!');
    }
}

async function switchNetwork() {
    if (!provider) {
        alert('Please connect your wallet first.');
        return;
    }

    const networkSelect = document.getElementById('network');
    const selectedNetwork = networks[networkSelect.value];

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: selectedNetwork.chainId }],
        });
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [selectedNetwork],
                });
            } catch (addError) {
                console.error('Failed to add network:', addError);
            }
        } else {
            console.error('Failed to switch network:', switchError);
        }
    }
}

async function fetchJob() {
    const jobId = document.getElementById('jobId').value;
    const networkType = document.getElementById('network').value;
    try {
        const response = await axios.get(`${API_BASE_URL}/job/${jobId}?networkType=${networkType}`);
        const jobDetails = response.data.jobListing;
        document.getElementById('jobDetails').innerHTML = `
            <h3>${jobDetails.title}</h3>
            <p>Company: ${jobDetails.company}</p>
            <p>Location: ${jobDetails.location}</p>
            <p>Salary: ${jobDetails.salary}</p>
            <p>Description: ${jobDetails.description}</p>
            <p>Skills: ${jobDetails.skills.join(', ')}</p>
        `;
    } catch (error) {
        console.error('Error fetching job:', error);
        alert('Error fetching job');
    }
}

async function verifySkills() {
    if (!userAddress) {
        alert('Please connect your wallet first.');
        return;
    }

    const skills = document.getElementById('skills').value.split(',').map(s => s.trim());
    const networkType = document.getElementById('network').value;
    try {
        const response = await axios.post(`${API_BASE_URL}/verify-skills`, 
            { skills, userId: userAddress, networkType }
        );
        const verifiedSkills = response.data.verifiedSkills;
        document.getElementById('skillsVerification').innerHTML = verifiedSkills.map(skill => 
            `<p>${skill.skill}: ${skill.verified ? 'Verified' : 'Not Verified'} (${skill.verificationDate})</p>`
        ).join('');
    } catch (error) {
        console.error('Error verifying skills:', error);
        alert('Error verifying skills');
    }
}

// Laptop animation
function animateLaptop() {
    const laptop = document.getElementById('laptop');
    const screen = document.getElementById('screen');
    laptop.style.transform = laptop.style.transform === 'scale(1.1)' ? 'scale(1)' : 'scale(1.1)';
    screen.style.backgroundColor = 
        screen.style.backgroundColor === 'rgb(130, 71, 229)' ? '#4a4a4a' : '#8247e5';
}

// Dynamic welcome message
function startWelcomeMessageRotation() {
    const welcomeMessages = ['Welcome!', 'Find Your Dream Job!', 'Explore Opportunities!', 'Connect & Grow!'];
    let currentMessage = 0;
    setInterval(() => {
        document.getElementById('screen').textContent = welcomeMessages[currentMessage];
        currentMessage = (currentMessage + 1) % welcomeMessages.length;
    }, 3000);
}

// Add hover effect to sections
function addSectionHoverEffects() {
    document.querySelectorAll('.section').forEach(section => {
        section.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.02)';
        });
        section.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('network').addEventListener('change', switchNetwork);
    document.getElementById('laptop').addEventListener('click', animateLaptop);
    startWelcomeMessageRotation();
    addSectionHoverEffects();
});