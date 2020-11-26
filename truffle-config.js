module.exports = {
  contracts_directory: "./contracts",
  networks: {
    development: {
      host: "http://localhost",
      port: 8732,
      network_id: "*",
      type: "tezos",
    },
    carthagenet: {
      host: "https://carthagenet.smartpy.io",
      port: 443,
      network_id: "*",
      type: "tezos",
    },
    mainnet: {
      host: "https://mainnet.smartpy.io",
      port: 443,
      network_id: "*",
      type: "tezos",
    },
  },
};
