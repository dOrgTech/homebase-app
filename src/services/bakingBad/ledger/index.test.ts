import { Network } from "services/beacon/context";
import { getLedgerAddresses } from "services/bakingBad/ledger";

// If the tests break, verify the test data these constants reference first
const testLedgerMapnumber = 1;
const testNetwork: Network = "edo2net";

test('Test obtaining ledger address and mapping ledger object', async () => {
  const ledger = await getLedgerAddresses(testLedgerMapnumber, testNetwork);
  expect(ledger).not.toBeUndefined();
  expect(ledger).not.toBeFalsy();
  expect(ledger).not.toBeNull();
});