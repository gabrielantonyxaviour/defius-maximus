import { createPublicClient, Hex, http } from "viem";
import { humanityTestnet } from "./utils";

export async function getRegistered(address: Hex): Promise<boolean> {
  console.log(`Checking registration for address: ${address}`);
  const publicClient = createPublicClient({
    chain: humanityTestnet,
    transport: http(),
  });
  const result = await publicClient.readContract({
    address: "0x96c33CE8A28F76f24B83b156828A65Ccd0452CE7",
    abi: [
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "isRegistered",
        outputs: [{ internalType: "bool", name: "registered", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "isRegistered",
    args: [address],
  });
  console.log(`Registration status for address ${address}: ${result}`);
  return result;
}

type IsssueCredsParams = {
  address: Hex;
  ip: string;
  chef: string;
  royalty: number;
  chef_score: number;
};

export async function issueCreds(params: IsssueCredsParams) {
  console.log(`Issuing credentials for address: ${params.address}`);
  const response = await fetch(
    "https://issuer.humanity.org/credentials/issue",
    {
      method: "POST",
      headers: {
        "X-API-Token": process.env.HUMANITY_PROTOCOL || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject_address: params.address,
        claims: params,
      }),
    }
  );
  const { credential } = await response.json();
  if (!credential) {
    console.log(`Failed to issue credentials for address: ${params.address}`);
    return undefined;
  }

  console.log(
    `Issued credential ID: ${credential.id} for address: ${params.address}`
  );
  return credential.id;
}

export async function ownsCreds(address: Hex, credId: string): Promise<any> {
  console.log(
    `Checking ownership of credential ID: ${credId} for address: ${address}`
  );
  const isRegistered = await getRegistered(address);

  if (!isRegistered) {
    console.log(`Address ${address} is not registered`);
    return undefined;
  }
  const response = await fetch(
    `https://issuer.humanity.org/credentials/list?holderDid=did:ethr:${address}`,
    {
      method: "GET",
      headers: {
        "X-API-Token": process.env.HUMANITY_PROTOCOL || "",
        "Content-Type": "application/json",
      },
    }
  );
  const { data } = await response.json();
  if (!data) {
    console.log(`Failed to fetch credentials for address: ${address}`);
    throw new Error("Failed to fetch credentials");
  }
  const verifiedCred = (data as any[]).filter(
    (c: any) => c.credentialSubject.id == credId
  );
  if (verifiedCred.length == 0) {
    console.log(
      `No credentials found with ID: ${credId} for address: ${address}`
    );
    return undefined;
  }
  console.log(`Found credential with ID: ${credId} for address: ${address}`);
  return verifiedCred[0];
}
