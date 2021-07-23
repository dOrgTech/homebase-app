import { MetadataInfo, PinnedDataFromPinataDTO } from "services/pinata/types";
import { getAuthHeader } from "services/pinata/utils";

const pinContractsMetadata = async (): Promise<string | Error> => {
  const URL = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const body = {
    pinataContent: {
      "Homebase-DAOs 2":
        "In order to access the contract addresses please check the metadata",
    },
    pinataMetadata: {
      name: "Homebase DAOs 2",
      keyvalues: {
        contracts: JSON.stringify([]),
      },
    },
  };

  try {
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
    const URL = "https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=Homebase DAOs 2";
    console.log("Querying available information in IPFS");
    const response = await fetch(URL, {
      headers: getAuthHeader(),
    });
    const result: PinnedDataFromPinataDTO = await response.json();
    console.log(result)
    if ("rows" in result && result.rows.length) {
      console.log("Found it! Here's your data: ", result.rows);
      return result.rows.slice(-1)[0];
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

  return Array.from(new Set(metadataToAddresses(metadata)));
};

export const addNewContractToIPFS = async (
  contractAddress: string
): Promise<void | Error> => {
  try {
    const URL = "https://api.pinata.cloud/pinning/hashMetadata";
    const pinnedContractMetadata = await getPinnedMetadata();

    if (pinnedContractMetadata) {
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
      return;
    }

    await pinContractsMetadata();
    await addNewContractToIPFS(contractAddress);
  } catch (e) {
    throw Error(`Error updating pin with new data: ${e.message}`);
  }
};
