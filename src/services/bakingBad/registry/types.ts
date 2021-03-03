export type RegistryDTO = {
  data: {
    key: {
      prim: "bytes";
      type: "bytes";
      value: string;
    };
    value: {
      prim: "pair";
      type: "namedtuple";
      children: [
        {
          prim: "bytes";
          type: "bytes";
          name: "value";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "affected_proposal_key";
          value: "89a08ae1733bd235a8b194279f358841ae8fda770011834d936082d58b9e4040";
        },
        {
          prim: "timestamp";
          type: "timestamp";
          name: "last_updated";
          value: string;
        }
      ];
    };
    key_hash: "exprtmXa8rtENZU5qB6FGZTgKbcMsnR7E75wiwichGdFm7rZwrA2Ab";
    key_string: "v";
    level: 53624;
    timestamp: "2021-03-02T23:45:49Z";
  };
  count: 1;
}[];

export interface RegistryStorageItem {
  key: string;
  value: string;
  lastUpdated: string;
}
