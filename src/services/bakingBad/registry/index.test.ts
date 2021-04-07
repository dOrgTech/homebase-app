import { Network } from "services/beacon/context";
import { getRegistry } from "services/bakingBad/registry";
import { RegistryStorageDTO, RegistryStorage } from "services/bakingBad/storage/types";
import { getStorage } from "services/bakingBad/storage";
import { RegistryDAO } from "services/contracts/baseDAO";

// If the tests break, verify the test data these constants reference first
const testNetwork: Network = "edo2net";
const testRegistryContractAddress = "KT1QMdCTqzmY4QKHntV1nZEinLPU1GbxUFQu";

let registryStorage: RegistryStorage;
beforeAll(async () => {
  const registryStorageDTO = await getStorage(testRegistryContractAddress, testNetwork);
  // Ignoring private method restriction to easily setup test data
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  registryStorage = RegistryDAO.storageMapper(registryStorageDTO as RegistryStorageDTO);
  return;
});

test('Test obtaining registry and mapping registry object', async () => {
  const registryStorageItem = await getRegistry(registryStorage.registryMapNumber, testNetwork);
  expect(registryStorageItem).not.toBeUndefined();
  expect(registryStorageItem).not.toBeFalsy();
  expect(registryStorageItem).not.toBeNull();
  expect(registryStorageItem.length).toBeGreaterThan(0);
});