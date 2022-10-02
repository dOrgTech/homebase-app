export default `(or (or (or (pair %configuration_proposal
                                                        (pair (pair (option %frozen_extra_value nat) (option %frozen_scale_value nat))
                                                              (pair (option %max_proposal_size nat) (option %slash_division_value nat)))
                                                        (option %slash_scale_value nat))
                                                     (pair %transfer_proposal
                                                        (pair (nat %agora_post_id) (list %registry_diff (pair string (option string))))
                                                        (list %transfers
                                                           (or (pair %xtz_transfer_type (mutez %amount) (address %recipient))
                                                               (pair %token_transfer_type
                                                                  (address %contract_address)
                                                                  (list %transfer_list
                                                                     (pair (address %from_)
                                                                           (list %txs (pair (address %to_) (pair (nat %token_id) (nat %amount)))))))))))
                                                 (or (option %update_contract_delegate key_hash) (address %update_guardian)))
                                             (or %update_receivers_proposal
                                                (list %add_receivers address)
                                                (list %remove_receivers address)))`
