import { Network } from "services/beacon/context";
import { API_URL } from "..";
import { OriginatorStorageDTO } from "./types";

const MAX_COUNTER = 8;

export const getOriginatedAddress = async (
  contractAddress: string,
  network: Network
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let counter = 0;

    const poll = async () => {
      const url = `${API_URL}/contract/${network}/${contractAddress}/storage`;

      const response = await fetch(url);
    
      if (!response.ok) {
        throw new Error("Failed to fetch originator contract storage from BakingBad API");
      }
    
      const result = await response.json();
    
      const originatorDTO = result[0] as OriginatorStorageDTO;

      const originatedAddress = originatorDTO.children[1].children[0].value

      if(originatedAddress) {
        resolve(originatedAddress)
      } else if(counter < MAX_COUNTER) {
        setTimeout(() => {
          counter = counter + 1;
          poll()
        }, 10000)
      } else {
        reject("Reached maximum polling time and could not get originated address")
      }
    }

    poll()
  })
  
};