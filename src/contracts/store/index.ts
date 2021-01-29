import { JWT } from "./keys.json";

export const pinContractAddress = async () => {
  const URL = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ first: "a" }),
  });
  const result = await response.json();
  console.log(result);
};

export const getPinnedJSON = async () => {
  try {
    const URL = "https://api.pinata.cloud/data/pinList";
    const response = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });
    const result = await response.json();

    console.log(result);
  } catch (e) {}
};
