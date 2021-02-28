import { useTezos } from "services/beacon/hooks/useTezos";

export const useBalance = () => {
  const { tezos } = useTezos();

  // @TODO: When we start adding FA2 tokens the type of token will change
  const getBalance = async (address: string, token?: string | "XTZ") => {
    try {
      // @TODO: When type of token changes, we want to have this validation to see
      // if we want to call `getBalance` or `balance` method from FA2 token
      if (token === "XTZ") {
        const balance = await tezos.tz.getBalance(address);
        return balance.dividedBy(1e6).toNumber();
      }
    } catch (e) {
      console.log("Error returning balance ", e.message);
      return 0;
    }
  };

  return getBalance;
};
