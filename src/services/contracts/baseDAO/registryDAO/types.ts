import { Extra, TransferParams } from "..";

export interface RegistryItem {
  key: string;
  value: string;
}

export interface RegistryExtra extends Extra {
  registry: {
    key: string;
    value: string;
  }[]
}

export interface RegistryProposeArgs {
  transfer_proposal: {
    transfers: TransferParams[];
    registry_diff: RegistryItem[];
  };
  agoraPostId: number;
}

export type RegistryExtraDTO = [
  {
    data: {
      key: {
        prim: "string";
        type: "string";
        name: "@string_8";
        value: "registry";
      };
      value: {
        prim: "bytes";
        type: "bytes";
        name: "@bytes_9";
        value: "{ {} }";
      };
      key_hash: "exprvRcR3Cm2kosqwzqaBDjR3ryxxtrdGheJcrZNHGb97ciQZLjmy2";
      key_string: "registry";
      level: 173064;
      timestamp: "2021-05-07T04:44:33Z";
    };
    count: 1;
  },
  {
    data: {
      key: {
        prim: "string";
        type: "string";
        name: "@string_8";
        value: "proposal_receivers";
      };
      value: {
        prim: "bytes";
        type: "bytes";
        name: "@bytes_9";
        value: "{ {} }";
      };
      key_hash: "exprvGLpp88E6LLPiMexuYNpDi1sUzJ1P7XWQKW9Mnx866ZUgBWxWG";
      key_string: "proposal_receivers";
      level: 173064;
      timestamp: "2021-05-07T04:44:33Z";
    };
    count: 1;
  },
  {
    data: {
      key: {
        prim: "string";
        type: "string";
        name: "@string_8";
        value: "max_proposal_size";
      };
      value: {
        prim: "bytes";
        type: "bytes";
        name: "@bytes_9";
        value: "%\u0000";
      };
      key_hash: "exprvEJC172fMCDDBBB38GavfnPBXcp5ZJnP4skfQAw7DwEVVCK82K";
      key_string: "max_proposal_size";
      level: 173064;
      timestamp: "2021-05-07T04:44:33Z";
    };
    count: 1;
  },
  {
    data: {
      key: {
        prim: "string";
        type: "string";
        name: "@string_8";
        value: "registry_affected";
      };
      value: {
        prim: "bytes";
        type: "bytes";
        name: "@bytes_9";
        value: "{ {} }";
      };
      key_hash: "exprucktJnB8NWESBXCGSndVq5NCGSZYEBJtrdBABH2Pj6ETuiwWwd";
      key_string: "registry_affected";
      level: 173064;
      timestamp: "2021-05-07T04:44:33Z";
    };
    count: 1;
  },
  {
    data: {
      key: {
        prim: "string";
        type: "string";
        name: "@string_8";
        value: "frozen_extra_value";
      };
      value: {
        prim: "bytes";
        type: "bytes";
        name: "@bytes_9";
        value: "5";
      };
      key_hash: "expruE4XAPWaDWMBA6AmSi8FnCSAJjCCJATSmBMbnUmieqwgQV1WoE";
      key_string: "frozen_extra_value";
      level: 173064;
      timestamp: "2021-05-07T04:44:33Z";
    };
    count: 1;
  },
  {
    data: {
      key: {
        prim: "string";
        type: "string";
        name: "@string_8";
        value: "slash_scale_value";
      };
      value: {
        prim: "bytes";
        type: "bytes";
        name: "@bytes_9";
        value: "G";
      };
      key_hash: "expruDLFhS5Z5wWdfcPRFopF5rmNfU6Ng3raS7V9w9jex11FU16ao5";
      key_string: "slash_scale_value";
      level: 173064;
      timestamp: "2021-05-07T04:44:33Z";
    };
    count: 1;
  },
  {
    data: {
      key: {
        prim: "string";
        type: "string";
        name: "@string_8";
        value: "min_xtz_amount";
      };
      value: {
        prim: "bytes";
        type: "bytes";
        name: "@bytes_9";
        value: "0";
      };
      key_hash: "expru9gtnoVVDCRx9ZB8jhvr688wYWKPCHtAEvfbSei2aMLCqyHKo3";
      key_string: "min_xtz_amount";
      level: 173064;
      timestamp: "2021-05-07T04:44:33Z";
    };
    count: 1;
  },
  {
    data: {
      key: {
        prim: "string";
        type: "string";
        name: "@string_8";
        value: "max_xtz_amount";
      };
      value: {
        prim: "bytes";
        type: "bytes";
        name: "@bytes_9";
        value: "0";
      };
      key_hash: "exprtpS3eiFbdRb7fHTBtTeLKEpFJqpb1snfeQvi6Erwf4GVMXecc4";
      key_string: "max_xtz_amount";
      level: 173064;
      timestamp: "2021-05-07T04:44:33Z";
    };
    count: 1;
  },
  {
    data: {
      key: {
        prim: "string";
        type: "string";
        name: "@string_8";
        value: "frozen_scale_value";
      };
      value: {
        prim: "bytes";
        type: "bytes";
        name: "@bytes_9";
        value: "0";
      };
      key_hash: "exprtextRC1PHYnJYFZ8QDdRYTdR1PC1aEMFyjMjehAytHgwTqr1mH";
      key_string: "frozen_scale_value";
      level: 173064;
      timestamp: "2021-05-07T04:44:33Z";
    };
    count: 1;
  },
  {
    data: {
      key: {
        prim: "string";
        type: "string";
        name: "@string_8";
        value: "slash_division_value";
      };
      value: {
        prim: "bytes";
        type: "bytes";
        name: "@bytes_9";
        value: "100";
      };
      key_hash: "exprtevAuptvU9Bw6HFVB7yCAUygSW4oLV454647xqEmTar5hVzzQ3";
      key_string: "slash_division_value";
      level: 173064;
      timestamp: "2021-05-07T04:44:33Z";
    };
    count: 1;
  }
];

export interface PMXTZTransferType {
  xtz_transfer_type: {
    amount: string;
    recipient: string;
  };
}

export interface PMFA2TransferType {
  contract_address: string;
  transfer_list: [
    {
      from_: string;
      txs: [
        {
          to_: string;
          token_id: string;
          amount: string;
        }
      ];
    }
  ];
}

export interface PMTreasuryProposal {
  agora_post_id: "0";
  transfers: (PMXTZTransferType | PMFA2TransferType)[];
}

export interface PMRegistryProposal {
  "0": {
    agora_post_id: string;
    registry_diff: 
      {
        "0": string;
        "1": string;
      }[]
    ;
    transfers: (PMXTZTransferType | PMFA2TransferType)[];
  }
}

export type ProposalMetadata = PMTreasuryProposal | PMRegistryProposal;
