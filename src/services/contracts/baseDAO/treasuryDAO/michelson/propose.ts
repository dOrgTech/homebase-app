export default `(pair (nat %agora_post_id)
(list %transfers
   (or (pair %xtz_transfer_type (mutez %amount) (address %recipient))
       (pair %token_transfer_type
          (address %contract_address)
          (list %transfer_list
             (pair (address %from_)
                   (list %txs (pair (address %to_) (pair (nat %token_id) (nat %amount))))))))))`