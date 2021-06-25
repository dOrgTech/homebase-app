import BigNumber from "bignumber.js";
import { Ledger, LedgerMap, LedgerDTO } from "services/bakingBad/ledger/types";
import { parseUnits } from "services/contracts/utils";

export const dtoToLedger = (ledgerDTO: LedgerDTO, decimals: number): Ledger => {
  const ledgerMap = ledgerDTO.reduce((prev, dtoItem) => {
    const tokenId = Number(dtoItem.key.nat);
    const address = dtoItem.key.address;
    const balance = parseUnits(new BigNumber(dtoItem.value), decimals);

    const existingLedgerItem = prev[address];

    if (existingLedgerItem) {
      prev[address].balances[tokenId] = balance;
    } else {
      prev[address] = {
        balances: {
          [tokenId]: balance,
        },
      };
    }

    return prev;
  }, {} as LedgerMap);

  return Object.keys(ledgerMap).map((address) => ({
    ...ledgerMap[address],
    address,
  }));
};
