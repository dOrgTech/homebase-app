import { API_URL } from "..";
import { Network } from "../../beacon/context";

//TODO make DTO for this one
export const getOriginationTime = async (
  contractAddress: string,
  network: Network
): Promise<string> => {
  const url = `${API_URL}/contract/${network}/${contractAddress}/operations`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract operations from BakingBad API");
  }

  const result: any = await response.json();

  return result.operations.find(
    (operation: any) => operation.kind === "origination"
  ).timestamp;
};