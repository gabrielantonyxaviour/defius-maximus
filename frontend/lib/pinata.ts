import { createHash } from "crypto";
import { PinataSDK } from "pinata";

export async function uploadJsonToPinata(
  name: string,
  jsonObject: any
): Promise<{ uri: string; hash: string }> {
  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
  });

  // Convert JSON object to string
  const jsonString = JSON.stringify(jsonObject, null, 2);

  // Create a File object from the JSON string
  const file = new File([jsonString], name + ".json", {
    type: "application/json",
  });

  // Upload to Pinata
  const upload = await pinata.upload.file(file);
  console.log("JSON Upload successful:", upload);
  //   const data = await pinata.gateways.get(upload.cid);
  //   console.log(data);
  const url = await pinata.gateways.createSignedURL({
    cid: upload.cid,
    expires: 99999999999,
  });
  console.log(url);
  const hash = createHash("sha256")
    .update(JSON.stringify(jsonObject))
    .digest("hex");
  return {
    uri: url,
    hash: hash,
  };
}

export async function uploadImageToPinata(image: File): Promise<string> {
  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
  });

  const upload = await pinata.upload.file(image);
  console.log("JSON Upload successful:", upload);
  //   const data = await pinata.gateways.get(upload.cid);
  //   console.log(data);
  const url = await pinata.gateways.createSignedURL({
    cid: upload.cid,
    expires: 99999999999,
  });
  console.log(url);
  return url;
}
