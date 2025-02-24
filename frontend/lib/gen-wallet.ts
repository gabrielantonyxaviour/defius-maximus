import { ethers } from 'ethers';
import { Keypair } from '@solana/web3.js';
import { randomBytes } from 'crypto';

interface EVMKeypair {
    address: string;
    privateKey: string;
    publicKey: string;
}

interface SolanaKeypair {
    publicKey: string;
    privateKey: string;
}

interface GeneratedKeypairs {
    evm: EVMKeypair;
    solana: SolanaKeypair;
}

export default async function generateKeypairs(saltLength: number = 32): Promise<GeneratedKeypairs> {
    try {
        // Generate random salt
        const salt = randomBytes(saltLength);

        // Create EVM keypair
        const evmWallet = ethers.Wallet.createRandom();
        const evmKeypair: EVMKeypair = {
            address: evmWallet.address,
            privateKey: evmWallet.privateKey.slice(2),
            publicKey: evmWallet.publicKey
        };

        // Create Solana keypair using the salt
        const solanaSeed = Uint8Array.from(salt);
        const solanaKeypair = Keypair.fromSeed(solanaSeed);

        return {
            evm: evmKeypair,
            solana: {
                publicKey: solanaKeypair.publicKey.toString(),
                privateKey: Buffer.from(solanaKeypair.secretKey).toString('hex')
            }
        };
    } catch (error) {
        console.error('Error generating keypairs:', error);
        throw error;
    }
}