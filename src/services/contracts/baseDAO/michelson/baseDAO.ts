export default `parameter
(or (or (or (or (unit %accept_ownership) (pair %callCustom string bytes))
            (or (pair %propose (address %from) (pair (nat %frozen_token) (bytes %proposal_metadata)))
                (pair %transfer_contract_tokens
                   (address %contract_address)
                   (list %params
                      (pair (address %from_)
                            (list %txs (pair (address %to_) (pair (nat %token_id) (nat %amount)))))))))
        (address %transfer_ownership))
    (or (or (or (bytes %drop_proposal) (nat %flush)) (or (nat %freeze) (nat %unfreeze)))
        (or (list %update_delegate (pair (bool %enable) (address %delegate)))
            (list %vote
               (pair (pair %argument
                        (pair (address %from) (bytes %proposal_key))
                        (pair (nat %vote_amount) (bool %vote_type)))
                     (option %permit (pair (key %key) (signature %signature)))))))) ;
storage
(pair (pair (pair (pair (pair (address %admin)
                              (big_map %delegates (pair (address %owner) (address %delegate)) unit))
                        (pair (big_map %extra string bytes)
                              (big_map %freeze_history
                                 address
                                 (pair (pair (nat %current_stage_num) (nat %current_unstaked))
                                       (pair (nat %past_unstaked) (nat %staked))))))
                  (pair (pair (nat %frozen_token_id) (nat %frozen_total_supply))
                        (pair (pair %governance_token (address %address) (nat %token_id))
                              (address %guardian))))
            (pair (pair (pair (big_map %metadata string bytes) (address %pending_owner))
                        (pair (nat %permits_counter) (set %proposal_key_list_sort_by_level (pair nat bytes))))
                  (pair (pair (big_map %proposals
                                 bytes
                                 (pair (pair (pair (pair (nat %downvotes) (bytes %metadata))
                                                   (pair (address %proposer) (nat %proposer_frozen_token)))
                                             (pair (pair (nat %quorum_threshold) (nat %start_level))
                                                   (pair (nat %upvotes) (map %voters (pair address bool) nat))))
                                       (nat %voting_stage_num)))
                              (pair %quorum_threshold_at_cycle
                                 (pair (nat %last_updated_cycle) (nat %quorum_threshold))
                                 (nat %staked)))
                        (nat %start_level))))
      (pair (pair (pair (pair (big_map %custom_entrypoints string bytes)
                              (lambda %decision_lambda
                                 (pair (big_map %extras string bytes)
                                       (pair %proposal
                                          (pair (pair (pair (nat %downvotes) (bytes %metadata))
                                                      (pair (address %proposer) (nat %proposer_frozen_token)))
                                                (pair (pair (nat %quorum_threshold) (nat %start_level))
                                                      (pair (nat %upvotes) (map %voters (pair address bool) nat))))
                                          (nat %voting_stage_num)))
                                 (pair (pair (big_map %extras string bytes) (option %guardian address))
                                       (list %operations operation))))
                        (pair (nat %fixed_proposal_fee_in_token) (nat %governance_total_supply)))
                  (pair (pair (nat %max_proposals) (int %max_quorum_change))
                        (pair (int %max_quorum_threshold) (nat %max_voters))))
            (pair (pair (pair (int %min_quorum_threshold) (nat %period))
                        (pair (lambda %proposal_check
                                 (pair (pair (address %from) (pair (nat %frozen_token) (bytes %proposal_metadata)))
                                       (big_map string bytes))
                                 unit)
                              (nat %proposal_expired_level)))
                  (pair (pair (nat %proposal_flush_level) (int %quorum_change))
                        (lambda %rejected_proposal_slash_value
                           (pair (pair (pair (pair (pair (nat %downvotes) (bytes %metadata))
                                                   (pair (address %proposer) (nat %proposer_frozen_token)))
                                             (pair (pair (nat %quorum_threshold) (nat %start_level))
                                                   (pair (nat %upvotes) (map %voters (pair address bool) nat))))
                                       (nat %voting_stage_num))
                                 (big_map string bytes))
                           nat))))) ;
code { PUSH nat 1000000 ;
     NIL operation ;
     LAMBDA
       (pair (list (pair address (list (pair address (pair nat nat))))) address)
       operation
       { UNPAIR ;
         SWAP ;
         CONTRACT %transfer
           (list (pair (address %from_)
                       (list %txs (pair (address %to_) (pair (nat %token_id) (nat %amount)))))) ;
         IF_NONE { PUSH string "BAD_TOKEN_CONTRACT" ; FAILWITH } {} ;
         PUSH mutez 0 ;
         DIG 2 ;
         TRANSFER_TOKENS } ;
     LAMBDA
       (pair nat (pair (pair nat nat) (pair nat nat)))
       (pair (pair nat nat) (pair nat nat))
       { UNPAIR ;
         SWAP ;
         DUP ;
         DUG 2 ;
         CDR ;
         CAR ;
         SUB ;
         ISNAT ;
         IF_NONE
           { DROP ;
             PUSH unit Unit ;
             PUSH string "NOT_ENOUGH_FROZEN_TOKENS" ;
             PAIR ;
             FAILWITH }
           { SWAP ; DUP ; DUG 2 ; CDR ; CDR ; SWAP ; PAIR ; SWAP ; CAR ; PAIR } } ;
     LAMBDA
       (pair nat (pair (pair nat nat) (pair nat nat)))
       (pair (pair nat nat) (pair nat nat))
       { UNPAIR ;
         DUP ;
         DUP 3 ;
         CAR ;
         CAR ;
         COMPARE ;
         LT ;
         IF { SWAP ;
              DUP ;
              DUG 2 ;
              CDR ;
              CDR ;
              DUP 3 ;
              CDR ;
              CAR ;
              DIG 3 ;
              CAR ;
              CDR ;
              ADD ;
              PAIR ;
              PUSH nat 0 ;
              DIG 2 ;
              PAIR ;
              PAIR }
            { DROP } } ;
     LAMBDA
       (pair bytes
             (pair (pair (pair (pair address (big_map (pair address address) unit))
                               (pair (big_map string bytes) (big_map address (pair (pair nat nat) (pair nat nat)))))
                         (pair (pair nat nat) (pair (pair address nat) address)))
                   (pair (pair (pair (big_map string bytes) address) (pair nat (set (pair nat bytes))))
                         (pair (pair (big_map
                                        bytes
                                        (pair (pair (pair (pair nat bytes) (pair address nat))
                                                    (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                              nat))
                                     (pair (pair nat nat) nat))
                               nat))))
       (pair (pair (pair (pair nat bytes) (pair address nat))
                   (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
             nat)
       { UNPAIR ;
         SWAP ;
         CDR ;
         CDR ;
         CAR ;
         CAR ;
         SWAP ;
         GET ;
         IF_NONE { PUSH string "PROPOSAL_NOT_EXIST" ; FAILWITH } {} } ;
     LAMBDA
       (pair nat nat)
       nat
       { UNPAIR ;
         LEVEL ;
         SUB ;
         ISNAT ;
         IF_NONE
           { DROP ; PUSH unit Unit ; PUSH string "BAD_STATE" ; PAIR ; FAILWITH }
           { EDIV ; IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ; CAR } } ;
     DUP 4 ;
     DUP 4 ;
     DUP 3 ;
     PAIR 3 ;
     LAMBDA
       (pair (pair (lambda (pair nat nat) nat)
                   (pair (lambda (pair nat (pair (pair nat nat) (pair nat nat))) (pair (pair nat nat) (pair nat nat)))
                         (lambda (pair nat (pair (pair nat nat) (pair nat nat))) (pair (pair nat nat) (pair nat nat)))))
             (pair (pair nat address)
                   (pair nat
                         (pair (pair (pair (pair address (big_map (pair address address) unit))
                                           (pair (big_map string bytes) (big_map address (pair (pair nat nat) (pair nat nat)))))
                                     (pair (pair nat nat) (pair (pair address nat) address)))
                               (pair (pair (pair (big_map string bytes) address) (pair nat (set (pair nat bytes))))
                                     (pair (pair (big_map
                                                    bytes
                                                    (pair (pair (pair (pair nat bytes) (pair address nat))
                                                                (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                                          nat))
                                                 (pair (pair nat nat) nat))
                                           nat))))))
       (pair (pair (pair (pair address (big_map (pair address address) unit))
                         (pair (big_map string bytes) (big_map address (pair (pair nat nat) (pair nat nat)))))
                   (pair (pair nat nat) (pair (pair address nat) address)))
             (pair (pair (pair (big_map string bytes) address) (pair nat (set (pair nat bytes))))
                   (pair (pair (big_map
                                  bytes
                                  (pair (pair (pair (pair nat bytes) (pair address nat))
                                              (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                        nat))
                               (pair (pair nat nat) nat))
                         nat)))
       { UNPAIR ;
         UNPAIR 3 ;
         DIG 3 ;
         UNPAIR ;
         UNPAIR ;
         DIG 2 ;
         UNPAIR ;
         SWAP ;
         DUP ;
         DUG 2 ;
         CDR ;
         CDR ;
         CDR ;
         PAIR ;
         DIG 4 ;
         SWAP ;
         EXEC ;
         DUP 3 ;
         DUP 3 ;
         CDR ;
         CDR ;
         CAR ;
         CDR ;
         CDR ;
         ADD ;
         DUP 3 ;
         CAR ;
         CAR ;
         CDR ;
         CDR ;
         DUP 6 ;
         GET ;
         IF_NONE
           { SWAP ;
             DIG 4 ;
             DIG 5 ;
             DIG 6 ;
             DROP 4 ;
             PUSH nat 0 ;
             DIG 3 ;
             COMPARE ;
             EQ ;
             IF { SWAP ; DUP ; DUG 2 ; CAR ; CAR ; CDR ; CDR }
                { PUSH unit Unit ; PUSH string "NOT_ENOUGH_FROZEN_TOKENS" ; PAIR ; FAILWITH } }
           { DIG 2 ;
             PAIR ;
             DIG 5 ;
             SWAP ;
             EXEC ;
             DIG 3 ;
             DUP ;
             DUG 2 ;
             PAIR ;
             DIG 5 ;
             SWAP ;
             EXEC ;
             DUP ;
             DUG 2 ;
             CDR ;
             CDR ;
             ADD ;
             SWAP ;
             DUP ;
             DUG 2 ;
             CDR ;
             CAR ;
             PAIR ;
             SWAP ;
             CAR ;
             PAIR ;
             DUP 3 ;
             CAR ;
             CAR ;
             CDR ;
             CDR ;
             SWAP ;
             SOME ;
             DIG 4 ;
             UPDATE } ;
         DUP 3 ;
         CDR ;
         DUP 4 ;
         CAR ;
         CDR ;
         DIG 2 ;
         DUP 5 ;
         CAR ;
         CAR ;
         CDR ;
         CAR ;
         PAIR ;
         DUP 5 ;
         CAR ;
         CAR ;
         CAR ;
         PAIR ;
         PAIR ;
         PAIR ;
         DUP ;
         CDR ;
         CDR ;
         CDR ;
         DIG 2 ;
         DIG 3 ;
         CDR ;
         CDR ;
         CAR ;
         CDR ;
         CAR ;
         PAIR ;
         DUP 3 ;
         CDR ;
         CDR ;
         CAR ;
         CAR ;
         PAIR ;
         PAIR ;
         SWAP ;
         DUP ;
         DUG 2 ;
         CDR ;
         CAR ;
         PAIR ;
         SWAP ;
         CAR ;
         PAIR } ;
     SWAP ;
     APPLY ;
     DUP 4 ;
     DUP 3 ;
     PAIR ;
     LAMBDA
       (pair (pair (lambda (pair nat nat) nat)
                   (lambda (pair nat (pair (pair nat nat) (pair nat nat))) (pair (pair nat nat) (pair nat nat))))
             (pair (pair (pair nat nat) (pair address nat))
                   (pair (pair (pair (pair address (big_map (pair address address) unit))
                                     (pair (big_map string bytes) (big_map address (pair (pair nat nat) (pair nat nat)))))
                               (pair (pair nat nat) (pair (pair address nat) address)))
                         (pair (pair (pair (big_map string bytes) address) (pair nat (set (pair nat bytes))))
                               (pair (pair (big_map
                                              bytes
                                              (pair (pair (pair (pair nat bytes) (pair address nat))
                                                          (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                                    nat))
                                           (pair (pair nat nat) nat))
                                     nat)))))
       (pair (pair (pair (pair address (big_map (pair address address) unit))
                         (pair (big_map string bytes) (big_map address (pair (pair nat nat) (pair nat nat)))))
                   (pair (pair nat nat) (pair (pair address nat) address)))
             (pair (pair (pair (big_map string bytes) address) (pair nat (set (pair nat bytes))))
                   (pair (pair (big_map
                                  bytes
                                  (pair (pair (pair (pair nat bytes) (pair address nat))
                                              (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                        nat))
                               (pair (pair nat nat) nat))
                         nat)))
       { UNPAIR ;
         UNPAIR ;
         DIG 2 ;
         UNPAIR ;
         UNPAIR ;
         UNPAIR ;
         DIG 2 ;
         UNPAIR ;
         SWAP ;
         DUP 5 ;
         CDR ;
         CDR ;
         CDR ;
         PAIR ;
         DIG 5 ;
         SWAP ;
         EXEC ;
         DUP 5 ;
         CAR ;
         CAR ;
         CDR ;
         CDR ;
         DUP 3 ;
         GET ;
         IF_NONE
           { DROP 6 ; PUSH string "BAD_STATE" ; FAILWITH }
           { SWAP ;
             PAIR ;
             DIG 5 ;
             SWAP ;
             EXEC ;
             DUP 4 ;
             DIG 3 ;
             DUP ;
             DUG 2 ;
             ADD ;
             DUP 3 ;
             CDR ;
             CDR ;
             SUB ;
             ISNAT ;
             IF_NONE
               { DROP 2 ; PUSH unit Unit ; PUSH string "BAD_STATE" ; PAIR ; FAILWITH }
               { DUP 3 ;
                 CDR ;
                 CAR ;
                 PAIR ;
                 DUP 3 ;
                 CAR ;
                 PAIR ;
                 DUP ;
                 CDR ;
                 CDR ;
                 DIG 2 ;
                 DIG 3 ;
                 CDR ;
                 CAR ;
                 ADD ;
                 PAIR ;
                 SWAP ;
                 CAR ;
                 PAIR } ;
             DIG 2 ;
             DUP 4 ;
             CAR ;
             CDR ;
             CAR ;
             CDR ;
             SUB ;
             ISNAT ;
             IF_NONE { PUSH string "BAD_STATE" ; FAILWITH } {} ;
             DUP 4 ;
             CDR ;
             DUP 5 ;
             CAR ;
             CDR ;
             DUP 6 ;
             CAR ;
             CAR ;
             CDR ;
             CDR ;
             DIG 4 ;
             SOME ;
             DIG 5 ;
             UPDATE ;
             DUP 5 ;
             CAR ;
             CAR ;
             CDR ;
             CAR ;
             PAIR ;
             DIG 4 ;
             CAR ;
             CAR ;
             CAR ;
             PAIR ;
             PAIR ;
             PAIR ;
             DUP ;
             CDR ;
             SWAP ;
             DUP ;
             DUG 2 ;
             CAR ;
             CDR ;
             CDR ;
             DIG 3 ;
             DUP 4 ;
             CAR ;
             CDR ;
             CAR ;
             CAR ;
             PAIR ;
             PAIR ;
             DIG 2 ;
             CAR ;
             CAR ;
             PAIR ;
             PAIR } } ;
     SWAP ;
     APPLY ;
     LAMBDA
       (pair (lambda
                (pair (pair (pair nat nat) (pair address nat))
                      (pair (pair (pair (pair address (big_map (pair address address) unit))
                                        (pair (big_map string bytes) (big_map address (pair (pair nat nat) (pair nat nat)))))
                                  (pair (pair nat nat) (pair (pair address nat) address)))
                            (pair (pair (pair (big_map string bytes) address) (pair nat (set (pair nat bytes))))
                                  (pair (pair (big_map
                                                 bytes
                                                 (pair (pair (pair (pair nat bytes) (pair address nat))
                                                             (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                                       nat))
                                              (pair (pair nat nat) nat))
                                        nat))))
                (pair (pair (pair (pair address (big_map (pair address address) unit))
                                  (pair (big_map string bytes) (big_map address (pair (pair nat nat) (pair nat nat)))))
                            (pair (pair nat nat) (pair (pair address nat) address)))
                      (pair (pair (pair (big_map string bytes) address) (pair nat (set (pair nat bytes))))
                            (pair (pair (big_map
                                           bytes
                                           (pair (pair (pair (pair nat bytes) (pair address nat))
                                                       (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                                 nat))
                                        (pair (pair nat nat) nat))
                                  nat))))
             (pair (pair (pair (lambda
                                  (pair (pair (pair (pair (pair nat bytes) (pair address nat))
                                                    (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                              nat)
                                        (big_map string bytes))
                                  nat)
                               bool)
                         (pair (pair (pair (pair (pair nat bytes) (pair address nat))
                                           (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                     nat)
                               nat))
                   (pair nat
                         (pair (pair (pair (pair address (big_map (pair address address) unit))
                                           (pair (big_map string bytes) (big_map address (pair (pair nat nat) (pair nat nat)))))
                                     (pair (pair nat nat) (pair (pair address nat) address)))
                               (pair (pair (pair (big_map string bytes) address) (pair nat (set (pair nat bytes))))
                                     (pair (pair (big_map
                                                    bytes
                                                    (pair (pair (pair (pair nat bytes) (pair address nat))
                                                                (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                                          nat))
                                                 (pair (pair nat nat) nat))
                                           nat))))))
       (pair (pair (pair (pair address (big_map (pair address address) unit))
                         (pair (big_map string bytes) (big_map address (pair (pair nat nat) (pair nat nat)))))
                   (pair (pair nat nat) (pair (pair address nat) address)))
             (pair (pair (pair (big_map string bytes) address) (pair nat (set (pair nat bytes))))
                   (pair (pair (big_map
                                  bytes
                                  (pair (pair (pair (pair nat bytes) (pair address nat))
                                              (pair (pair nat nat) (pair nat (map (pair address bool) nat))))
                                        nat))
                               (pair (pair nat nat) nat))
                         nat)))
       { UNPAIR ;
         SWAP ;
         UNPAIR ;
         UNPAIR ;
         UNPAIR ;
         DIG 2 ;
         UNPAIR ;
         DIG 4 ;
         UNPAIR ;
         DIG 5 ;
         IF { DIG 4 ;
              DROP ;
              PUSH nat 0 ;
              SWAP ;
              DUP 4 ;
              CAR ;
              CAR ;
              CDR ;
              CDR ;
              ADD ;
              PAIR }
            { SWAP ;
              DUP ;
              DUG 2 ;
              CAR ;
              CAR ;
              CDR ;
              CAR ;
              DUP 4 ;
              PAIR ;
              DIG 5 ;
              SWAP ;
              EXEC ;
              SWAP ;
              DUP ;
              DUG 2 ;
              DUP 5 ;
              CAR ;
              CAR ;
              CDR ;
              CDR ;
              ADD ;
              DUG 2 ;
              ADD ;
              DUP ;
              DIG 2 ;
              SUB ;
              ISNAT ;
              IF_NONE { PUSH nat 0 } {} ;
              PAIR } ;
         UNPAIR ;
         DIG 2 ;
         DUP 5 ;
         DUP 5 ;
         CAR ;
         CAR ;
         CDR ;
         CAR ;
         PAIR ;
         DIG 3 ;
         DIG 3 ;
         PAIR ;
         PAIR ;
         PAIR ;
         DUP 4 ;
         SWAP ;
         EXEC ;
         SWAP ;
         CAR ;
         CDR ;
         CDR ;
         CDR ;
         ITER { SWAP ;
                DUP 3 ;
                DUP 3 ;
                CAR ;
                CAR ;
                PAIR ;
                PUSH nat 0 ;
                DIG 3 ;
                CDR ;
                PAIR ;
                PAIR ;
                PAIR ;
                DUP 3 ;
                SWAP ;
                EXEC } ;
         SWAP ;
         DIG 2 ;
         DROP 2 } ;
     SWAP ;
     APPLY ;
     DIG 9 ;
     UNPAIR ;
     SWAP ;
     DUP ;
     DUG 2 ;
     CAR ;
     DIG 2 ;
     CDR ;
     DIG 2 ;
     IF_LEFT
       { DIG 3 ;
         DIG 6 ;
         DIG 7 ;
         DIG 8 ;
         DIG 9 ;
         DROP 5 ;
         SWAP ;
         DUP ;
         DUG 2 ;
         DIG 3 ;
         DIG 2 ;
         IF_LEFT
           { IF_LEFT
               { DIG 4 ;
                 DIG 5 ;
                 DIG 7 ;
                 DROP 3 ;
                 IF_LEFT
                   { DIG 2 ;
                     DROP 2 ;
                     SENDER ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     CDR ;
                     CAR ;
                     CAR ;
                     CDR ;
                     COMPARE ;
                     EQ ;
                     IF { DUP ;
                          CDR ;
                          SWAP ;
                          DUP ;
                          DUG 2 ;
                          CAR ;
                          CDR ;
                          DUP 3 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          DIG 3 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          CDR ;
                          SENDER ;
                          PAIR ;
                          PAIR ;
                          PAIR ;
                          PAIR ;
                          DIG 2 ;
                          PAIR }
                        { DIG 2 ; DROP 2 ; PUSH string "NOT_PENDING_ADMIN" ; FAILWITH } }
                   { DIG 4 ;
                     DROP ;
                     DUP 3 ;
                     CAR ;
                     CAR ;
                     CAR ;
                     CAR ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     CAR ;
                     GET ;
                     IF_NONE { PUSH string "ENTRYPOINT_NOT_FOUND" ; FAILWITH } {} ;
                     UNPACK
                       (lambda
                          (pair bytes
                                (pair (pair (pair (pair (pair (address %admin)
                                                              (big_map %delegates (pair (address %owner) (address %delegate)) unit))
                                                        (pair (big_map %extra string bytes)
                                                              (big_map %freeze_history
                                                                 address
                                                                 (pair (pair (nat %current_stage_num) (nat %current_unstaked))
                                                                       (pair (nat %past_unstaked) (nat %staked))))))
                                                  (pair (pair (nat %frozen_token_id) (nat %frozen_total_supply))
                                                        (pair (pair %governance_token (address %address) (nat %token_id))
                                                              (address %guardian))))
                                            (pair (pair (pair (big_map %metadata string bytes) (address %pending_owner))
                                                        (pair (nat %permits_counter) (set %proposal_key_list_sort_by_level (pair nat bytes))))
                                                  (pair (pair (big_map %proposals
                                                                 bytes
                                                                 (pair (pair (pair (pair (nat %downvotes) (bytes %metadata))
                                                                                   (pair (address %proposer) (nat %proposer_frozen_token)))
                                                                             (pair (pair (nat %quorum_threshold) (nat %start_level))
                                                                                   (pair (nat %upvotes) (map %voters (pair address bool) nat))))
                                                                       (nat %voting_stage_num)))
                                                              (pair %quorum_threshold_at_cycle
                                                                 (pair (nat %last_updated_cycle) (nat %quorum_threshold))
                                                                 (nat %staked)))
                                                        (nat %start_level))))
                                      (pair (pair (pair (pair (big_map %custom_entrypoints string bytes)
                                                              (lambda %decision_lambda
                                                                 (pair (big_map %extras string bytes)
                                                                       (pair %proposal
                                                                          (pair (pair (pair (nat %downvotes) (bytes %metadata))
                                                                                      (pair (address %proposer) (nat %proposer_frozen_token)))
                                                                                (pair (pair (nat %quorum_threshold) (nat %start_level))
                                                                                      (pair (nat %upvotes) (map %voters (pair address bool) nat))))
                                                                          (nat %voting_stage_num)))
                                                                 (pair (pair (big_map %extras string bytes) (option %guardian address))
                                                                       (list %operations operation))))
                                                        (pair (nat %fixed_proposal_fee_in_token) (nat %governance_total_supply)))
                                                  (pair (pair (nat %max_proposals) (int %max_quorum_change))
                                                        (pair (int %max_quorum_threshold) (nat %max_voters))))
                                            (pair (pair (pair (int %min_quorum_threshold) (nat %period))
                                                        (pair (lambda %proposal_check
                                                                 (pair (pair (address %from) (pair (nat %frozen_token) (bytes %proposal_metadata)))
                                                                       (big_map string bytes))
                                                                 unit)
                                                              (nat %proposal_expired_level)))
                                                  (pair (pair (nat %proposal_flush_level) (int %quorum_change))
                                                        (lambda %rejected_proposal_slash_value
                                                           (pair (pair (pair (pair (pair (nat %downvotes) (bytes %metadata))
                                                                                   (pair (address %proposer) (nat %proposer_frozen_token)))
                                                                             (pair (pair (nat %quorum_threshold) (nat %start_level))
                                                                                   (pair (nat %upvotes) (map %voters (pair address bool) nat))))
                                                                       (nat %voting_stage_num))
                                                                 (big_map string bytes))
                                                           nat))))))
                          (pair (list operation)
                                (pair (pair (pair (pair (address %admin)
                                                        (big_map %delegates (pair (address %owner) (address %delegate)) unit))
                                                  (pair (big_map %extra string bytes)
                                                        (big_map %freeze_history
                                                           address
                                                           (pair (pair (nat %current_stage_num) (nat %current_unstaked))
                                                                 (pair (nat %past_unstaked) (nat %staked))))))
                                            (pair (pair (nat %frozen_token_id) (nat %frozen_total_supply))
                                                  (pair (pair %governance_token (address %address) (nat %token_id))
                                                        (address %guardian))))
                                      (pair (pair (pair (big_map %metadata string bytes) (address %pending_owner))
                                                  (pair (nat %permits_counter) (set %proposal_key_list_sort_by_level (pair nat bytes))))
                                            (pair (pair (big_map %proposals
                                                           bytes
                                                           (pair (pair (pair (pair (nat %downvotes) (bytes %metadata))
                                                                             (pair (address %proposer) (nat %proposer_frozen_token)))
                                                                       (pair (pair (nat %quorum_threshold) (nat %start_level))
                                                                             (pair (nat %upvotes) (map %voters (pair address bool) nat))))
                                                                 (nat %voting_stage_num)))
                                                        (pair %quorum_threshold_at_cycle
                                                           (pair (nat %last_updated_cycle) (nat %quorum_threshold))
                                                           (nat %staked)))
                                                  (nat %start_level)))))) ;
                     IF_NONE
                       { DROP 3 ; PUSH string "UNPACKING_FAILED" ; FAILWITH }
                       { DIG 3 ; DIG 3 ; PAIR ; DIG 2 ; CDR ; PAIR ; EXEC } } }
               { IF_LEFT
                   { SWAP ;
                     DUG 2 ;
                     DUP 3 ;
                     SENDER ;
                     DUP 3 ;
                     CAR ;
                     DIG 2 ;
                     CAR ;
                     CAR ;
                     CAR ;
                     CDR ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     DUP 4 ;
                     SWAP ;
                     PAIR ;
                     MEM ;
                     NOT ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     DIG 3 ;
                     COMPARE ;
                     NEQ ;
                     AND ;
                     IF { DROP ; PUSH string "NOT_DELEGATE" ; FAILWITH } {} ;
                     DUP 4 ;
                     CAR ;
                     CAR ;
                     CDR ;
                     CAR ;
                     DUP 3 ;
                     PAIR ;
                     DUP 4 ;
                     CDR ;
                     CAR ;
                     CDR ;
                     CAR ;
                     SWAP ;
                     EXEC ;
                     DROP ;
                     DIG 3 ;
                     DUP 4 ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     CDR ;
                     CAR ;
                     CDR ;
                     CDR ;
                     SIZE ;
                     SWAP ;
                     CAR ;
                     CDR ;
                     CAR ;
                     CAR ;
                     COMPARE ;
                     LE ;
                     IF { DROP ; PUSH string "MAX_PROPOSALS_REACHED" ; FAILWITH } {} ;
                     DUP 4 ;
                     CAR ;
                     CAR ;
                     CDR ;
                     CAR ;
                     DUP 4 ;
                     GET 3 ;
                     ADD ;
                     DUP 5 ;
                     CDR ;
                     CAR ;
                     CAR ;
                     CDR ;
                     DUP 3 ;
                     CDR ;
                     CDR ;
                     CDR ;
                     PAIR ;
                     DUP 9 ;
                     SWAP ;
                     EXEC ;
                     DUP 6 ;
                     DIG 3 ;
                     DIG 2 ;
                     PUSH nat 2 ;
                     PUSH nat 1 ;
                     DIG 2 ;
                     ADD ;
                     EDIV ;
                     IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                     CAR ;
                     DUP ;
                     DUP 3 ;
                     CDR ;
                     CDR ;
                     CAR ;
                     CDR ;
                     CAR ;
                     CAR ;
                     COMPARE ;
                     EQ ;
                     IF { DIG 2 ; DIG 11 ; DROP 3 }
                        { SWAP ;
                          DUP ;
                          DUG 2 ;
                          CDR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CAR ;
                          SWAP ;
                          DUP ;
                          DUG 2 ;
                          COMPARE ;
                          GT ;
                          IF { DUP 3 ;
                               CAR ;
                               CAR ;
                               CDR ;
                               CDR ;
                               DUP 3 ;
                               CDR ;
                               CDR ;
                               CAR ;
                               CDR ;
                               CDR ;
                               SWAP ;
                               DUP 14 ;
                               DIG 2 ;
                               MUL ;
                               EDIV ;
                               IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                               CAR ;
                               INT ;
                               DUP 3 ;
                               CDR ;
                               CDR ;
                               CAR ;
                               CDR ;
                               CAR ;
                               CDR ;
                               INT ;
                               DUP ;
                               DIG 2 ;
                               SUB ;
                               DUP 5 ;
                               CDR ;
                               CDR ;
                               CAR ;
                               CDR ;
                               DUP 15 ;
                               INT ;
                               DUG 2 ;
                               MUL ;
                               EDIV ;
                               IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                               CAR ;
                               SWAP ;
                               DUP ;
                               DUG 2 ;
                               ADD ;
                               DUP 14 ;
                               DUP 6 ;
                               CAR ;
                               CDR ;
                               CAR ;
                               CDR ;
                               ADD ;
                               DUP ;
                               DUP 4 ;
                               SWAP ;
                               DUP 17 ;
                               INT ;
                               DIG 2 ;
                               MUL ;
                               EDIV ;
                               IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                               CAR ;
                               SWAP ;
                               DIG 3 ;
                               DIG 15 ;
                               INT ;
                               DUG 2 ;
                               MUL ;
                               EDIV ;
                               IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                               CAR ;
                               DUP 5 ;
                               CDR ;
                               CDR ;
                               CDR ;
                               PUSH nat 0 ;
                               DUP 8 ;
                               CAR ;
                               CDR ;
                               CDR ;
                               CAR ;
                               DIG 8 ;
                               CDR ;
                               CAR ;
                               CAR ;
                               CAR ;
                               DIG 4 ;
                               DIG 5 ;
                               DIG 6 ;
                               DUP 3 ;
                               SWAP ;
                               DUP ;
                               DUG 2 ;
                               COMPARE ;
                               GT ;
                               IF { DROP 2 }
                                  { DIG 2 ;
                                    DROP ;
                                    SWAP ;
                                    DUP ;
                                    DUG 2 ;
                                    SWAP ;
                                    DUP ;
                                    DUG 2 ;
                                    COMPARE ;
                                    LT ;
                                    IF { DROP } { SWAP ; DROP } } ;
                               DUP 3 ;
                               SWAP ;
                               DUP ;
                               DUG 2 ;
                               COMPARE ;
                               GT ;
                               IF { DROP 2 }
                                  { DIG 2 ;
                                    DROP ;
                                    SWAP ;
                                    DUP ;
                                    DUG 2 ;
                                    SWAP ;
                                    DUP ;
                                    DUG 2 ;
                                    COMPARE ;
                                    LT ;
                                    IF { DROP } { SWAP ; DROP } } ;
                               ISNAT ;
                               IF_NONE { PUSH string "BAD_STATE" ; FAILWITH } {} ;
                               DIG 3 ;
                               PAIR ;
                               PAIR ;
                               DUP 3 ;
                               CDR ;
                               CDR ;
                               CAR ;
                               CAR ;
                               PAIR ;
                               PAIR ;
                               SWAP ;
                               DUP ;
                               DUG 2 ;
                               CDR ;
                               CAR ;
                               PAIR ;
                               SWAP ;
                               CAR ;
                               PAIR }
                             { DIG 2 ; DIG 11 ; DROP 3 } } ;
                     DUP 5 ;
                     CDR ;
                     CAR ;
                     CAR ;
                     CDR ;
                     PAIR ;
                     DUG 2 ;
                     PAIR ;
                     PAIR ;
                     DIG 4 ;
                     SWAP ;
                     EXEC ;
                     DIG 2 ;
                     CDR ;
                     CAR ;
                     CAR ;
                     CDR ;
                     DIG 2 ;
                     DUP 3 ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     PACK ;
                     BLAKE2B ;
                     SWAP ;
                     CDR ;
                     CDR ;
                     CAR ;
                     CAR ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     MEM ;
                     IF { DROP ; PUSH string "PROPOSAL_NOT_UNIQUE" ; FAILWITH } {} ;
                     DIG 2 ;
                     DUP 4 ;
                     CDR ;
                     CDR ;
                     CDR ;
                     PAIR ;
                     DIG 5 ;
                     SWAP ;
                     EXEC ;
                     DIG 3 ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     PUSH nat 1 ;
                     PUSH nat 2 ;
                     DIG 2 ;
                     EDIV ;
                     IF_NONE { PUSH string "MOD by 0" ; FAILWITH } {} ;
                     CDR ;
                     COMPARE ;
                     EQ ;
                     IF {} { DROP ; PUSH string "NOT_PROPOSING_STAGE" ; FAILWITH } ;
                     PUSH nat 1 ;
                     DIG 2 ;
                     ADD ;
                     EMPTY_MAP (pair address bool) nat ;
                     PUSH nat 0 ;
                     PAIR ;
                     LEVEL ;
                     DUP 4 ;
                     CDR ;
                     CDR ;
                     CAR ;
                     CDR ;
                     CAR ;
                     CDR ;
                     PAIR ;
                     PAIR ;
                     DUP 5 ;
                     GET 3 ;
                     DUP 6 ;
                     CAR ;
                     PAIR ;
                     DIG 5 ;
                     GET 4 ;
                     PUSH nat 0 ;
                     PAIR ;
                     PAIR ;
                     PAIR ;
                     PAIR ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     CDR ;
                     CDR ;
                     CDR ;
                     DUP 3 ;
                     CDR ;
                     CDR ;
                     CAR ;
                     CDR ;
                     DUP 4 ;
                     CDR ;
                     CDR ;
                     CAR ;
                     CAR ;
                     DIG 3 ;
                     DUP 6 ;
                     SWAP ;
                     SOME ;
                     SWAP ;
                     UPDATE ;
                     PAIR ;
                     PAIR ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     CDR ;
                     CAR ;
                     PAIR ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     CAR ;
                     PAIR ;
                     DUP ;
                     CDR ;
                     CDR ;
                     DIG 2 ;
                     CDR ;
                     CAR ;
                     CDR ;
                     CDR ;
                     DIG 3 ;
                     LEVEL ;
                     PAIR ;
                     PUSH bool True ;
                     SWAP ;
                     UPDATE ;
                     DUP 3 ;
                     CDR ;
                     CAR ;
                     CDR ;
                     CAR ;
                     PAIR ;
                     DUP 3 ;
                     CDR ;
                     CAR ;
                     CAR ;
                     PAIR ;
                     PAIR ;
                     SWAP ;
                     CAR ;
                     PAIR ;
                     DIG 2 ;
                     PAIR }
                   { DIG 2 ;
                     DIG 4 ;
                     DIG 5 ;
                     DIG 6 ;
                     DIG 7 ;
                     DROP 5 ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     CAR ;
                     CAR ;
                     CAR ;
                     CAR ;
                     SENDER ;
                     COMPARE ;
                     EQ ;
                     IF { SWAP } { SWAP ; DROP ; PUSH string "NOT_ADMIN" ; FAILWITH } ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     CAR ;
                     DIG 2 ;
                     CDR ;
                     SWAP ;
                     CONTRACT %transfer
                       (list (pair (address %from_)
                                   (list %txs (pair (address %to_) (pair (nat %token_id) (nat %amount)))))) ;
                     IF_NONE { PUSH string "BAD_TOKEN_CONTRACT" ; FAILWITH } {} ;
                     PUSH mutez 0 ;
                     DIG 2 ;
                     TRANSFER_TOKENS ;
                     SWAP ;
                     NIL operation ;
                     DIG 2 ;
                     CONS ;
                     PAIR } } }
           { DIG 2 ;
             DIG 4 ;
             DIG 5 ;
             DIG 7 ;
             DROP 4 ;
             SWAP ;
             DUP ;
             DUG 2 ;
             CAR ;
             CAR ;
             CAR ;
             CAR ;
             SENDER ;
             COMPARE ;
             EQ ;
             IF { SWAP } { SWAP ; DROP ; PUSH string "NOT_ADMIN" ; FAILWITH } ;
             SWAP ;
             DUP ;
             DUG 2 ;
             SELF_ADDRESS ;
             COMPARE ;
             EQ ;
             IF { DUP ;
                  CDR ;
                  SWAP ;
                  DUP ;
                  DUG 2 ;
                  CAR ;
                  CDR ;
                  DUP 3 ;
                  CAR ;
                  CAR ;
                  CDR ;
                  DIG 3 ;
                  CAR ;
                  CAR ;
                  CAR ;
                  CDR ;
                  DIG 4 ;
                  PAIR ;
                  PAIR ;
                  PAIR ;
                  PAIR }
                { DUP ;
                  CDR ;
                  CDR ;
                  SWAP ;
                  DUP ;
                  DUG 2 ;
                  CDR ;
                  CAR ;
                  CDR ;
                  DIG 3 ;
                  DUP 4 ;
                  CDR ;
                  CAR ;
                  CAR ;
                  CAR ;
                  PAIR ;
                  PAIR ;
                  PAIR ;
                  SWAP ;
                  CAR ;
                  PAIR } ;
             DIG 2 ;
             PAIR } }
       { SWAP ;
         DUP ;
         DUG 2 ;
         DIG 3 ;
         DIG 2 ;
         PUSH mutez 0 ;
         AMOUNT ;
         COMPARE ;
         GT ;
         IF { SWAP ;
              DIG 2 ;
              DIG 4 ;
              DIG 5 ;
              DIG 6 ;
              DIG 7 ;
              DIG 8 ;
              DIG 9 ;
              DIG 10 ;
              DIG 11 ;
              DIG 12 ;
              DROP 12 ;
              PUSH string "FORBIDDEN_XTZ" ;
              FAILWITH }
            { IF_LEFT
                { DIG 5 ;
                  DROP ;
                  IF_LEFT
                    { DIG 5 ;
                      DIG 7 ;
                      DIG 8 ;
                      DIG 9 ;
                      DROP 4 ;
                      IF_LEFT
                        { DIG 7 ;
                          DROP ;
                          SWAP ;
                          DUG 2 ;
                          DUP 3 ;
                          SWAP ;
                          DUP ;
                          DUG 2 ;
                          SWAP ;
                          DUP ;
                          DUG 2 ;
                          SWAP ;
                          DUP ;
                          DUG 2 ;
                          PAIR ;
                          DIG 8 ;
                          SWAP ;
                          EXEC ;
                          DIG 2 ;
                          CDR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          DUG 2 ;
                          DUP ;
                          DUG 3 ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          PAIR ;
                          MEM ;
                          IF {} { DROP ; PUSH string "PROPOSAL_NOT_EXIST" ; FAILWITH } ;
                          DUP 3 ;
                          CDR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          SWAP ;
                          DUP ;
                          DUG 2 ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          ADD ;
                          LEVEL ;
                          COMPARE ;
                          GE ;
                          SOURCE ;
                          SENDER ;
                          COMPARE ;
                          NEQ ;
                          DUP 6 ;
                          CAR ;
                          CDR ;
                          CDR ;
                          CDR ;
                          SENDER ;
                          COMPARE ;
                          EQ ;
                          AND ;
                          DUP 3 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          SENDER ;
                          COMPARE ;
                          EQ ;
                          OR ;
                          OR ;
                          IF { DIG 3 ;
                               DUP 4 ;
                               CAR ;
                               CAR ;
                               CDR ;
                               CAR ;
                               PAIR ;
                               DUP 4 ;
                               CDR ;
                               CAR ;
                               CAR ;
                               CDR ;
                               DUP 3 ;
                               PAIR ;
                               PUSH bool False ;
                               DIG 5 ;
                               CDR ;
                               CDR ;
                               CDR ;
                               PAIR ;
                               PAIR ;
                               PAIR ;
                               DIG 4 ;
                               SWAP ;
                               EXEC ;
                               DUG 2 ;
                               CAR ;
                               CDR ;
                               CAR ;
                               CDR ;
                               DUP 3 ;
                               CDR ;
                               CDR ;
                               DUP 4 ;
                               CDR ;
                               CAR ;
                               CDR ;
                               CDR ;
                               DIG 3 ;
                               DIG 3 ;
                               PAIR ;
                               PUSH bool False ;
                               SWAP ;
                               UPDATE ;
                               DUP 3 ;
                               CDR ;
                               CAR ;
                               CDR ;
                               CAR ;
                               PAIR ;
                               DUP 3 ;
                               CDR ;
                               CAR ;
                               CAR ;
                               PAIR ;
                               PAIR ;
                               SWAP ;
                               CAR ;
                               PAIR ;
                               DIG 2 ;
                               PAIR }
                             { SWAP ;
                               DIG 2 ;
                               DIG 3 ;
                               DIG 5 ;
                               DIG 6 ;
                               DROP 6 ;
                               PUSH string "DROP_PROPOSAL_CONDITION_NOT_MET" ;
                               FAILWITH } }
                        { SWAP ;
                          DUG 2 ;
                          PUSH nat 0 ;
                          SWAP ;
                          DUP ;
                          DUG 2 ;
                          COMPARE ;
                          EQ ;
                          IF { SWAP ;
                               DIG 2 ;
                               DIG 4 ;
                               DIG 5 ;
                               DIG 6 ;
                               DIG 7 ;
                               DROP 7 ;
                               PUSH string "BAD_ENTRYPOINT_PARAMETER" ;
                               FAILWITH }
                             { PUSH nat 0 ;
                               PAIR ;
                               DUP 3 ;
                               DUP 8 ;
                               PAIR ;
                               PAIR ;
                               DIG 2 ;
                               CDR ;
                               CAR ;
                               CDR ;
                               CDR ;
                               ITER { SWAP ;
                                      UNPAIR ;
                                      UNPAIR ;
                                      DIG 3 ;
                                      UNPAIR ;
                                      DIG 4 ;
                                      DIG 3 ;
                                      PAIR ;
                                      DIG 3 ;
                                      DIG 3 ;
                                      PAIR ;
                                      DIG 2 ;
                                      DUP 4 ;
                                      DIG 2 ;
                                      UNPAIR ;
                                      DIG 4 ;
                                      UNPAIR ;
                                      DUP 4 ;
                                      DUP 4 ;
                                      PAIR ;
                                      DUP 11 ;
                                      SWAP ;
                                      EXEC ;
                                      DUP 6 ;
                                      CDR ;
                                      CAR ;
                                      CDR ;
                                      CDR ;
                                      SWAP ;
                                      DUP ;
                                      DUG 2 ;
                                      CAR ;
                                      CDR ;
                                      CAR ;
                                      CDR ;
                                      ADD ;
                                      LEVEL ;
                                      COMPARE ;
                                      GE ;
                                      IF { DROP 7 ; PUSH string "EXPIRED_PROPOSAL" ; FAILWITH }
                                         { DUP 3 ;
                                           CDR ;
                                           DUP 4 ;
                                           CAR ;
                                           COMPARE ;
                                           LT ;
                                           DUP 7 ;
                                           CDR ;
                                           CDR ;
                                           CAR ;
                                           CAR ;
                                           DUP 3 ;
                                           CAR ;
                                           CDR ;
                                           CAR ;
                                           CDR ;
                                           ADD ;
                                           LEVEL ;
                                           COMPARE ;
                                           GE ;
                                           AND ;
                                           IF { DUP 3 ;
                                                CDR ;
                                                PUSH nat 1 ;
                                                DIG 4 ;
                                                CAR ;
                                                ADD ;
                                                PAIR ;
                                                SWAP ;
                                                DUP ;
                                                DUG 2 ;
                                                CAR ;
                                                CAR ;
                                                CAR ;
                                                CAR ;
                                                DUP 3 ;
                                                CAR ;
                                                CDR ;
                                                CDR ;
                                                CAR ;
                                                COMPARE ;
                                                GT ;
                                                DUP 6 ;
                                                DUP 4 ;
                                                DUP ;
                                                CAR ;
                                                CAR ;
                                                CAR ;
                                                CAR ;
                                                SWAP ;
                                                DUP ;
                                                DUG 2 ;
                                                CAR ;
                                                CDR ;
                                                CDR ;
                                                CAR ;
                                                ADD ;
                                                DIG 2 ;
                                                CAR ;
                                                CDR ;
                                                CAR ;
                                                CDR ;
                                                DUP 17 ;
                                                DIG 2 ;
                                                MUL ;
                                                EDIV ;
                                                IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                                                CAR ;
                                                SWAP ;
                                                CAR ;
                                                CDR ;
                                                CAR ;
                                                CAR ;
                                                SWAP ;
                                                COMPARE ;
                                                GE ;
                                                AND ;
                                                DIG 5 ;
                                                DUP 7 ;
                                                CAR ;
                                                CAR ;
                                                CDR ;
                                                CAR ;
                                                PAIR ;
                                                DUP 7 ;
                                                CDR ;
                                                CAR ;
                                                CAR ;
                                                CDR ;
                                                DUP 5 ;
                                                PAIR ;
                                                DUP 3 ;
                                                DUP 9 ;
                                                CDR ;
                                                CDR ;
                                                CDR ;
                                                PAIR ;
                                                PAIR ;
                                                PAIR ;
                                                DUP 11 ;
                                                SWAP ;
                                                EXEC ;
                                                SWAP ;
                                                IF { DIG 2 ;
                                                     SWAP ;
                                                     DUP ;
                                                     DUG 2 ;
                                                     CAR ;
                                                     CAR ;
                                                     CDR ;
                                                     CAR ;
                                                     PAIR ;
                                                     DIG 5 ;
                                                     CAR ;
                                                     CAR ;
                                                     CAR ;
                                                     CDR ;
                                                     SWAP ;
                                                     EXEC ;
                                                     SWAP ;
                                                     DUP ;
                                                     DUG 2 ;
                                                     CDR ;
                                                     DUP 3 ;
                                                     CAR ;
                                                     CDR ;
                                                     DUP 4 ;
                                                     CAR ;
                                                     CAR ;
                                                     CDR ;
                                                     CDR ;
                                                     DUP 4 ;
                                                     CAR ;
                                                     CAR ;
                                                     PAIR ;
                                                     DUP 5 ;
                                                     CAR ;
                                                     CAR ;
                                                     CAR ;
                                                     PAIR ;
                                                     PAIR ;
                                                     PAIR ;
                                                     DUP ;
                                                     CDR ;
                                                     DUP 3 ;
                                                     CAR ;
                                                     CDR ;
                                                     IF_NONE { DIG 3 ; CAR ; CDR ; CDR ; CDR } { DIG 4 ; DROP } ;
                                                     DUP 3 ;
                                                     CAR ;
                                                     CDR ;
                                                     CDR ;
                                                     CAR ;
                                                     PAIR ;
                                                     DUP 3 ;
                                                     CAR ;
                                                     CDR ;
                                                     CAR ;
                                                     PAIR ;
                                                     DIG 2 ;
                                                     CAR ;
                                                     CAR ;
                                                     PAIR ;
                                                     PAIR ;
                                                     SWAP ;
                                                     CDR ;
                                                     PAIR }
                                                   { DIG 2 ; DIG 5 ; DROP 2 ; DUP 10 ; PAIR } ;
                                                UNPAIR ;
                                                DIG 3 ;
                                                ITER { CONS } ;
                                                DUG 2 ;
                                                DIG 3 ;
                                                DIG 4 ;
                                                DUP 3 ;
                                                CDR ;
                                                CDR ;
                                                DUP 4 ;
                                                CDR ;
                                                CAR ;
                                                CDR ;
                                                CDR ;
                                                DIG 3 ;
                                                DIG 3 ;
                                                PAIR ;
                                                PUSH bool False ;
                                                SWAP ;
                                                UPDATE ;
                                                DUP 3 ;
                                                CDR ;
                                                CAR ;
                                                CDR ;
                                                CAR ;
                                                PAIR ;
                                                DUP 3 ;
                                                CDR ;
                                                CAR ;
                                                CAR ;
                                                PAIR ;
                                                PAIR ;
                                                SWAP ;
                                                CAR ;
                                                PAIR ;
                                                DIG 2 ;
                                                PAIR ;
                                                PAIR }
                                              { DIG 3 ; DIG 5 ; DIG 6 ; DROP 4 ; SWAP ; DUG 2 ; PAIR ; PAIR } } } ;
                               SWAP ;
                               DIG 3 ;
                               DIG 4 ;
                               DIG 5 ;
                               DIG 6 ;
                               DROP 5 ;
                               UNPAIR ;
                               UNPAIR ;
                               PUSH nat 0 ;
                               DIG 3 ;
                               CAR ;
                               COMPARE ;
                               EQ ;
                               IF { DROP 2 ; PUSH string "EMPTY_FLUSH" ; FAILWITH } { PAIR } } } }
                    { DIG 4 ;
                      DIG 6 ;
                      DIG 10 ;
                      DIG 11 ;
                      DROP 4 ;
                      IF_LEFT
                        { DIG 6 ;
                          DROP ;
                          SWAP ;
                          DUG 2 ;
                          SENDER ;
                          DUP 4 ;
                          CAR ;
                          CDR ;
                          CDR ;
                          CAR ;
                          DUP 5 ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          PAIR ;
                          SWAP ;
                          DUP ;
                          DUG 2 ;
                          DUP 4 ;
                          DIG 2 ;
                          UNPAIR ;
                          DIG 3 ;
                          NIL (pair address (pair nat nat)) ;
                          SELF_ADDRESS ;
                          DUP 5 ;
                          CDR ;
                          DUP 7 ;
                          SWAP ;
                          PAIR ;
                          SWAP ;
                          PAIR ;
                          CONS ;
                          SWAP ;
                          PAIR ;
                          DIG 2 ;
                          CAR ;
                          NIL (pair address (list (pair address (pair nat nat)))) ;
                          DIG 2 ;
                          CONS ;
                          PAIR ;
                          DIG 10 ;
                          SWAP ;
                          EXEC ;
                          DUG 2 ;
                          ADD ;
                          NIL operation ;
                          DIG 2 ;
                          CONS ;
                          DIG 4 ;
                          CDR ;
                          CAR ;
                          CAR ;
                          CDR ;
                          DUP 6 ;
                          CDR ;
                          CDR ;
                          CDR ;
                          PAIR ;
                          DIG 7 ;
                          SWAP ;
                          EXEC ;
                          DUP 6 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          DUP 5 ;
                          GET ;
                          IF_NONE
                            { DIG 7 ;
                              DROP ;
                              PUSH nat 0 ;
                              PUSH nat 0 ;
                              PAIR ;
                              DIG 5 ;
                              DIG 2 ;
                              PAIR ;
                              PAIR }
                            { SWAP ;
                              PAIR ;
                              DIG 7 ;
                              SWAP ;
                              EXEC ;
                              DIG 4 ;
                              SWAP ;
                              DUP ;
                              DUG 2 ;
                              CDR ;
                              SWAP ;
                              DUP 3 ;
                              CAR ;
                              CDR ;
                              ADD ;
                              DIG 2 ;
                              CAR ;
                              CAR ;
                              PAIR ;
                              PAIR } ;
                          DUP 5 ;
                          CDR ;
                          DUP 6 ;
                          CAR ;
                          CDR ;
                          CDR ;
                          DIG 4 ;
                          DUP 7 ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CAR ;
                          PAIR ;
                          PAIR ;
                          DUP 6 ;
                          CAR ;
                          CAR ;
                          PAIR ;
                          PAIR ;
                          DUP ;
                          CDR ;
                          SWAP ;
                          DUP ;
                          DUG 2 ;
                          CAR ;
                          CDR ;
                          DIG 6 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          DIG 4 ;
                          SOME ;
                          DIG 6 ;
                          UPDATE ;
                          DUP 4 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          PAIR ;
                          DIG 3 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          PAIR ;
                          PAIR ;
                          PAIR ;
                          SWAP ;
                          PAIR }
                        { SWAP ;
                          DUG 2 ;
                          SENDER ;
                          DIG 2 ;
                          CDR ;
                          CAR ;
                          CAR ;
                          CDR ;
                          DUP 4 ;
                          CDR ;
                          CDR ;
                          CDR ;
                          PAIR ;
                          DIG 5 ;
                          SWAP ;
                          EXEC ;
                          DUP 4 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          DUP 3 ;
                          GET ;
                          IF_NONE
                            { SWAP ;
                              DIG 5 ;
                              DIG 6 ;
                              DROP 4 ;
                              PUSH unit Unit ;
                              PUSH string "NOT_ENOUGH_FROZEN_TOKENS" ;
                              PAIR ;
                              FAILWITH }
                            { SWAP ;
                              PAIR ;
                              DIG 5 ;
                              SWAP ;
                              EXEC ;
                              DUP 3 ;
                              PAIR ;
                              DIG 5 ;
                              SWAP ;
                              EXEC ;
                              DUP 4 ;
                              CAR ;
                              CAR ;
                              CDR ;
                              CDR ;
                              SWAP ;
                              SOME ;
                              DIG 2 ;
                              UPDATE } ;
                          DUP 3 ;
                          CAR ;
                          CDR ;
                          CDR ;
                          CAR ;
                          DUP 4 ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          PAIR ;
                          SENDER ;
                          DIG 3 ;
                          DIG 2 ;
                          UNPAIR ;
                          SELF_ADDRESS ;
                          NIL (pair address (pair nat nat)) ;
                          DIG 5 ;
                          DUP 5 ;
                          CDR ;
                          DUP 7 ;
                          SWAP ;
                          PAIR ;
                          SWAP ;
                          PAIR ;
                          CONS ;
                          SWAP ;
                          PAIR ;
                          DIG 2 ;
                          CAR ;
                          NIL (pair address (list (pair address (pair nat nat)))) ;
                          DIG 2 ;
                          CONS ;
                          PAIR ;
                          DIG 6 ;
                          SWAP ;
                          EXEC ;
                          DUG 2 ;
                          SUB ;
                          ISNAT ;
                          IF_NONE { PUSH string "BAD_STATE" ; FAILWITH } {} ;
                          NIL operation ;
                          DIG 2 ;
                          CONS ;
                          DUP 4 ;
                          CDR ;
                          DUP 5 ;
                          CAR ;
                          CDR ;
                          DIG 4 ;
                          DUP 6 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          PAIR ;
                          DIG 5 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          PAIR ;
                          PAIR ;
                          PAIR ;
                          DUP ;
                          CDR ;
                          SWAP ;
                          DUP ;
                          DUG 2 ;
                          CAR ;
                          CDR ;
                          CDR ;
                          DIG 4 ;
                          DUP 4 ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CAR ;
                          PAIR ;
                          PAIR ;
                          DIG 2 ;
                          CAR ;
                          CAR ;
                          PAIR ;
                          PAIR ;
                          SWAP ;
                          PAIR } } }
                { DIG 4 ;
                  DIG 8 ;
                  DIG 9 ;
                  DIG 10 ;
                  DIG 12 ;
                  DROP 5 ;
                  IF_LEFT
                    { DIG 2 ;
                      DIG 4 ;
                      DIG 5 ;
                      DIG 6 ;
                      DROP 4 ;
                      SWAP ;
                      DUP ;
                      DUG 2 ;
                      CDR ;
                      DUP 3 ;
                      CAR ;
                      CDR ;
                      DUP 4 ;
                      CAR ;
                      CAR ;
                      CDR ;
                      DUP 5 ;
                      CAR ;
                      CAR ;
                      CAR ;
                      CDR ;
                      DIG 4 ;
                      ITER { SWAP ;
                             SENDER ;
                             DUP 3 ;
                             CDR ;
                             SWAP ;
                             PAIR ;
                             SWAP ;
                             DIG 2 ;
                             CAR ;
                             IF { UNIT ; SOME } { NONE unit } ;
                             DIG 2 ;
                             UPDATE } ;
                      DIG 4 ;
                      CAR ;
                      CAR ;
                      CAR ;
                      CAR ;
                      PAIR ;
                      PAIR ;
                      PAIR ;
                      PAIR ;
                      DIG 2 ;
                      PAIR }
                    { ITER { DUP ;
                             DUG 2 ;
                             DUP ;
                             CDR ;
                             IF_NONE
                               { SWAP ; SENDER ; DIG 2 ; CAR ; PAIR ; PAIR }
                               { DUG 2 ;
                                 CAR ;
                                 DUP ;
                                 DUG 3 ;
                                 SWAP ;
                                 DUP ;
                                 DUG 2 ;
                                 CDR ;
                                 CDR ;
                                 DUP 3 ;
                                 CDR ;
                                 CAR ;
                                 CDR ;
                                 CDR ;
                                 PUSH nat 1 ;
                                 DUP 5 ;
                                 CDR ;
                                 CAR ;
                                 CDR ;
                                 CAR ;
                                 ADD ;
                                 PAIR ;
                                 DUP 4 ;
                                 CDR ;
                                 CAR ;
                                 CAR ;
                                 PAIR ;
                                 PAIR ;
                                 DUP 3 ;
                                 CAR ;
                                 PAIR ;
                                 SWAP ;
                                 DIG 2 ;
                                 CDR ;
                                 CAR ;
                                 CDR ;
                                 CAR ;
                                 PAIR ;
                                 SELF_ADDRESS ;
                                 CHAIN_ID ;
                                 PAIR ;
                                 PAIR ;
                                 PACK ;
                                 DIG 2 ;
                                 SWAP ;
                                 DUP ;
                                 DUG 2 ;
                                 SWAP ;
                                 DUP ;
                                 DUG 2 ;
                                 CDR ;
                                 DUP 3 ;
                                 CAR ;
                                 CHECK_SIGNATURE ;
                                 IF { SWAP ; DROP ; CAR ; HASH_KEY ; IMPLICIT_ACCOUNT ; ADDRESS }
                                    { DROP ; PUSH string "MISSIGNED" ; PAIR ; FAILWITH } ;
                                 DIG 2 ;
                                 PAIR ;
                                 PAIR } ;
                             UNPAIR ;
                             UNPAIR ;
                             DUP 3 ;
                             DIG 2 ;
                             DIG 4 ;
                             CAR ;
                             CAR ;
                             CAR ;
                             DIG 2 ;
                             CAR ;
                             CAR ;
                             CAR ;
                             CDR ;
                             SWAP ;
                             DUP ;
                             DUG 2 ;
                             DUP 4 ;
                             SWAP ;
                             PAIR ;
                             MEM ;
                             NOT ;
                             SWAP ;
                             DUP ;
                             DUG 2 ;
                             DIG 3 ;
                             COMPARE ;
                             NEQ ;
                             AND ;
                             IF { DROP ; PUSH string "NOT_DELEGATE" ; FAILWITH } {} ;
                             DUP 3 ;
                             DUP 3 ;
                             CAR ;
                             CDR ;
                             SWAP ;
                             DUP ;
                             DUG 2 ;
                             SWAP ;
                             DUP ;
                             DUG 2 ;
                             PAIR ;
                             DUP 11 ;
                             SWAP ;
                             EXEC ;
                             DIG 2 ;
                             CDR ;
                             CAR ;
                             CDR ;
                             CDR ;
                             DUG 2 ;
                             DUP ;
                             DUG 3 ;
                             CAR ;
                             CDR ;
                             CAR ;
                             CDR ;
                             PAIR ;
                             MEM ;
                             IF {} { DROP ; PUSH string "PROPOSAL_NOT_EXIST" ; FAILWITH } ;
                             DIG 2 ;
                             SWAP ;
                             DUP ;
                             DUG 2 ;
                             DUP 6 ;
                             SWAP ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CDR ;
                             SIZE ;
                             SWAP ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CDR ;
                             COMPARE ;
                             LE ;
                             IF { DROP ; PUSH string "MAX_VOTERS_REACHED" ; FAILWITH } {} ;
                             DIG 3 ;
                             DUP 5 ;
                             CDR ;
                             CAR ;
                             CAR ;
                             CDR ;
                             DUP 4 ;
                             SWAP ;
                             DUP 3 ;
                             CDR ;
                             CDR ;
                             CDR ;
                             PAIR ;
                             DUP 10 ;
                             SWAP ;
                             EXEC ;
                             SWAP ;
                             CDR ;
                             SWAP ;
                             COMPARE ;
                             EQ ;
                             IF {} { DROP ; PUSH string "VOTING_STAGE_OVER" ; FAILWITH } ;
                             DUP 5 ;
                             CDR ;
                             CAR ;
                             CAR ;
                             CDR ;
                             DIG 4 ;
                             PAIR ;
                             DIG 2 ;
                             DIG 3 ;
                             DIG 2 ;
                             UNPAIR ;
                             DUP 4 ;
                             CDR ;
                             CDR ;
                             SWAP ;
                             DUP ;
                             DUG 2 ;
                             PAIR ;
                             DUP 4 ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CDR ;
                             SWAP ;
                             DUP ;
                             DUG 2 ;
                             GET ;
                             IF_NONE { DUP 5 ; CDR ; CAR } { DUP 6 ; CDR ; CAR ; ADD } ;
                             DUP 5 ;
                             CDR ;
                             DUP 6 ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CDR ;
                             DIG 2 ;
                             DIG 3 ;
                             SWAP ;
                             SOME ;
                             SWAP ;
                             UPDATE ;
                             DUP 5 ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CAR ;
                             PAIR ;
                             DUP 5 ;
                             CAR ;
                             CDR ;
                             CAR ;
                             PAIR ;
                             DIG 4 ;
                             CAR ;
                             CAR ;
                             PAIR ;
                             PAIR ;
                             DUP 4 ;
                             CDR ;
                             CDR ;
                             IF { DUP ;
                                  CDR ;
                                  SWAP ;
                                  DUP ;
                                  DUG 2 ;
                                  CAR ;
                                  CDR ;
                                  CDR ;
                                  CDR ;
                                  DUP 6 ;
                                  CDR ;
                                  CAR ;
                                  DUP 4 ;
                                  CAR ;
                                  CDR ;
                                  CDR ;
                                  CAR ;
                                  ADD ;
                                  PAIR ;
                                  DUP 3 ;
                                  CAR ;
                                  CDR ;
                                  CAR ;
                                  PAIR ;
                                  DIG 2 ;
                                  CAR ;
                                  CAR ;
                                  PAIR ;
                                  PAIR }
                                { DUP ;
                                  CDR ;
                                  SWAP ;
                                  DUP ;
                                  DUG 2 ;
                                  CAR ;
                                  CDR ;
                                  DUP 3 ;
                                  CAR ;
                                  CAR ;
                                  CDR ;
                                  DUP 4 ;
                                  CAR ;
                                  CAR ;
                                  CAR ;
                                  CDR ;
                                  DUP 8 ;
                                  CDR ;
                                  CAR ;
                                  DIG 5 ;
                                  CAR ;
                                  CAR ;
                                  CAR ;
                                  CAR ;
                                  ADD ;
                                  PAIR ;
                                  PAIR ;
                                  PAIR ;
                                  PAIR } ;
                             DIG 4 ;
                             DIG 3 ;
                             PAIR ;
                             DIG 2 ;
                             DUP 4 ;
                             CDR ;
                             CAR ;
                             PAIR ;
                             PAIR ;
                             DUP 6 ;
                             SWAP ;
                             EXEC ;
                             DUP ;
                             CDR ;
                             CDR ;
                             CDR ;
                             SWAP ;
                             DUP ;
                             DUG 2 ;
                             CDR ;
                             CDR ;
                             CAR ;
                             CDR ;
                             DUP 3 ;
                             CDR ;
                             CDR ;
                             CAR ;
                             CAR ;
                             DIG 4 ;
                             DIG 5 ;
                             CAR ;
                             CDR ;
                             SWAP ;
                             SOME ;
                             SWAP ;
                             UPDATE ;
                             PAIR ;
                             PAIR ;
                             SWAP ;
                             DUP ;
                             DUG 2 ;
                             CDR ;
                             CAR ;
                             PAIR ;
                             SWAP ;
                             CAR ;
                             PAIR } ;
                      SWAP ;
                      DIG 3 ;
                      DIG 4 ;
                      DIG 5 ;
                      DROP 4 ;
                      DIG 2 ;
                      PAIR } } } } ;
     UNPAIR ;
     DUG 2 ;
     PAIR ;
     SWAP ;
     PAIR } 
`