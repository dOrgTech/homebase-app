import { Network } from "services/beacon/context";
import { getDAOTokenBalances } from "services/bakingBad/tokenBalances";

// If the tests break, verify the test data these constants reference first
const testNetwork: Network = "edo2net";
const testDaoId = "KT1Adh9GASXTqA7NoNjFPjk3M4CChmzgSTu8";

test('Test obtaining token balances and mapping token balances object', async () => {
  const tokenBalances = await getDAOTokenBalances(testDaoId, testNetwork);
  expect(tokenBalances).not.toBeUndefined();
  expect(tokenBalances).not.toBeFalsy();
  expect(tokenBalances).not.toBeNull();
  expect(tokenBalances.length).toBeGreaterThan(0);
});