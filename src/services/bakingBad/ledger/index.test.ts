import { Network } from "services/beacon/context";
import { getLedgerAddresses } from "services/bakingBad/ledger";

const testLedgerMapnumber = 1;
const testNetwork: Network = "edo2net";

// TO-DO: Fix fetch running in Jest
test('Test obtaining ledger address and mapping ledger object', async () => {
  const ledger = await getLedgerAddresses(testLedgerMapnumber, testNetwork);
  expect(ledger).resolves.not.toBeUndefined();
  expect(ledger).resolves.not.toBeFalsy();
  expect(ledger).resolves.not.toBeNull();
});