import { getProposalsDTO } from "services/bakingBad/proposals";
import { dtoToTreasuryProposals } from "services/bakingBad/proposals/mappers";
import { TreasuryProposalsDTO } from "services/bakingBad/proposals/types";
import { Network } from "services/beacon/context";
import { getStorage } from "services/bakingBad/storage";
import { TreasuryDAO } from "services/contracts/baseDAO";
import { TreasuryStorageDTO } from "../storage/types";

// If the tests break, verify the test data tese constants reference first
const testTreasuryContractAddress = "KT1Adh9GASXTqA7NoNjFPjk3M4CChmzgSTu8";
const testNetwork: Network = "edo2net";

test('Test obtaining proposals and mapping treasury proposals', async () => {
  const storageDTO = await getStorage(testTreasuryContractAddress, testNetwork);
  // Ignoring private method restriction to easily setup test data
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const storage = TreasuryDAO.storageMapper(storageDTO as TreasuryStorageDTO);
  const proposals = await getProposalsDTO(storage.proposalsMapNumber, testNetwork);
  const treasuryProposals = dtoToTreasuryProposals(proposals as TreasuryProposalsDTO);
  expect(treasuryProposals).not.toBeUndefined();
  expect(treasuryProposals).not.toBeFalsy();
  expect(treasuryProposals).not.toBeNull();
  expect(treasuryProposals.length).toBeGreaterThan(0);
});
