import { getOriginationTime, getProposalVotes } from "services/bakingBad/operations";
import { Network } from "services/beacon/context";

// If the tests break, verify the test data tese constants reference first
const testContractAddress = "KT1Adh9GASXTqA7NoNjFPjk3M4CChmzgSTu8";
const testProposalAddress = "7e562d21b35171d93c80c56a2d4a18a5f7fadcaf2ee641a4d344950245f88c8c";
const testNetwork: Network = "edo2net";

test('Test obtaining contract origination time', async () => {
  const originationTime = await getOriginationTime(testContractAddress, testNetwork);
  expect(originationTime).not.toBeUndefined();
  expect(originationTime).not.toBeFalsy();
  expect(originationTime).not.toBeNull();
  expect(originationTime).not.toBe("");
});

test('Test obtaining proposal votes and mapping vote objects', async () => {
  const votes = await getProposalVotes(testContractAddress, testNetwork, testProposalAddress);
  expect(votes).not.toBeUndefined();
  expect(votes).not.toBeFalsy();
  expect(votes).not.toBeNull();
  expect(votes.length).toBeGreaterThan(0);
});