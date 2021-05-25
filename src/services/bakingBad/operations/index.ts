import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";

export const getOriginationTime = async (
  contractAddress: string,
  network: Network
): Promise<string> => {
  const url = `${API_URL}/contract/${network}/${contractAddress}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract info from BakingBad API");
  }

  const result: any = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return result.timestamp;
};
