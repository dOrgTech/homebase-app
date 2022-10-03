import { stringToHex } from "services/contracts/utils"
import { MetadataParams } from "services/contracts/metadataCarrier/types"

export const setMetadataJSON = ({
  description,
  authors,
  template,
  frozenToken: { name: fName, symbol: fSymbol, decimals: fDecimals },
  unfrozenToken: { name: uName, symbol: uSymbol, decimals: uDecimals }
}: MetadataParams): Record<string, any> => ({
  homepage: "https://github.com/tqtezos/baseDAO",
  name: uName,
  description,
  authors,
  template,
  interfaces: ["TZIP-12", "TZIP-17"],
  views: [
    {
      implementations: [
        {
          michelsonStorageView: {
            returnType: {
              prim: "nat"
            },
            code: [
              {
                prim: "DUP"
              },
              {
                prim: "CAR"
              },
              {
                args: [
                  [
                    {
                      prim: "CDR"
                    },
                    {
                      prim: "CAR"
                    },
                    {
                      prim: "CAR"
                    },
                    {
                      prim: "CAR"
                    }
                  ]
                ],
                prim: "DIP"
              },
              {
                prim: "GET"
              },
              {
                args: [
                  [
                    {
                      args: [
                        {
                          prim: "nat"
                        },
                        {
                          int: "0"
                        }
                      ],
                      prim: "PUSH"
                    }
                  ],
                  []
                ],
                prim: "IF_NONE"
              }
            ],
            parameter: {
              args: [
                {
                  prim: "address",
                  annots: ["%owner"]
                },
                {
                  prim: "nat",
                  annots: ["%token_id"]
                }
              ],
              prim: "pair"
            }
          }
        }
      ],
      name: "get_balance",
      pure: true,
      description: "Get balance of an address according to TZIP-12."
    },
    {
      implementations: [
        {
          michelsonStorageView: {
            returnType: {
              args: [
                {
                  prim: "nat"
                }
              ],
              prim: "list"
            },
            code: [
              {
                prim: "DROP"
              },
              {
                args: [
                  {
                    args: [
                      {
                        prim: "nat"
                      }
                    ],
                    prim: "list"
                  },
                  [
                    {
                      int: "0"
                    },
                    {
                      int: "1"
                    }
                  ]
                ],
                prim: "PUSH"
              }
            ]
          }
        }
      ],
      name: "all_tokens",
      pure: true,
      description: "Get all supported tokens according to TZIP-12."
    },
    {
      implementations: [
        {
          michelsonStorageView: {
            returnType: {
              prim: "bool"
            },
            code: [
              {
                prim: "DUP"
              },
              {
                prim: "CAR"
              },
              {
                args: [
                  [
                    {
                      prim: "CDR"
                    }
                  ]
                ],
                prim: "DIP"
              },
              {
                prim: "DUP"
              },
              {
                prim: "CDR"
              },
              {
                prim: "CDR"
              },
              {
                args: [
                  [
                    {
                      prim: "DUP"
                    },
                    {
                      prim: "CDR"
                    },
                    {
                      prim: "CAR"
                    },
                    {
                      args: [
                        [
                          {
                            prim: "CAR"
                          }
                        ]
                      ],
                      prim: "DIP"
                    }
                  ]
                ],
                prim: "DIP"
              },
              {
                prim: "DUP"
              },
              {
                prim: "INT"
              },
              {
                prim: "EQ"
              },
              {
                args: [
                  [
                    {
                      prim: "DROP"
                    }
                  ],
                  [
                    {
                      prim: "DUP"
                    },
                    {
                      args: [
                        {
                          prim: "nat"
                        },
                        {
                          int: "1"
                        }
                      ],
                      prim: "PUSH"
                    },
                    {
                      prim: "COMPARE"
                    },
                    {
                      prim: "EQ"
                    },
                    {
                      args: [
                        [
                          {
                            args: [
                              {
                                prim: "string"
                              },
                              {
                                string: "OPERATION_PROHIBITED"
                              }
                            ],
                            prim: "PUSH"
                          },
                          {
                            prim: "FAILWITH"
                          }
                        ],
                        [
                          {
                            prim: "UNIT"
                          },
                          {
                            args: [
                              {
                                prim: "string"
                              },
                              {
                                string: "FA2_TOKEN_UNDEFINED"
                              }
                            ],
                            prim: "PUSH"
                          },
                          {
                            prim: "PAIR"
                          },
                          {
                            prim: "FAILWITH"
                          }
                        ]
                      ],
                      prim: "IF"
                    }
                  ]
                ],
                prim: "IF"
              },
              {
                prim: "SWAP"
              },
              {
                prim: "PAIR"
              },
              {
                args: [
                  [
                    {
                      prim: "CAR"
                    },
                    {
                      prim: "CAR"
                    },
                    {
                      prim: "CDR"
                    },
                    {
                      prim: "CAR"
                    }
                  ]
                ],
                prim: "DIP"
              },
              {
                prim: "MEM"
              }
            ],
            parameter: {
              args: [
                {
                  prim: "address",
                  annots: ["%owner"]
                },
                {
                  args: [
                    {
                      prim: "address",
                      annots: ["%operator"]
                    },
                    {
                      prim: "nat",
                      annots: ["%token_id"]
                    }
                  ],
                  prim: "pair"
                }
              ],
              prim: "pair"
            }
          }
        }
      ],
      name: "is_operator",
      pure: true,
      description:
        "Checks whether given address is allowed to transfer given tokens that belong to given owner - according to TZIP-12."
    },
    {
      implementations: [
        {
          michelsonStorageView: {
            returnType: {
              args: [
                {
                  prim: "nat"
                },
                {
                  args: [
                    {
                      prim: "string"
                    },
                    {
                      prim: "bytes"
                    }
                  ],
                  prim: "map"
                }
              ],
              prim: "pair"
            },
            code: [
              {
                prim: "DUP"
              },
              {
                prim: "CAR"
              },
              {
                args: [
                  [
                    {
                      prim: "CDR"
                    },
                    {
                      prim: "DROP"
                    },
                    {
                      args: [
                        {
                          args: [
                            {
                              prim: "nat"
                            },
                            {
                              args: [
                                {
                                  prim: "string"
                                },
                                {
                                  prim: "bytes"
                                }
                              ],
                              prim: "map"
                            }
                          ],
                          prim: "map"
                        },
                        [
                          {
                            args: [
                              {
                                int: "0"
                              },
                              [
                                {
                                  args: [
                                    {
                                      string: "decimals"
                                    },
                                    {
                                      bytes: stringToHex(uDecimals.toString())
                                    }
                                  ],
                                  prim: "Elt"
                                },
                                {
                                  args: [
                                    {
                                      string: "name"
                                    },
                                    {
                                      bytes: stringToHex(uName)
                                    }
                                  ],
                                  prim: "Elt"
                                },
                                {
                                  args: [
                                    {
                                      string: "symbol"
                                    },
                                    {
                                      bytes: stringToHex(uSymbol)
                                    }
                                  ],
                                  prim: "Elt"
                                }
                              ]
                            ],
                            prim: "Elt"
                          },
                          {
                            args: [
                              {
                                int: "1"
                              },
                              [
                                {
                                  args: [
                                    {
                                      string: "decimals"
                                    },
                                    {
                                      bytes: stringToHex(fDecimals.toString())
                                    }
                                  ],
                                  prim: "Elt"
                                },
                                {
                                  args: [
                                    {
                                      string: "name"
                                    },
                                    {
                                      bytes: stringToHex(fName)
                                    }
                                  ],
                                  prim: "Elt"
                                },
                                {
                                  args: [
                                    {
                                      string: "symbol"
                                    },
                                    {
                                      bytes: stringToHex(fSymbol)
                                    }
                                  ],
                                  prim: "Elt"
                                }
                              ]
                            ],
                            prim: "Elt"
                          }
                        ]
                      ],
                      prim: "PUSH"
                    }
                  ]
                ],
                prim: "DIP"
              },
              {
                prim: "DUP"
              },
              {
                args: [
                  [
                    {
                      prim: "GET"
                    },
                    {
                      args: [
                        [
                          {
                            prim: "UNIT"
                          },
                          {
                            args: [
                              {
                                prim: "string"
                              },
                              {
                                string: "FA2_TOKEN_UNDEFINED"
                              }
                            ],
                            prim: "PUSH"
                          },
                          {
                            prim: "PAIR"
                          },
                          {
                            prim: "FAILWITH"
                          }
                        ],
                        []
                      ],
                      prim: "IF_NONE"
                    }
                  ]
                ],
                prim: "DIP"
              },
              {
                prim: "PAIR"
              }
            ],
            parameter: {
              prim: "nat"
            }
          }
        }
      ],
      name: "token_metadata",
      pure: true,
      description: "Returns metadata for given token according to TZIP-12."
    },
    {
      implementations: [
        {
          michelsonStorageView: {
            returnType: {
              prim: "nat"
            },
            code: [
              {
                prim: "CDR"
              },
              {
                prim: "CDR"
              },
              {
                prim: "CDR"
              },
              {
                prim: "CAR"
              }
            ]
          }
        }
      ],
      name: "GetCounter",
      pure: true,
      description: "Returns the next counter value with which a permit should be created."
    }
  ],
  version: "1.0.0",
  license: {
    name: "MIT"
  }
})
