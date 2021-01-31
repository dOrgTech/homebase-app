export type MetadataInfo = {
  ipfs_pin_hash: string;
  metadata: {
    keyvalues: {
      contracts: string;
    };
  };
};

export interface PinnedDataFromPinataDTO {
  count: number;
  rows: MetadataInfo[];
}