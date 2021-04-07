import { getProposalsDTO } from "services/bakingBad/proposals";
import { dtoToTreasuryProposals, dtoToRegistryProposals } from "services/bakingBad/proposals/mappers";
import { TreasuryProposalsDTO, RegistryProposalsDTO } from "services/bakingBad/proposals/types";
import { Network } from "services/beacon/context";
import { getStorage } from "services/bakingBad/storage";
import { TreasuryDAO, RegistryDAO } from "services/contracts/baseDAO";
import { TreasuryStorageDTO, RegistryStorageDTO, TreasuryStorage, RegistryStorage } from "services/bakingBad/storage/types";

// If the tests break, verify the test data these constants reference first
const testTreasuryContractAddress = "KT1Adh9GASXTqA7NoNjFPjk3M4CChmzgSTu8";
const testRegistryContractAddress = "KT1QMdCTqzmY4QKHntV1nZEinLPU1GbxUFQu";
const testNetwork: Network = "edo2net";

let treasuryStorage: TreasuryStorage;
let registryStorage: RegistryStorage;
beforeAll(async () => {
  const treasuryStorageDTO = await getStorage(testTreasuryContractAddress, testNetwork);
  // Ignoring private method restriction to easily setup test data
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  treasuryStorage = TreasuryDAO.storageMapper(treasuryStorageDTO as TreasuryStorageDTO);
  const registryStorageDTO = await getStorage(testRegistryContractAddress, testNetwork);
  // Ignoring private method restriction to easily setup test data
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  registryStorage = RegistryDAO.storageMapper(registryStorageDTO as RegistryStorageDTO);
  return;
});


test('Test obtaining proposals and mapping treasury proposals', async () => {
  const proposals = await getProposalsDTO(treasuryStorage.proposalsMapNumber, testNetwork);
  const treasuryProposals = dtoToTreasuryProposals(proposals as TreasuryProposalsDTO);
  expect(treasuryProposals).not.toBeUndefined();
  expect(treasuryProposals).not.toBeFalsy();
  expect(treasuryProposals).not.toBeNull();
  expect(treasuryProposals.length).toBeGreaterThan(0);
});

test('Test obtaining proposals and mapping registry proposals', async () => {

  const proposals = await getProposalsDTO(registryStorage.proposalsMapNumber, testNetwork);
  const registryProposals = dtoToRegistryProposals(proposals as RegistryProposalsDTO);
  expect(registryProposals).not.toBeUndefined();
  expect(registryProposals).not.toBeFalsy();
  expect(registryProposals).not.toBeNull();
  expect(registryProposals.length).toBeGreaterThan(0);
});
