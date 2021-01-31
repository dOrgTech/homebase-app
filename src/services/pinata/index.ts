import { TezosToolkit } from "@taquito/taquito";
import { tzip16, View } from "@taquito/tzip16";
import { JWT } from "./keys.json";
import { TreasuryStorage } from "./types";

type MetadataInfo = {
  ipfs_pin_hash: string;
  metadata: {
    keyvalues: {
      contracts: string;
    };
  };
};
interface PinnedDataFromPinataDTO {
  count: number;
  rows: MetadataInfo[];
}

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
        Authorization: `Bearer ${JWT}`,
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
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
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

export const getContractsAddresses = (
  pinnedContractMetadata: MetadataInfo
): string[] => {
  const addresses: string[] = JSON.parse(
    pinnedContractMetadata.metadata.keyvalues.contracts
  );

  return addresses;
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
      const addresses = getContractsAddresses(pinnedContractMetadata);

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
          Authorization: `Bearer ${JWT}`,
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

export const getDAOInfoFromContract = async (
  contractAddress: string,
  tezos: TezosToolkit
) => {
  console.log("RAN");
  const contract = await tezos.wallet.at(contractAddress, tzip16);

  const metadata = await contract.tzip16().getMetadata();
  const storage: TreasuryStorage = await contract.storage();

  storage.ledger.get()

  console.log(metadata, storage);
};
