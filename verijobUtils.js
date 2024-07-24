const ethers = require('ethers');

const SKILL_VERIFICATION_CONTRACT_ADDRESS = '0x...'; // Replace with actual contract address
const SKILL_VERIFICATION_ABI = [
    // Add the ABI of your skill verification contract here
];

async function getZkEvmProvider(networkType) {
    const network = networkType === 'mainnet' ? 
        { name: 'zkevm', chainId: 1101 } : 
        { name: 'zkevm-testnet', chainId: 2442 };
    
    const provider = new ethers.JsonRpcProvider(
        networkType === 'mainnet' ? 'https://zkevm-rpc.com' : 'https://rpc.cardona.zkevm-rpc.com',
        network
    );
    return provider;
}

async function verifyUserSkills(skills, userId, networkType) {
    const provider = await getZkEvmProvider(networkType);
    const contract = new ethers.Contract(SKILL_VERIFICATION_CONTRACT_ADDRESS, SKILL_VERIFICATION_ABI, provider);

    const verifiedSkills = [];
    for (const skill of skills) {
        try {
            const isVerified = await contract.verifySkill(userId, skill);
            verifiedSkills.push({
                skill,
                verified: isVerified,
                verificationDate: new Date().toISOString()
            });
        } catch (error) {
            console.error(`Error verifying skill ${skill}:`, error);
            verifiedSkills.push({
                skill,
                verified: false,
                verificationDate: new Date().toISOString()
            });
        }
    }
    return verifiedSkills;
}

async function fetchJobListing(jobUrl, networkType) {
    const provider = await getZkEvmProvider(networkType);
    // In a real implementation, you would fetch this data from a smart contract
    // For now, we'll return mock data
    return {
        id: jobUrl.split('/').pop(),
        title: 'Blockchain Developer',
        description: 'We are looking for an experienced Blockchain Developer...',
        company: 'Web3 Innovations',
        location: 'Remote',
        salary: '$120,000 - $180,000',
        skills: ['Solidity', 'zkEVM', 'Ethereum', 'Smart Contracts']
    };
}

module.exports = {
    verifyUserSkills,
    fetchJobListing
};