const AppConfig = {
  env: process.env.REACT_APP_ENV,
  CONST: {
    ARBITRARY_CONTRACT_INTERACTION: "arbitrary_contract_interaction"
  },
  ACI: {
    EXECUTOR_FUNCTION_NAME: "simple_lambda_3",
    EXECUTOR_LAMBDA: {
      code: `(Left (Left (Pair (Pair { UNPAIR; UNPAIR; SWAP; UNPACK (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (bytes %packed_argument)); ASSERT_SOME; UNPAIR; DIP{ SWAP; PAIR; PAIR}; SWAP; EXEC} {DROP; UNIT}) "simple_lambda_3")))`,
      type: `(or (or (pair %add_handler (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (lambda %handler_check (pair bytes (map string bytes)) unit)) (string %name)) (pair %execute_handler (string %handler_name) (bytes %packed_argument))) (string %remove_handler))`
    }
  }
}

export default AppConfig
