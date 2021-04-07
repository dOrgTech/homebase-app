export interface OriginatorStorageDTO {
  prim: "pair";
  type: "namedtuple";
  name: "@pair_1";
  children: [
    {
      prim: "address";
      type: "address";
      name: "owner";
      value: string;
    },
    {
      prim: "or";
      type: "namedunion";
      name: "@or_3";
      children: [
        {
          prim: "address";
          type: "address";
          name: "originated";
          value: string;
        }
      ];
    }
  ];
};
