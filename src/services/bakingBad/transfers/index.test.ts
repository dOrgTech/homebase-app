import { Network } from "services/beacon/context";
import { getDAOTransfers } from "services/bakingBad/transfers";

// If the tests break, verify the test data these constants reference first
const testNetwork: Network = "edo2net";
const testDaoId = "KT1Adh9GASXTqA7NoNjFPjk3M4CChmzgSTu8";

test('Test obtaining DAO transfers and mapping DAO transfers object', async () => {
  const transfers = await getDAOTransfers(testDaoId, testNetwork);
  expect(transfers).not.toBeUndefined();
  expect(transfers).not.toBeFalsy();
  expect(transfers).not.toBeNull();
  expect(transfers.length).toBeGreaterThan(0);
});