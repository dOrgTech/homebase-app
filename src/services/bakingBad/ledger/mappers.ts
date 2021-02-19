import { Ledger, LedgerMap, LedgerDTO } from "services/bakingBad/ledger/types";

export const dtoToLedger = (ledgerDTO: LedgerDTO): Ledger => {
  const ledgerMap = ledgerDTO.reduce((prev, dtoItem) => {
    const tokenId = Number(dtoItem.data.key.children[1].value);
    const address = dtoItem.data.key.children[0].value.toLowerCase();
    const balance = Number(dtoItem.data.value.value);

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
