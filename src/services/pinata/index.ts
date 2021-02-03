import { MetadataInfo, PinnedDataFromPinataDTO } from "./types";
import { getAuthHeader } from "./utils";

const pinContractsMetadata = async (): Promise<string | Error> => {
  const URL = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const body = {
    pinataContent: {
      "Homebase-DAOs":
        "In order to access the contract addresses please check the metadata",
    },
    pinataMetadata: {
      name: "Homebase DAOs",
      keyvalues: {
        contracts: JSON.stringify([]),
      },
    },
  };

  try {
    console.log("Creating pin...");

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    throw Error(`Error creating pin in Pinata: ${error.message}`);
  }
};

export const getPinnedMetadata = async (): Promise<
  MetadataInfo | undefined
> => {
  try {
    const URL = "https://api.pinata.cloud/data/pinList?status=pinned";
    console.log("Querying available information in IPFS");
    const response = await fetch(URL, {
      headers: getAuthHeader(),
    });
    const result: PinnedDataFromPinataDTO = await response.json();
    if ("rows" in result && result.rows.length) {
      console.log("Found it! Here's your data: ", result.rows[0]);
      return result.rows[0];
    }
    return undefined;
  } catch (e) {
    throw Error(`Error querying the pinned data: ${e.message}`);
  }
};

export const metadataToAddresses = (
  pinnedContractMetadata: MetadataInfo
): string[] => {
  const addresses: string[] = JSON.parse(
    pinnedContractMetadata.metadata.keyvalues.contracts
  );

  return addresses;
};

export const getContractsAddresses = async (): Promise<string[]> => {
  const metadata = await getPinnedMetadata();

  if (!metadata) {
    return [];
  }

  return metadataToAddresses(metadata);
};

export const addNewContractToIPFS = async (
  contractAddress: string
): Promise<void | Error> => {
  try {
    const URL = "https://api.pinata.cloud/pinning/hashMetadata";

    console.log("Checking if there's a pin already to map contract addresses");
    const pinnedContractMetadata = await getPinnedMetadata();

    if (pinnedContractMetadata) {
      console.log("We have a pin! Let's add the new contract");
      const addresses = metadataToAddresses(pinnedContractMetadata);

      addresses.push(contractAddress);
      const body = {
        ipfsPinHash: pinnedContractMetadata.ipfs_pin_hash,
        keyvalues: {
          contracts: JSON.stringify(addresses),
        },
      };
      await fetch(URL, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      console.log("Content updated");
      return;
    }
    console.log("There's no pin yet, lets create it :-)");
    const hash = await pinContractsMetadata();
    console.log("You pin hash is ", hash);
    await addNewContractToIPFS(contractAddress);
  } catch (e) {
    throw Error(`Error updating pin with new data: ${e.message}`);
  }
};
