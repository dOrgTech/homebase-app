import { Network } from "services/beacon/context";
import { getStorage } from "services/bakingBad/storage";

// If the tests break, verify the test data these constants reference first
const testNetwork: Network = "edo2net";
const testRegistryContractAddress = "KT1QMdCTqzmY4QKHntV1nZEinLPU1GbxUFQu";

test('Test obtaining storage and mapping storage object', async () => {
  const storageDTO = await getStorage(testRegistryContractAddress, testNetwork);
  expect(storageDTO).not.toBeUndefined();
  expect(storageDTO).not.toBeFalsy();
  expect(storageDTO).not.toBeNull();
});