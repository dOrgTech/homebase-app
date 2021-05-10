export interface MetadataDTO {
  address: "KT1Q9ptDkk3K9UPYaUdvkj8EJHN5Jz19Pq74";
  network: "florencenet";
  extras: {
    template: "registry";
  };
  name: "RegistryFlorence";
  description: "Registry Florence";
  version: "1.0.0";
  license: {
    name: "MIT";
  };
  homepage: "https://github.com/tqtezos/baseDAO";
  authors: ["tz1RKPcdraL3D3SQitGbvUZmBoqefepxRW1x"];
  interfaces: ["TZIP-12", "TZIP-17"];
  views: [
    {
      name: "get_balance";
      description: "Get balance of an address according to TZIP-12.";
      implementations: [
        {
          michelsonStorageView: {
            parameter: {
              args: [
                {
                  prim: "address";
                  annots: ["%owner"];
                },
                {
                  prim: "nat";
                  annots: ["%token_id"];
                }
              ];
              prim: "pair";
            };
            returnType: {
              prim: "nat";
            };
            code: [
              {
                prim: "DUP";
              },
              {
                prim: "CAR";
              },
              {
                args: [
                  [
                    {
                      prim: "CDR";
                    },
                    {
                      prim: "CAR";
                    },
                    {
                      prim: "CAR";
                    },
                    {
                      prim: "CAR";
                    }
                  ]
                ];
                prim: "DIP";
              },
              {
                prim: "GET";
              },
              {
                args: [
                  [
                    {
                      args: [
                        {
                          prim: "nat";
                        },
                        {
                          int: "0";
                        }
                      ];
                      prim: "PUSH";
                    }
                  ],
                  []
                ];
                prim: "IF_NONE";
              }
            ];
          };
        }
      ];
    },
    {
      name: "all_tokens";
      description: "Get all supported tokens according to TZIP-12.";
      implementations: [
        {
          michelsonStorageView: {
            parameter: null;
            returnType: {
              args: [
                {
                  prim: "nat";
                }
              ];
              prim: "list";
            };
            code: [
              {
                prim: "DROP";
              },
              {
                args: [
                  {
                    args: [
                      {
                        prim: "nat";
                      }
                    ];
                    prim: "list";
                  },
                  [
                    {
                      int: "0";
                    },
                    {
                      int: "1";
                    }
                  ]
                ];
                prim: "PUSH";
              }
            ];
          };
        }
      ];
    },
    {
      name: "is_operator";
      description: "Checks whether given address is allowed to transfer given tokens that belong to given owner - according to TZIP-12.";
      implementations: [
        {
          michelsonStorageView: {
            parameter: {
              args: [
                {
                  prim: "address";
                  annots: ["%owner"];
                },
                {
                  args: [
                    {
                      prim: "address";
                      annots: ["%operator"];
                    },
                    {
                      prim: "nat";
                      annots: ["%token_id"];
                    }
                  ];
                  prim: "pair";
                }
              ];
              prim: "pair";
            };
            returnType: {
              prim: "bool";
            };
            code: [
              {
                prim: "DUP";
              },
              {
                prim: "CAR";
              },
              {
                args: [
                  [
                    {
                      prim: "CDR";
                    }
                  ]
                ];
                prim: "DIP";
              },
              {
                prim: "DUP";
              },
              {
                prim: "CDR";
              },
              {
                prim: "CDR";
              },
              {
                args: [
                  [
                    {
                      prim: "DUP";
                    },
                    {
                      prim: "CDR";
                    },
                    {
                      prim: "CAR";
                    },
                    {
                      args: [
                        [
                          {
                            prim: "CAR";
                          }
                        ]
                      ];
                      prim: "DIP";
                    }
                  ]
                ];
                prim: "DIP";
              },
              {
                prim: "DUP";
              },
              {
                prim: "INT";
              },
              {
                prim: "EQ";
              },
              {
                args: [
                  [
                    {
                      prim: "DROP";
                    }
                  ],
                  [
                    {
                      prim: "DUP";
                    },
                    {
                      args: [
                        {
                          prim: "nat";
                        },
                        {
                          int: "1";
                        }
                      ];
                      prim: "PUSH";
                    },
                    {
                      prim: "COMPARE";
                    },
                    {
                      prim: "EQ";
                    },
                    {
                      args: [
                        [
                          {
                            args: [
                              {
                                prim: "string";
                              },
                              {
                                string: "OPERATION_PROHIBITED";
                              }
                            ];
                            prim: "PUSH";
                          },
                          {
                            prim: "FAILWITH";
                          }
                        ],
                        [
                          {
                            prim: "UNIT";
                          },
                          {
                            args: [
                              {
                                prim: "string";
                              },
                              {
                                string: "FA2_TOKEN_UNDEFINED";
                              }
                            ];
                            prim: "PUSH";
                          },
                          {
                            prim: "PAIR";
                          },
                          {
                            prim: "FAILWITH";
                          }
                        ]
                      ];
                      prim: "IF";
                    }
                  ]
                ];
                prim: "IF";
              },
              {
                prim: "SWAP";
              },
              {
                prim: "PAIR";
              },
              {
                args: [
                  [
                    {
                      prim: "CAR";
                    },
                    {
                      prim: "CAR";
                    },
                    {
                      prim: "CDR";
                    },
                    {
                      prim: "CAR";
                    }
                  ]
                ];
                prim: "DIP";
              },
              {
                prim: "MEM";
              }
            ];
          };
        }
      ];
    },
    {
      name: "token_metadata";
      description: "Returns metadata for given token according to TZIP-12.";
      implementations: [
        {
          michelsonStorageView: {
            parameter: {
              prim: "nat";
            };
            returnType: {
              args: [
                {
                  prim: "nat";
                },
                {
                  args: [
                    {
                      prim: "string";
                    },
                    {
                      prim: "bytes";
                    }
                  ];
                  prim: "map";
                }
              ];
              prim: "pair";
            };
            code: [
              {
                prim: "DUP";
              },
              {
                prim: "CAR";
              },
              {
                args: [
                  [
                    {
                      prim: "CDR";
                    },
                    {
                      prim: "DROP";
                    },
                    {
                      args: [
                        {
                          args: [
                            {
                              prim: "nat";
                            },
                            {
                              args: [
                                {
                                  prim: "string";
                                },
                                {
                                  prim: "bytes";
                                }
                              ];
                              prim: "map";
                            }
                          ];
                          prim: "map";
                        },
                        [
                          {
                            args: [
                              {
                                int: "0";
                              },
                              [
                                {
                                  args: [
                                    {
                                      string: "decimals";
                                    },
                                    {
                                      bytes: "3138";
                                    }
                                  ];
                                  prim: "Elt";
                                },
                                {
                                  args: [
                                    {
                                      string: "name";
                                    },
                                    {
                                      bytes: "5265676973747279466c6f72656e6365";
                                    }
                                  ];
                                  prim: "Elt";
                                },
                                {
                                  args: [
                                    {
                                      string: "symbol";
                                    },
                                    {
                                      bytes: "524654";
                                    }
                                  ];
                                  prim: "Elt";
                                }
                              ]
                            ];
                            prim: "Elt";
                          },
                          {
                            args: [
                              {
                                int: "1";
                              },
                              [
                                {
                                  args: [
                                    {
                                      string: "decimals";
                                    },
                                    {
                                      bytes: "3138";
                                    }
                                  ];
                                  prim: "Elt";
                                },
                                {
                                  args: [
                                    {
                                      string: "name";
                                    },
                                    {
                                      bytes: "5265676973747279466c6f72656e6365";
                                    }
                                  ];
                                  prim: "Elt";
                                },
                                {
                                  args: [
                                    {
                                      string: "symbol";
                                    },
                                    {
                                      bytes: "524654";
                                    }
                                  ];
                                  prim: "Elt";
                                }
                              ]
                            ];
                            prim: "Elt";
                          }
                        ]
                      ];
                      prim: "PUSH";
                    }
                  ]
                ];
                prim: "DIP";
              },
              {
                prim: "DUP";
              },
              {
                args: [
                  [
                    {
                      prim: "GET";
                    },
                    {
                      args: [
                        [
                          {
                            prim: "UNIT";
                          },
                          {
                            args: [
                              {
                                prim: "string";
                              },
                              {
                                string: "FA2_TOKEN_UNDEFINED";
                              }
                            ];
                            prim: "PUSH";
                          },
                          {
                            prim: "PAIR";
                          },
                          {
                            prim: "FAILWITH";
                          }
                        ],
                        []
                      ];
                      prim: "IF_NONE";
                    }
                  ]
                ];
                prim: "DIP";
              },
              {
                prim: "PAIR";
              }
            ];
          };
        }
      ];
    },
    {
      name: "GetCounter";
      description: "Returns the next counter value with which a permit should be created.";
      implementations: [
        {
          michelsonStorageView: {
            parameter: null;
            returnType: {
              prim: "nat";
            };
            code: [
              {
                prim: "CDR";
              },
              {
                prim: "CDR";
              },
              {
                prim: "CDR";
              },
              {
                prim: "CAR";
              }
            ];
          };
        }
      ];
    }
  ];
}