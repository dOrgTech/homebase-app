export default `pair (lambda 
    (pair 
        (pair 
            (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) bytes`
