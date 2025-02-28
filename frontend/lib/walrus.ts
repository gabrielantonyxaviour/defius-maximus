import { createHash } from "crypto";

export async function uploadJsonToWalrus(
  name: string,
  jsonObject: any
): Promise<{ uri: string; hash: string }> {
  // Convert JSON object to string
  const jsonString = JSON.stringify(jsonObject, null, 2);

  // Create a File object from the JSON string
  const file = new File([jsonString], name + ".json", {
    type: "application/json",
  });
  const response = await fetch(
    `https://publisher.walrus-testnet.walrus.space/v1/blobs`,
    {
      method: "PUT",
      body: file,
    }
  );

  const info = await response.json();
  console.log("WALRUS RESPONSE");
  console.log(info);
  const url = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${
    "alreadyCertified" in info
      ? info.alreadyCertified.blobId
      : info.newlyCreated.blobObject.blobId
  }`;
  console.log(url);

  const hash = createHash("sha256")
    .update(JSON.stringify(jsonObject))
    .digest("hex");
  return {
    uri: url,
    hash: hash,
  };
}

export async function uploadImageToWalrus(image: File): Promise<string> {
  const response = await fetch(
    `https://publisher.walrus-testnet.walrus.space/v1/blobs`,
    {
      method: "PUT",
      body: image,
    }
  );

  const info = await response.json();
  console.log("WALRUS RESPONSE");
  console.log(info);

  const url = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${
    "alreadyCertified" in info
      ? info.alreadyCertified.blobId
      : info.newlyCreated.blobObject.blobId
  }`;
  console.log(url);
  return url;
}
