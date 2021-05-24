import { TransferParams } from "..";

export type TreasuryExtraDTO = [
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
      level: 173052;
      timestamp: "2021-05-07T04:37:45Z";
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
      level: 173052;
      timestamp: "2021-05-07T04:37:45Z";
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
        value: "F";
      };
      key_hash: "expruDLFhS5Z5wWdfcPRFopF5rmNfU6Ng3raS7V9w9jex11FU16ao5";
      key_string: "slash_scale_value";
      level: 173052;
      timestamp: "2021-05-07T04:37:45Z";
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
        value: "10000";
      };
      key_hash: "expru9gtnoVVDCRx9ZB8jhvr688wYWKPCHtAEvfbSei2aMLCqyHKo3";
      key_string: "min_xtz_amount";
      level: 173052;
      timestamp: "2021-05-07T04:37:45Z";
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
        value: "100000000";
      };
      key_hash: "exprtpS3eiFbdRb7fHTBtTeLKEpFJqpb1snfeQvi6Erwf4GVMXecc4";
      key_string: "max_xtz_amount";
      level: 173052;
      timestamp: "2021-05-07T04:37:45Z";
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
      level: 173052;
      timestamp: "2021-05-07T04:37:45Z";
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
      level: 173052;
      timestamp: "2021-05-07T04:37:45Z";
    };
    count: 1;
  }
];

export interface TreasuryProposeArgs {
  agoraPostId: number;
  transfers: TransferParams[];
}