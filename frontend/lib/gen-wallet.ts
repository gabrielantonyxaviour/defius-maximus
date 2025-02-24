import { ethers } from "ethers";
import { randomBytes } from "crypto";

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
}

export default async function generateKeypairs(
  saltLength: number = 32
): Promise<GeneratedKeypairs> {
  try {
    // Generate random salt
    const salt = randomBytes(saltLength);

    // Create EVM keypair
    const evmWallet = ethers.Wallet.createRandom();
    const evmKeypair: EVMKeypair = {
      address: evmWallet.address,
      privateKey: evmWallet.privateKey.slice(2),
      publicKey: evmWallet.publicKey,
    };

    return {
      evm: evmKeypair,
    };
  } catch (error) {
    console.error("Error generating keypairs:", error);
    throw error;
  }
}
