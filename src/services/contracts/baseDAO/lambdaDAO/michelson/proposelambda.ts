export default `(or (or (pair %add_handler
      (pair (lambda %code
              (pair (pair (map %handler_storage string bytes) (bytes %packed_argument))
                    (pair %proposal_info
                        (address %from)
                        (nat %frozen_token)
                        (bytes %proposal_metadata)))
              (pair (pair (option %guardian address) (map %handler_storage string bytes))
                    (list %operations operation)))
            (lambda %handler_check (pair bytes (map string bytes)) unit))
      (string %name))
    (pair %execute_handler (string %handler_name) (bytes %packed_argument)))
    (string %remove_handler))`
