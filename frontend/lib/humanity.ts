import { createPublicClient, Hex, http } from "viem";
import { humanityTestnet } from "./utils";

export async function getRegistered(address: Hex): Promise<boolean> {
  const publicClient = createPublicClient({
    chain: humanityTestnet,
    transport: http(),
  });
  return await publicClient.readContract({
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
}

type IsssueCredsParams = {
  address: Hex;
  ip: string;
  chef: string;
  royalty: number;
  chefScore: number;
};

export async function issueCreds(params: IsssueCredsParams) {
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
    return undefined;
  }

  return credential.id;
}

export async function ownsCreds(address: Hex, credId: string): Promise<any> {
  const isRegistered = await getRegistered(address);

  if (!isRegistered) return undefined;
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
    throw new Error("Failed to fetch credentials");
  }
  const verifiedCred = (data as any[]).filter(
    (c: any) => c.credentialSubject.id == credId
  );
  if (verifiedCred.length == 0) return undefined;
  return verifiedCred[0];
}
