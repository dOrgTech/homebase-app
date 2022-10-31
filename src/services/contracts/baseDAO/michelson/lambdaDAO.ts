export default `parameter
(or (or (or (or (or (unit %accept_ownership) (unit %default))
                (or (pair %propose (address %from) (nat %frozen_token) (bytes %proposal_metadata))
                    (pair %transfer_contract_tokens
                       (address %contract_address)
                       (list %params
                          (pair (address %from_) (list %txs (pair (address %to_) (nat %token_id) (nat %amount))))))))
            (address %transfer_ownership))
        (or %custom_entrypoints
           (pair %lookup_registry (string %key) (address %callback))
           (unit %registryCepDummy)))
    (or (or (or (bytes %drop_proposal) (nat %flush)) (or (nat %freeze) (nat %unfreeze)))
        (or (or (list %unstake_vote bytes)
                (list %update_delegate (pair (bool %enable) (address %delegate))))
            (list %vote
               (pair (pair %argument
                        (pair (address %from) (bytes %proposal_key))
                        (nat %vote_amount)
                        (bool %vote_type))
                     (option %permit (pair (key %key) (signature %signature)))))))) ;
storage
(pair (pair (pair (pair (pair (address %admin)
                              (pair %config
                                 (pair (pair (pair (nat %fixed_proposal_fee_in_token) (nat %governance_total_supply))
                                             (int %max_quorum_change)
                                             (int %max_quorum_threshold))
                                       (pair (int %min_quorum_threshold) (nat %period))
                                       (nat %proposal_expired_level)
                                       (nat %proposal_flush_level))
                                 (int %quorum_change)))
                        (big_map %delegates (pair (address %owner) (address %delegate)) unit)
                        (pair %extra
                           (map %handler_storage string bytes)
                           (big_map %lambdas
                              string
                              (pair (pair (lambda %code
                                             (pair (pair (map %handler_storage string bytes) (bytes %packed_argument))
                                                   (pair %proposal_info
                                                      (address %from)
                                                      (nat %frozen_token)
                                                      (bytes %proposal_metadata)))
                                             (pair (pair (option %guardian address) (map %handler_storage string bytes))
                                                   (list %operations operation)))
                                          (lambda %handler_check (pair bytes (map string bytes)) unit))
                                    (bool %is_active)))))
                  (pair (big_map %freeze_history
                           address
                           (pair (pair (nat %current_stage_num) (nat %current_unstaked))
                                 (nat %past_unstaked)
                                 (nat %staked)))
                        (nat %frozen_token_id))
                  (nat %frozen_total_supply)
                  (pair %governance_token (address %address) (nat %token_id)))
            (pair (pair (address %guardian) (big_map %metadata string bytes))
                  (option %ongoing_proposals_dlist
                     (pair (bytes %first) (bytes %last) (big_map %map (pair bytes bool) bytes)))
                  (address %pending_owner))
            (pair (nat %permits_counter)
                  (big_map %proposals
                     bytes
                     (pair (pair (pair (nat %downvotes) (bytes %metadata))
                                 (address %proposer)
                                 (nat %proposer_frozen_token))
                           (pair (nat %quorum_threshold) (nat %start_level))
                           (nat %upvotes)
                           (nat %voting_stage_num))))
            (pair %quorum_threshold_at_cycle
               (pair (nat %last_updated_cycle) (nat %quorum_threshold))
               (nat %staked))
            (big_map %staked_votes (pair address bytes) nat))
      (nat %start_level)) ;
code { LAMBDA
       (pair string (map string bytes))
       nat
       { UNPAIR ;
         GET ;
         IF_NONE
           { PUSH string "expected nat value was not found" ; FAILWITH }
           { UNPACK nat ;
             IF_NONE { PUSH string "decoding of Nat value failed" ; FAILWITH } {} } } ;
     PUSH nat 1000000 ;
     PUSH bool False ;
     NIL operation ;
     LAMBDA
       bytes
       (or (or (pair (pair (lambda
                              (pair (pair (map string bytes) bytes) (pair address nat bytes))
                              (pair (pair (option address) (map string bytes)) (list operation)))
                           (lambda (pair bytes (map string bytes)) unit))
                     string)
               (pair string bytes))
           string)
       { UNPACK
           (or (or (pair %add_handler
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
               (string %remove_handler)) ;
         IF_NONE { PUSH nat 111 ; FAILWITH } {} } ;
     PUSH string "PROPOSAL_HANDLER_NOT_FOUND" ;
     PUSH string "PROPOSAL_HANDLER_EXISTS" ;
     LAMBDA string unit { PUSH nat 102 ; PAIR ; FAILWITH } ;
     LAMBDA
       (pair string
             (map string bytes)
             (big_map
                string
                (pair (pair (lambda
                               (pair (pair (map string bytes) bytes) (pair address nat bytes))
                               (pair (pair (option address) (map string bytes)) (list operation)))
                            (lambda (pair bytes (map string bytes)) unit))
                      bool)))
       bool
       { UNPAIR ; SWAP ; CDR ; SWAP ; MEM } ;
     LAMBDA
       (pair (list (pair address (list (pair address nat nat)))) address)
       operation
       { UNPAIR ;
         SWAP ;
         CONTRACT %transfer
           (list (pair (address %from_) (list %txs (pair (address %to_) (nat %token_id) (nat %amount))))) ;
         IF_NONE { PUSH nat 115 ; FAILWITH } {} ;
         PUSH mutez 0 ;
         DIG 2 ;
         TRANSFER_TOKENS } ;
     LAMBDA
       (pair nat (pair nat nat) nat nat)
       (pair (pair nat nat) nat nat)
       { UNPAIR ;
         DUP 2 ;
         CDR ;
         CAR ;
         SUB ;
         ISNAT ;
         IF_NONE
           { DROP ; PUSH nat 114 ; FAILWITH }
           { DUP 2 ; CDR ; CDR ; SWAP ; PAIR ; SWAP ; CAR ; PAIR } } ;
     LAMBDA
       (pair nat (pair nat nat) nat nat)
       (pair (pair nat nat) nat nat)
       { UNPAIR ;
         DUP ;
         DUP 3 ;
         CAR ;
         CAR ;
         COMPARE ;
         LT ;
         IF { DUP 2 ;
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
             (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                               (big_map (pair address address) unit)
                               (pair (map string bytes)
                                     (big_map
                                        string
                                        (pair (pair (lambda
                                                       (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                       (pair (pair (option address) (map string bytes)) (list operation)))
                                                    (lambda (pair bytes (map string bytes)) unit))
                                              bool))))
                         (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                         nat
                         (pair address nat))
                   (pair (pair address (big_map string bytes))
                         (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                         address)
                   (pair nat
                         (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                   (pair (pair nat nat) nat)
                   (big_map (pair address bytes) nat))
             nat)
       (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)
       { UNPAIR ;
         SWAP ;
         CAR ;
         CDR ;
         CDR ;
         CAR ;
         CDR ;
         SWAP ;
         GET ;
         IF_NONE { PUSH nat 103 ; FAILWITH } {} } ;
     LAMBDA
       (pair nat nat)
       nat
       { UNPAIR ;
         LEVEL ;
         SUB ;
         ISNAT ;
         IF_NONE
           { DROP ; PUSH nat 300 ; FAILWITH }
           { EDIV ; IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ; CAR } } ;
     DUP 13 ;
     INT ;
     LAMBDA
       (pair (pair (lambda (pair nat nat) nat)
                   (lambda (pair nat (pair nat nat) nat nat) (pair (pair nat nat) nat nat)))
             (pair (pair (pair nat nat) address nat)
                   (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                                     (big_map (pair address address) unit)
                                     (pair (map string bytes)
                                           (big_map
                                              string
                                              (pair (pair (lambda
                                                             (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                             (pair (pair (option address) (map string bytes)) (list operation)))
                                                          (lambda (pair bytes (map string bytes)) unit))
                                                    bool))))
                               (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                               nat
                               (pair address nat))
                         (pair (pair address (big_map string bytes))
                               (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                               address)
                         (pair nat
                               (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                         (pair (pair nat nat) nat)
                         (big_map (pair address bytes) nat))
                   nat))
       (pair (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                               (big_map (pair address address) unit)
                               (pair (map string bytes)
                                     (big_map
                                        string
                                        (pair (pair (lambda
                                                       (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                       (pair (pair (option address) (map string bytes)) (list operation)))
                                                    (lambda (pair bytes (map string bytes)) unit))
                                              bool))))
                         (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                         nat
                         (pair address nat))
                   (pair (pair address (big_map string bytes))
                         (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                         address)
                   (pair nat
                         (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                   (pair (pair nat nat) nat)
                   (big_map (pair address bytes) nat))
             nat)
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
         PAIR ;
         DIG 5 ;
         SWAP ;
         EXEC ;
         DUP 5 ;
         CAR ;
         CAR ;
         CDR ;
         CAR ;
         CAR ;
         DUP 3 ;
         GET ;
         IF_NONE
           { DROP 6 ; PUSH nat 300 ; FAILWITH }
           { SWAP ;
             PAIR ;
             DIG 5 ;
             SWAP ;
             EXEC ;
             DUP 4 ;
             DUP 4 ;
             ADD ;
             DUP 2 ;
             CDR ;
             CDR ;
             SUB ;
             ISNAT ;
             IF_NONE
               { DIG 2 ; DROP 2 ; PUSH nat 300 ; FAILWITH }
               { DUP 2 ;
                 CDR ;
                 CAR ;
                 PAIR ;
                 DUP 2 ;
                 CAR ;
                 PAIR ;
                 DUP ;
                 CDR ;
                 CDR ;
                 DIG 4 ;
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
             CAR ;
             CDR ;
             CDR ;
             CAR ;
             SUB ;
             ISNAT ;
             IF_NONE { PUSH nat 300 ; FAILWITH } {} ;
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
             DUP 7 ;
             CAR ;
             CAR ;
             CDR ;
             CAR ;
             CDR ;
             DUP 8 ;
             CAR ;
             CAR ;
             CDR ;
             CAR ;
             CAR ;
             DIG 6 ;
             SOME ;
             DIG 7 ;
             UPDATE ;
             PAIR ;
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
             DUP 2 ;
             CAR ;
             CDR ;
             DUP 3 ;
             CAR ;
             CAR ;
             CDR ;
             CDR ;
             CDR ;
             DIG 4 ;
             PAIR ;
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
             PAIR } } ;
     DUP 5 ;
     DUP 4 ;
     PAIR ;
     APPLY ;
     LAMBDA
       (pair (pair (lambda (pair nat nat) nat)
                   (lambda (pair nat (pair nat nat) nat nat) (pair (pair nat nat) nat nat))
                   (lambda (pair nat (pair nat nat) nat nat) (pair (pair nat nat) nat nat)))
             (pair (pair nat address)
                   nat
                   (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                                     (big_map (pair address address) unit)
                                     (pair (map string bytes)
                                           (big_map
                                              string
                                              (pair (pair (lambda
                                                             (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                             (pair (pair (option address) (map string bytes)) (list operation)))
                                                          (lambda (pair bytes (map string bytes)) unit))
                                                    bool))))
                               (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                               nat
                               (pair address nat))
                         (pair (pair address (big_map string bytes))
                               (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                               address)
                         (pair nat
                               (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                         (pair (pair nat nat) nat)
                         (big_map (pair address bytes) nat))
                   nat))
       (pair (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                               (big_map (pair address address) unit)
                               (pair (map string bytes)
                                     (big_map
                                        string
                                        (pair (pair (lambda
                                                       (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                       (pair (pair (option address) (map string bytes)) (list operation)))
                                                    (lambda (pair bytes (map string bytes)) unit))
                                              bool))))
                         (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                         nat
                         (pair address nat))
                   (pair (pair address (big_map string bytes))
                         (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                         address)
                   (pair nat
                         (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                   (pair (pair nat nat) nat)
                   (big_map (pair address bytes) nat))
             nat)
       { UNPAIR ;
         UNPAIR 3 ;
         DIG 3 ;
         UNPAIR ;
         UNPAIR ;
         DIG 2 ;
         UNPAIR ;
         DUP 2 ;
         CDR ;
         PAIR ;
         DIG 4 ;
         SWAP ;
         EXEC ;
         DUP 3 ;
         DUP 3 ;
         CAR ;
         CDR ;
         CDR ;
         CDR ;
         CAR ;
         CDR ;
         ADD ;
         DUP 3 ;
         CAR ;
         CAR ;
         CDR ;
         CAR ;
         CAR ;
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
             IF { DUP 2 ; CAR ; CAR ; CDR ; CAR ; CAR } { PUSH nat 114 ; FAILWITH } }
           { DIG 2 ;
             PAIR ;
             DIG 5 ;
             SWAP ;
             EXEC ;
             DUP 4 ;
             PAIR ;
             DIG 5 ;
             SWAP ;
             EXEC ;
             DIG 3 ;
             DUP 2 ;
             CDR ;
             CDR ;
             ADD ;
             DUP 2 ;
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
             CAR ;
             CAR ;
             SWAP ;
             SOME ;
             DIG 4 ;
             UPDATE } ;
         DUP 3 ;
         CDR ;
         DUP 4 ;
         CAR ;
         CDR ;
         DUP 5 ;
         CAR ;
         CAR ;
         CDR ;
         CDR ;
         DUP 6 ;
         CAR ;
         CAR ;
         CDR ;
         CAR ;
         CDR ;
         DIG 4 ;
         PAIR ;
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
         DUP 2 ;
         CAR ;
         CDR ;
         CDR ;
         CDR ;
         CDR ;
         DIG 3 ;
         DIG 4 ;
         CAR ;
         CDR ;
         CDR ;
         CDR ;
         CAR ;
         CAR ;
         PAIR ;
         PAIR ;
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
         PAIR } ;
     DUP 7 ;
     DUP 7 ;
     DUP 6 ;
     PAIR 3 ;
     APPLY ;
     LAMBDA
       (pair (pair (lambda
                      (pair (pair (pair nat nat) address nat)
                            (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                                              (big_map (pair address address) unit)
                                              (pair (map string bytes)
                                                    (big_map
                                                       string
                                                       (pair (pair (lambda
                                                                      (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                                      (pair (pair (option address) (map string bytes)) (list operation)))
                                                                   (lambda (pair bytes (map string bytes)) unit))
                                                             bool))))
                                        (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                                        nat
                                        (pair address nat))
                                  (pair (pair address (big_map string bytes))
                                        (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                                        address)
                                  (pair nat
                                        (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                                  (pair (pair nat nat) nat)
                                  (big_map (pair address bytes) nat))
                            nat)
                      (pair (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                                              (big_map (pair address address) unit)
                                              (pair (map string bytes)
                                                    (big_map
                                                       string
                                                       (pair (pair (lambda
                                                                      (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                                      (pair (pair (option address) (map string bytes)) (list operation)))
                                                                   (lambda (pair bytes (map string bytes)) unit))
                                                             bool))))
                                        (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                                        nat
                                        (pair address nat))
                                  (pair (pair address (big_map string bytes))
                                        (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                                        address)
                                  (pair nat
                                        (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                                  (pair (pair nat nat) nat)
                                  (big_map (pair address bytes) nat))
                            nat))
                   (lambda (pair string (map string bytes)) nat))
             (pair (pair (pair bool (pair (pair nat bytes) address nat) (pair nat nat) nat nat) nat nat)
                   (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                                     (big_map (pair address address) unit)
                                     (pair (map string bytes)
                                           (big_map
                                              string
                                              (pair (pair (lambda
                                                             (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                             (pair (pair (option address) (map string bytes)) (list operation)))
                                                          (lambda (pair bytes (map string bytes)) unit))
                                                    bool))))
                               (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                               nat
                               (pair address nat))
                         (pair (pair address (big_map string bytes))
                               (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                               address)
                         (pair nat
                               (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                         (pair (pair nat nat) nat)
                         (big_map (pair address bytes) nat))
                   nat))
       (pair (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                               (big_map (pair address address) unit)
                               (pair (map string bytes)
                                     (big_map
                                        string
                                        (pair (pair (lambda
                                                       (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                       (pair (pair (option address) (map string bytes)) (list operation)))
                                                    (lambda (pair bytes (map string bytes)) unit))
                                              bool))))
                         (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                         nat
                         (pair address nat))
                   (pair (pair address (big_map string bytes))
                         (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                         address)
                   (pair nat
                         (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                   (pair (pair nat nat) nat)
                   (big_map (pair address bytes) nat))
             nat)
       { UNPAIR ;
         UNPAIR ;
         DIG 2 ;
         UNPAIR ;
         UNPAIR ;
         UNPAIR ;
         DIG 2 ;
         UNPAIR ;
         DIG 2 ;
         IF { DIG 5 ; DROP ; PUSH nat 0 ; DIG 2 ; DUP 4 ; CAR ; CDR ; CDR ; ADD }
            { DUP 4 ;
              CAR ;
              CAR ;
              CAR ;
              CDR ;
              CDR ;
              DUP ;
              CAR ;
              PUSH string "slash_scale_value" ;
              PAIR ;
              DUP 8 ;
              SWAP ;
              EXEC ;
              SWAP ;
              CAR ;
              PUSH string "slash_division_value" ;
              PAIR ;
              DIG 7 ;
              SWAP ;
              EXEC ;
              DUP 5 ;
              CAR ;
              CDR ;
              CDR ;
              DIG 2 ;
              MUL ;
              EDIV ;
              IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
              CAR ;
              DUP 3 ;
              DUP 5 ;
              CAR ;
              CDR ;
              CDR ;
              ADD ;
              DIG 3 ;
              DIG 2 ;
              ADD ;
              DUP ;
              DIG 2 ;
              SUB ;
              ISNAT ;
              IF_NONE { PUSH nat 0 } {} } ;
         DIG 4 ;
         DIG 3 ;
         DIG 4 ;
         CAR ;
         CDR ;
         CAR ;
         PAIR ;
         DIG 3 ;
         DIG 3 ;
         PAIR ;
         PAIR ;
         PAIR ;
         EXEC } ;
     DUP 18 ;
     DUP 4 ;
     PAIR ;
     APPLY ;
     DIG 18 ;
     UNPAIR ;
     IF_LEFT
       { DIG 2 ;
         DIG 4 ;
         DIG 7 ;
         DIG 8 ;
         DIG 9 ;
         DIG 10 ;
         DROP 6 ;
         IF_LEFT
           { IF_LEFT
               { IF_LEFT
                   { DIG 2 ;
                     DIG 3 ;
                     DIG 4 ;
                     DIG 5 ;
                     DIG 6 ;
                     DIG 7 ;
                     DIG 8 ;
                     DIG 9 ;
                     DIG 11 ;
                     DIG 12 ;
                     DIG 13 ;
                     DROP 11 ;
                     IF_LEFT
                       { DROP ;
                         SENDER ;
                         DUP 2 ;
                         CAR ;
                         CDR ;
                         CAR ;
                         CDR ;
                         CDR ;
                         COMPARE ;
                         EQ ;
                         IF { DUP ;
                              CDR ;
                              DUP 2 ;
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
                              DIG 4 ;
                              CAR ;
                              CAR ;
                              CAR ;
                              CAR ;
                              CDR ;
                              SENDER ;
                              PAIR ;
                              PAIR ;
                              PAIR ;
                              PAIR ;
                              PAIR ;
                              SWAP ;
                              PAIR }
                            { DROP 2 ; PUSH nat 101 ; FAILWITH } }
                       { DIG 2 ; DROP 2 ; NIL operation ; PAIR } }
                   { IF_LEFT
                       { DUP 2 ;
                         CAR ;
                         CAR ;
                         CAR ;
                         CAR ;
                         CDR ;
                         DUP 3 ;
                         SENDER ;
                         DUP 4 ;
                         CAR ;
                         DIG 2 ;
                         CAR ;
                         CAR ;
                         CAR ;
                         CDR ;
                         CAR ;
                         DUP 3 ;
                         DUP 3 ;
                         PAIR ;
                         MEM ;
                         NOT ;
                         DUP 2 ;
                         DIG 3 ;
                         COMPARE ;
                         NEQ ;
                         AND ;
                         IF { DROP ; PUSH nat 120 ; FAILWITH } {} ;
                         DUP 4 ;
                         CAR ;
                         CAR ;
                         CAR ;
                         CDR ;
                         CDR ;
                         DUP 4 ;
                         GET 4 ;
                         SIZE ;
                         DUP 2 ;
                         CAR ;
                         PUSH string "frozen_scale_value" ;
                         PAIR ;
                         DUP 19 ;
                         SWAP ;
                         EXEC ;
                         DUP 3 ;
                         CAR ;
                         PUSH string "frozen_extra_value" ;
                         PAIR ;
                         DUP 20 ;
                         SWAP ;
                         EXEC ;
                         DUP 4 ;
                         CAR ;
                         PUSH string "max_proposal_size" ;
                         PAIR ;
                         DIG 20 ;
                         SWAP ;
                         EXEC ;
                         SWAP ;
                         DUP 4 ;
                         DIG 3 ;
                         MUL ;
                         ADD ;
                         DUP 7 ;
                         GET 3 ;
                         COMPARE ;
                         NEQ ;
                         IF { DROP 2 ; PUSH string "WRONG_TOKEN_AMOUNT" ; SOME }
                            { SWAP ;
                              COMPARE ;
                              GE ;
                              IF { PUSH string "LARGE_PROPOSAL" ; SOME } { NONE string } } ;
                         IF_NONE {} { PUSH nat 102 ; PAIR ; FAILWITH } ;
                         DUP 4 ;
                         GET 4 ;
                         DIG 13 ;
                         SWAP ;
                         EXEC ;
                         IF_LEFT
                           { IF_LEFT
                               { DIG 12 ;
                                 DROP ;
                                 CDR ;
                                 PAIR ;
                                 DIG 8 ;
                                 SWAP ;
                                 EXEC ;
                                 IF { DIG 8 ; DIG 8 ; SWAP ; EXEC ; DROP } { DIG 7 ; DIG 8 ; DROP 2 } }
                               { DIG 9 ;
                                 DIG 11 ;
                                 DROP 2 ;
                                 DUP 2 ;
                                 CDR ;
                                 DUP 2 ;
                                 CAR ;
                                 GET ;
                                 IF_NONE
                                   { DROP 2 ; DIG 8 ; DIG 8 ; SWAP ; EXEC ; DROP }
                                   { DUP ;
                                     CDR ;
                                     IF { DIG 10 ;
                                          DIG 11 ;
                                          DROP 2 ;
                                          DIG 2 ;
                                          CAR ;
                                          DIG 2 ;
                                          CDR ;
                                          PAIR ;
                                          SWAP ;
                                          CAR ;
                                          CDR ;
                                          SWAP ;
                                          EXEC ;
                                          DROP }
                                        { DROP 3 ; DIG 8 ; DIG 8 ; SWAP ; EXEC ; DROP } } } }
                           { DIG 9 ;
                             DIG 11 ;
                             DROP 2 ;
                             SWAP ;
                             CDR ;
                             SWAP ;
                             GET ;
                             IF_NONE { PUSH bool False } { CDR } ;
                             IF { DIG 7 ; DIG 8 ; DROP 2 } { DIG 8 ; DIG 8 ; SWAP ; EXEC ; DROP } } ;
                         DUP 2 ;
                         CAR ;
                         CAR ;
                         CAR ;
                         CAR ;
                         DUP 4 ;
                         GET 3 ;
                         ADD ;
                         DUP 3 ;
                         CAR ;
                         CDR ;
                         CAR ;
                         CDR ;
                         DUP 6 ;
                         CDR ;
                         PAIR ;
                         DUP 9 ;
                         SWAP ;
                         EXEC ;
                         PUSH nat 2 ;
                         PUSH nat 1 ;
                         DIG 2 ;
                         ADD ;
                         EDIV ;
                         IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                         CAR ;
                         DUP ;
                         DUP 7 ;
                         CAR ;
                         CDR ;
                         CDR ;
                         CDR ;
                         CAR ;
                         CAR ;
                         CAR ;
                         COMPARE ;
                         EQ ;
                         IF { DIG 7 ; DIG 11 ; DROP 3 ; DIG 4 }
                            { DUP 6 ;
                              CAR ;
                              CDR ;
                              CDR ;
                              CDR ;
                              CAR ;
                              CAR ;
                              CAR ;
                              DUP 2 ;
                              COMPARE ;
                              GT ;
                              IF { DUP 4 ;
                                   CAR ;
                                   CAR ;
                                   CAR ;
                                   CDR ;
                                   DUP 13 ;
                                   DUP 8 ;
                                   CAR ;
                                   CDR ;
                                   CDR ;
                                   CDR ;
                                   CAR ;
                                   CDR ;
                                   MUL ;
                                   EDIV ;
                                   IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                                   CAR ;
                                   INT ;
                                   DUP 7 ;
                                   CAR ;
                                   CDR ;
                                   CDR ;
                                   CDR ;
                                   CAR ;
                                   CAR ;
                                   CDR ;
                                   INT ;
                                   DUP ;
                                   DIG 2 ;
                                   SUB ;
                                   DUP 6 ;
                                   CDR ;
                                   DUP 11 ;
                                   DUG 2 ;
                                   MUL ;
                                   EDIV ;
                                   IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                                   CAR ;
                                   DUP 2 ;
                                   ADD ;
                                   DIG 13 ;
                                   DUP 7 ;
                                   CAR ;
                                   CAR ;
                                   CDR ;
                                   CAR ;
                                   ADD ;
                                   DUP ;
                                   DUP 12 ;
                                   DUP 5 ;
                                   MUL ;
                                   EDIV ;
                                   IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                                   CAR ;
                                   DIG 11 ;
                                   DIG 2 ;
                                   DIG 4 ;
                                   MUL ;
                                   EDIV ;
                                   IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                                   CAR ;
                                   DUP 9 ;
                                   CDR ;
                                   DUP 10 ;
                                   CAR ;
                                   CDR ;
                                   CDR ;
                                   CDR ;
                                   CDR ;
                                   PUSH nat 0 ;
                                   DUP 10 ;
                                   CAR ;
                                   CAR ;
                                   CDR ;
                                   CDR ;
                                   DUP 11 ;
                                   CAR ;
                                   CDR ;
                                   CAR ;
                                   CAR ;
                                   DUP 6 ;
                                   DUP 9 ;
                                   COMPARE ;
                                   GT ;
                                   IF { DIG 6 ; DIG 7 ; DROP 2 }
                                      { DIG 5 ;
                                        DROP ;
                                        DUP 6 ;
                                        DUP 8 ;
                                        COMPARE ;
                                        LT ;
                                        IF { DIG 6 ; DROP } { DIG 5 ; DROP } } ;
                                   DIG 5 ;
                                   DUP 3 ;
                                   DUP 2 ;
                                   COMPARE ;
                                   GT ;
                                   IF { DROP 2 }
                                      { DIG 2 ;
                                        DROP ;
                                        DUP 2 ;
                                        DUP 2 ;
                                        COMPARE ;
                                        LT ;
                                        IF { DROP } { SWAP ; DROP } } ;
                                   ISNAT ;
                                   IF_NONE { PUSH nat 300 ; FAILWITH } {} ;
                                   DIG 4 ;
                                   PAIR ;
                                   PAIR ;
                                   PAIR ;
                                   DUP 7 ;
                                   CAR ;
                                   CDR ;
                                   CDR ;
                                   CAR ;
                                   PAIR ;
                                   DUP 7 ;
                                   CAR ;
                                   CDR ;
                                   CAR ;
                                   PAIR ;
                                   DIG 6 ;
                                   CAR ;
                                   CAR ;
                                   PAIR ;
                                   PAIR }
                                 { DIG 7 ; DIG 11 ; DROP 3 ; DIG 4 } } ;
                         DUP 4 ;
                         CAR ;
                         CDR ;
                         CAR ;
                         CDR ;
                         PAIR ;
                         DUG 2 ;
                         PAIR ;
                         PAIR ;
                         DIG 3 ;
                         SWAP ;
                         EXEC ;
                         DUP 3 ;
                         PACK ;
                         BLAKE2B ;
                         DUP 2 ;
                         CAR ;
                         CDR ;
                         CDR ;
                         CAR ;
                         CDR ;
                         DUP 2 ;
                         MEM ;
                         IF { DROP ; PUSH nat 108 ; FAILWITH } {} ;
                         DIG 2 ;
                         CAR ;
                         CDR ;
                         CAR ;
                         CDR ;
                         DUP 3 ;
                         CDR ;
                         PAIR ;
                         DIG 4 ;
                         SWAP ;
                         EXEC ;
                         PUSH nat 1 ;
                         PUSH nat 2 ;
                         DUP 3 ;
                         EDIV ;
                         IF_NONE { PUSH string "MOD by 0" ; FAILWITH } {} ;
                         CDR ;
                         COMPARE ;
                         EQ ;
                         IF { DIG 2 } { DIG 2 ; DROP ; PUSH nat 113 ; FAILWITH } ;
                         PUSH nat 1 ;
                         DIG 2 ;
                         ADD ;
                         PUSH nat 0 ;
                         PAIR ;
                         LEVEL ;
                         DUP 3 ;
                         CAR ;
                         CDR ;
                         CDR ;
                         CDR ;
                         CAR ;
                         CAR ;
                         CDR ;
                         PAIR ;
                         PAIR ;
                         DUP 4 ;
                         GET 3 ;
                         DUP 5 ;
                         CAR ;
                         PAIR ;
                         DIG 4 ;
                         GET 4 ;
                         PUSH nat 0 ;
                         PAIR ;
                         PAIR ;
                         PAIR ;
                         DUP 2 ;
                         CDR ;
                         DUP 3 ;
                         CAR ;
                         CDR ;
                         CDR ;
                         CDR ;
                         DUP 4 ;
                         CAR ;
                         CDR ;
                         CDR ;
                         CAR ;
                         CDR ;
                         DIG 3 ;
                         DUP 6 ;
                         SWAP ;
                         SOME ;
                         SWAP ;
                         UPDATE ;
                         DUP 4 ;
                         CAR ;
                         CDR ;
                         CDR ;
                         CAR ;
                         CAR ;
                         PAIR ;
                         PAIR ;
                         DUP 3 ;
                         CAR ;
                         CDR ;
                         CAR ;
                         PAIR ;
                         DUP 3 ;
                         CAR ;
                         CAR ;
                         PAIR ;
                         PAIR ;
                         DUP ;
                         CDR ;
                         DUP 2 ;
                         CAR ;
                         CDR ;
                         CDR ;
                         DUP 3 ;
                         CAR ;
                         CDR ;
                         CAR ;
                         CDR ;
                         CDR ;
                         DIG 4 ;
                         CAR ;
                         CDR ;
                         CAR ;
                         CDR ;
                         CAR ;
                         IF_NONE
                           { DIG 6 ;
                             DROP ;
                             EMPTY_BIG_MAP (pair bytes bool) bytes ;
                             DUP 6 ;
                             DIG 6 ;
                             PAIR 3 }
                           { DUP ;
                             DUP 7 ;
                             UPDATE 3 ;
                             DUP 2 ;
                             GET 4 ;
                             DUP 3 ;
                             GET 3 ;
                             DIG 10 ;
                             DUP 10 ;
                             PAIR ;
                             SWAP ;
                             SOME ;
                             SWAP ;
                             UPDATE ;
                             DIG 7 ;
                             PUSH bool True ;
                             DIG 4 ;
                             GET 3 ;
                             PAIR ;
                             SWAP ;
                             SOME ;
                             SWAP ;
                             UPDATE ;
                             UPDATE 4 } ;
                         SOME ;
                         PAIR ;
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
                         SWAP }
                       { DIG 2 ;
                         DIG 3 ;
                         DIG 4 ;
                         DIG 5 ;
                         DIG 6 ;
                         DIG 7 ;
                         DIG 8 ;
                         DIG 9 ;
                         DIG 10 ;
                         DIG 11 ;
                         DIG 12 ;
                         DIG 13 ;
                         DROP 12 ;
                         DUP 2 ;
                         CAR ;
                         CAR ;
                         CAR ;
                         CAR ;
                         CAR ;
                         SENDER ;
                         COMPARE ;
                         EQ ;
                         IF { SWAP } { SWAP ; DROP ; PUSH nat 100 ; FAILWITH } ;
                         DUP 2 ;
                         CAR ;
                         CONTRACT %transfer
                           (list (pair (address %from_) (list %txs (pair (address %to_) (nat %token_id) (nat %amount))))) ;
                         IF_NONE { PUSH nat 115 ; FAILWITH } {} ;
                         PUSH mutez 0 ;
                         DIG 3 ;
                         CDR ;
                         TRANSFER_TOKENS ;
                         SWAP ;
                         NIL operation ;
                         DIG 2 ;
                         CONS } ;
                     PAIR } }
               { DIG 2 ;
                 DIG 3 ;
                 DIG 4 ;
                 DIG 5 ;
                 DIG 6 ;
                 DIG 7 ;
                 DIG 8 ;
                 DIG 9 ;
                 DIG 11 ;
                 DIG 12 ;
                 DIG 13 ;
                 DROP 11 ;
                 DUP 2 ;
                 CAR ;
                 CAR ;
                 CAR ;
                 CAR ;
                 CAR ;
                 SENDER ;
                 COMPARE ;
                 EQ ;
                 IF { SWAP } { SWAP ; DROP ; PUSH nat 100 ; FAILWITH } ;
                 DUP 2 ;
                 SELF_ADDRESS ;
                 COMPARE ;
                 EQ ;
                 IF { DUP ;
                      CDR ;
                      DUP 2 ;
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
                      DIG 4 ;
                      CAR ;
                      CAR ;
                      CAR ;
                      CAR ;
                      CDR ;
                      DIG 5 ;
                      PAIR ;
                      PAIR ;
                      PAIR }
                    { DUP ;
                      CDR ;
                      DUP 2 ;
                      CAR ;
                      CDR ;
                      CDR ;
                      DIG 3 ;
                      DUP 4 ;
                      CAR ;
                      CDR ;
                      CAR ;
                      CDR ;
                      CAR ;
                      PAIR ;
                      DUP 4 ;
                      CAR ;
                      CDR ;
                      CAR ;
                      CAR ;
                      PAIR ;
                      PAIR ;
                      DIG 2 ;
                      CAR ;
                      CAR } ;
                 PAIR ;
                 PAIR ;
                 SWAP ;
                 PAIR } }
           { DIG 2 ;
             DIG 3 ;
             DIG 4 ;
             DIG 5 ;
             DIG 6 ;
             DIG 7 ;
             DIG 8 ;
             DIG 9 ;
             DIG 11 ;
             DIG 12 ;
             DIG 13 ;
             DROP 11 ;
             IF_LEFT
               { DUP ;
                 CDR ;
                 CONTRACT (pair string (option string)) ;
                 IF_NONE { PUSH nat 116 ; FAILWITH } {} ;
                 DUP 3 ;
                 CAR ;
                 CAR ;
                 CAR ;
                 CDR ;
                 CDR ;
                 CAR ;
                 PUSH string "registry" ;
                 GET ;
                 IF_NONE
                   { PUSH string "registry not found" ; FAILWITH }
                   { UNPACK (map string string) ;
                     IF_NONE { PUSH string "registry decoding failed" ; FAILWITH } {} } ;
                 SWAP ;
                 PUSH mutez 0 ;
                 DIG 2 ;
                 DUP 4 ;
                 CAR ;
                 GET ;
                 DIG 3 ;
                 CAR ;
                 PAIR ;
                 TRANSFER_TOKENS ;
                 SWAP ;
                 DUG 2 ;
                 CONS }
               { DIG 2 ; DROP 2 ; NIL operation } ;
             PAIR } }
       { DIG 5 ;
         DIG 12 ;
         DIG 14 ;
         DIG 19 ;
         DROP 4 ;
         PUSH mutez 0 ;
         AMOUNT ;
         COMPARE ;
         GT ;
         IF { DROP 16 ; PUSH nat 107 ; FAILWITH }
            { IF_LEFT
                { DIG 3 ;
                  DIG 4 ;
                  DROP 2 ;
                  IF_LEFT
                    { DIG 3 ;
                      DIG 5 ;
                      DIG 6 ;
                      DIG 7 ;
                      DROP 4 ;
                      IF_LEFT
                        { DIG 4 ;
                          DIG 5 ;
                          DIG 6 ;
                          DIG 9 ;
                          DROP 4 ;
                          DUP 2 ;
                          DUP 2 ;
                          PAIR ;
                          DIG 4 ;
                          SWAP ;
                          EXEC ;
                          DUP 3 ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          IF_NONE
                            { PUSH bool False }
                            { DUP ;
                              CAR ;
                              DUP 4 ;
                              COMPARE ;
                              EQ ;
                              IF { DROP ; PUSH bool True } { GET 4 ; DUP 7 ; DUP 4 ; PAIR ; MEM } } ;
                          IF {} { DROP ; PUSH nat 103 ; FAILWITH } ;
                          DUP 3 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          CAR ;
                          DUP 2 ;
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
                          DUP 5 ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CAR ;
                          CAR ;
                          SENDER ;
                          COMPARE ;
                          EQ ;
                          AND ;
                          DUP 3 ;
                          CAR ;
                          CDR ;
                          CAR ;
                          SENDER ;
                          COMPARE ;
                          EQ ;
                          OR ;
                          OR ;
                          IF { DUP 3 ;
                               DUP 4 ;
                               CAR ;
                               CAR ;
                               CAR ;
                               CAR ;
                               CDR ;
                               CAR ;
                               CAR ;
                               CAR ;
                               CAR ;
                               DIG 4 ;
                               CAR ;
                               CAR ;
                               CAR ;
                               CAR ;
                               CDR ;
                               CAR ;
                               CDR ;
                               CAR ;
                               CDR ;
                               PAIR ;
                               DIG 2 ;
                               PUSH bool False ;
                               PAIR ;
                               PAIR ;
                               PAIR ;
                               DIG 2 ;
                               SWAP ;
                               EXEC ;
                               DUP ;
                               CDR ;
                               DUP 2 ;
                               CAR ;
                               CDR ;
                               CDR ;
                               DUP 3 ;
                               CAR ;
                               CDR ;
                               CAR ;
                               CDR ;
                               CDR ;
                               DUP 4 ;
                               CAR ;
                               CDR ;
                               CAR ;
                               CDR ;
                               CAR ;
                               DUP ;
                               IF_NONE
                                 { DIG 5 ; DIG 7 ; DROP 2 }
                                 { SWAP ;
                                   DROP ;
                                   DUP ;
                                   GET 3 ;
                                   DUP 2 ;
                                   CAR ;
                                   COMPARE ;
                                   EQ ;
                                   IF { DIG 7 ;
                                        DROP ;
                                        DUP ;
                                        CAR ;
                                        DIG 6 ;
                                        COMPARE ;
                                        EQ ;
                                        IF { DROP ; NONE (pair bytes bytes (big_map (pair bytes bool) bytes)) }
                                           { SOME } }
                                      { DUP ;
                                        GET 4 ;
                                        DUP 9 ;
                                        DUP 8 ;
                                        PAIR ;
                                        GET ;
                                        DUP 2 ;
                                        GET 4 ;
                                        PUSH bool True ;
                                        DUP 9 ;
                                        PAIR ;
                                        GET ;
                                        DUP 3 ;
                                        GET 4 ;
                                        PUSH bool True ;
                                        DUP 10 ;
                                        PAIR ;
                                        NONE bytes ;
                                        SWAP ;
                                        UPDATE ;
                                        DUP 11 ;
                                        DUP 10 ;
                                        PAIR ;
                                        NONE bytes ;
                                        SWAP ;
                                        UPDATE ;
                                        DUP 3 ;
                                        IF_NONE
                                          { DUP 4 ; GET 3 }
                                          { SWAP ;
                                            DUP 3 ;
                                            PUSH bool True ;
                                            DUP 4 ;
                                            PAIR ;
                                            UPDATE ;
                                            DUP 10 ;
                                            DUP 6 ;
                                            GET 3 ;
                                            COMPARE ;
                                            EQ ;
                                            IF { SWAP } { SWAP ; DROP ; DUP 4 ; GET 3 } } ;
                                        DIG 2 ;
                                        IF_NONE
                                          { DIG 2 ; DIG 8 ; DIG 10 ; DROP 3 ; SWAP ; DIG 2 ; CAR }
                                          { DIG 2 ;
                                            DIG 3 ;
                                            DIG 11 ;
                                            DUP 4 ;
                                            PAIR ;
                                            UPDATE ;
                                            DIG 8 ;
                                            DUP 5 ;
                                            CAR ;
                                            COMPARE ;
                                            EQ ;
                                            IF { DIG 3 ; DROP ; SWAP } { SWAP ; DROP ; DIG 2 ; CAR } } ;
                                        SWAP ;
                                        DUG 2 ;
                                        PAIR 3 ;
                                        SOME } } ;
                               PAIR ;
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
                               PAIR }
                             { DROP 6 ; PUSH nat 117 ; FAILWITH } }
                        { DUP 8 ;
                          DIG 2 ;
                          DUP 3 ;
                          INT ;
                          PAIR ;
                          PAIR ;
                          LEFT (pair (pair (list operation)
                                           (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                                                             (big_map (pair address address) unit)
                                                             (pair (map string bytes)
                                                                   (big_map
                                                                      string
                                                                      (pair (pair (lambda
                                                                                     (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                                                     (pair (pair (option address) (map string bytes)) (list operation)))
                                                                                  (lambda (pair bytes (map string bytes)) unit))
                                                                            bool))))
                                                       (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                                                       nat
                                                       (pair address nat))
                                                 (pair (pair address (big_map string bytes))
                                                       (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                                                       address)
                                                 (pair nat
                                                       (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                                                 (pair (pair nat nat) nat)
                                                 (big_map (pair address bytes) nat))
                                           nat)
                                     int) ;
                          LOOP_LEFT
                            { UNPAIR ;
                              UNPAIR ;
                              DUP 2 ;
                              CAR ;
                              CDR ;
                              CAR ;
                              CDR ;
                              CAR ;
                              IF_NONE
                                { NONE (pair bytes bytes (big_map (pair bytes bool) bytes)) ; NONE bytes }
                                { DUP ;
                                  GET 4 ;
                                  PUSH bool True ;
                                  DUP 3 ;
                                  CAR ;
                                  PAIR ;
                                  GET ;
                                  IF_NONE
                                    { NONE (pair bytes bytes (big_map (pair bytes bool) bytes)) }
                                    { DUP 2 ;
                                      DUP 2 ;
                                      UPDATE 1 ;
                                      DUP 3 ;
                                      GET 4 ;
                                      PUSH bool True ;
                                      DUP 5 ;
                                      CAR ;
                                      PAIR ;
                                      NONE bytes ;
                                      SWAP ;
                                      UPDATE ;
                                      DUP 15 ;
                                      DIG 3 ;
                                      PAIR ;
                                      NONE bytes ;
                                      SWAP ;
                                      UPDATE ;
                                      UPDATE 4 ;
                                      SOME } ;
                                  SWAP ;
                                  CAR ;
                                  SOME } ;
                              IF_NONE
                                { DROP ;
                                  SWAP ;
                                  DIG 2 ;
                                  PAIR ;
                                  PAIR ;
                                  RIGHT
                                    (pair (pair int
                                                (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                                                                  (big_map (pair address address) unit)
                                                                  (pair (map string bytes)
                                                                        (big_map
                                                                           string
                                                                           (pair (pair (lambda
                                                                                          (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                                                          (pair (pair (option address) (map string bytes)) (list operation)))
                                                                                       (lambda (pair bytes (map string bytes)) unit))
                                                                                 bool))))
                                                            (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                                                            nat
                                                            (pair address nat))
                                                      (pair (pair address (big_map string bytes))
                                                            (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                                                            address)
                                                      (pair nat
                                                            (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                                                      (pair (pair nat nat) nat)
                                                      (big_map (pair address bytes) nat))
                                                nat)
                                          (list operation)) }
                                { DUP 4 ;
                                  DUP 2 ;
                                  PAIR ;
                                  DUP 9 ;
                                  SWAP ;
                                  EXEC ;
                                  DUP 5 ;
                                  CAR ;
                                  CDR ;
                                  CAR ;
                                  CDR ;
                                  CAR ;
                                  IF_NONE
                                    { SWAP ; DROP ; PUSH bool False }
                                    { DUP ;
                                      CAR ;
                                      DUP 4 ;
                                      COMPARE ;
                                      EQ ;
                                      IF { DIG 2 ; DROP 2 ; PUSH bool True }
                                         { GET 4 ; DUP 15 ; DIG 3 ; PAIR ; MEM } } ;
                                  IF {} { DROP ; PUSH nat 103 ; FAILWITH } ;
                                  DUP 4 ;
                                  CAR ;
                                  CAR ;
                                  CAR ;
                                  CAR ;
                                  CDR ;
                                  CAR ;
                                  CDR ;
                                  CDR ;
                                  CAR ;
                                  DUP 2 ;
                                  CDR ;
                                  CAR ;
                                  CDR ;
                                  ADD ;
                                  LEVEL ;
                                  COMPARE ;
                                  GE ;
                                  IF { PUSH nat 118 ; FAILWITH } {} ;
                                  DUP 4 ;
                                  CAR ;
                                  CAR ;
                                  CAR ;
                                  CAR ;
                                  CDR ;
                                  CAR ;
                                  CDR ;
                                  CDR ;
                                  CDR ;
                                  DUP 2 ;
                                  CDR ;
                                  CAR ;
                                  CDR ;
                                  ADD ;
                                  LEVEL ;
                                  COMPARE ;
                                  GE ;
                                  PUSH int 0 ;
                                  DUP 5 ;
                                  COMPARE ;
                                  GT ;
                                  AND ;
                                  IF { DUP 4 ;
                                       CAR ;
                                       CAR ;
                                       CAR ;
                                       CAR ;
                                       CDR ;
                                       DUP 2 ;
                                       CAR ;
                                       CAR ;
                                       CAR ;
                                       DUP 3 ;
                                       CDR ;
                                       CDR ;
                                       CAR ;
                                       COMPARE ;
                                       GT ;
                                       DUP 3 ;
                                       CAR ;
                                       CAR ;
                                       CAR ;
                                       DUP 4 ;
                                       CDR ;
                                       CDR ;
                                       CAR ;
                                       ADD ;
                                       DUP 7 ;
                                       CAR ;
                                       CAR ;
                                       CDR ;
                                       CDR ;
                                       CAR ;
                                       DUP 18 ;
                                       DIG 2 ;
                                       MUL ;
                                       EDIV ;
                                       IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                                       CAR ;
                                       DUP 4 ;
                                       CDR ;
                                       CAR ;
                                       CAR ;
                                       SWAP ;
                                       COMPARE ;
                                       GE ;
                                       AND ;
                                       DIG 5 ;
                                       DUP 3 ;
                                       CAR ;
                                       CAR ;
                                       CAR ;
                                       CAR ;
                                       DIG 3 ;
                                       CAR ;
                                       CDR ;
                                       CAR ;
                                       CDR ;
                                       PAIR ;
                                       DUP 4 ;
                                       DUP 4 ;
                                       PAIR ;
                                       PAIR ;
                                       PAIR ;
                                       DUP 8 ;
                                       SWAP ;
                                       EXEC ;
                                       SWAP ;
                                       IF { SWAP ;
                                            DUP 2 ;
                                            CAR ;
                                            CAR ;
                                            CAR ;
                                            CDR ;
                                            CDR ;
                                            PAIR ;
                                            DUP ;
                                            CDR ;
                                            CAR ;
                                            CAR ;
                                            CDR ;
                                            DUP 12 ;
                                            SWAP ;
                                            EXEC ;
                                            IF_LEFT
                                              { IF_LEFT
                                                  { NONE address ;
                                                    DIG 2 ;
                                                    CAR ;
                                                    DUP ;
                                                    DUP 4 ;
                                                    CDR ;
                                                    PAIR ;
                                                    DUP 12 ;
                                                    SWAP ;
                                                    EXEC ;
                                                    IF { DIG 2 ; DROP 2 ; DUP 10 ; FAILWITH }
                                                       { DUP ;
                                                         CDR ;
                                                         PUSH bool True ;
                                                         DUP 5 ;
                                                         CAR ;
                                                         CDR ;
                                                         DUP 6 ;
                                                         CAR ;
                                                         CAR ;
                                                         PAIR ;
                                                         PAIR ;
                                                         DIG 4 ;
                                                         CDR ;
                                                         SWAP ;
                                                         SOME ;
                                                         SWAP ;
                                                         UPDATE ;
                                                         SWAP ;
                                                         CAR ;
                                                         PAIR } ;
                                                    NIL operation ;
                                                    PAIR ;
                                                    PAIR }
                                                  { DUP 2 ;
                                                    CAR ;
                                                    DUP ;
                                                    CDR ;
                                                    DUP 3 ;
                                                    CAR ;
                                                    GET ;
                                                    IF_NONE
                                                      { DROP 3 ; PUSH nat 300 ; FAILWITH }
                                                      { DUP 4 ;
                                                        CDR ;
                                                        CAR ;
                                                        CAR ;
                                                        CDR ;
                                                        DUP 5 ;
                                                        CDR ;
                                                        CAR ;
                                                        CDR ;
                                                        CDR ;
                                                        DIG 5 ;
                                                        CDR ;
                                                        CAR ;
                                                        CDR ;
                                                        CAR ;
                                                        PAIR 3 ;
                                                        DIG 3 ;
                                                        CDR ;
                                                        DUP 4 ;
                                                        CAR ;
                                                        PAIR ;
                                                        PAIR ;
                                                        SWAP ;
                                                        CAR ;
                                                        CAR ;
                                                        SWAP ;
                                                        EXEC ;
                                                        DUP ;
                                                        CAR ;
                                                        CAR ;
                                                        DIG 2 ;
                                                        CDR ;
                                                        DUP 3 ;
                                                        CAR ;
                                                        CDR ;
                                                        PAIR ;
                                                        DIG 2 ;
                                                        CDR ;
                                                        PAIR ;
                                                        PAIR } } }
                                              { NONE address ;
                                                DIG 2 ;
                                                CAR ;
                                                DUP ;
                                                CDR ;
                                                DUP 4 ;
                                                GET ;
                                                IF_NONE
                                                  { DIG 2 ; DROP }
                                                  { DUP 2 ;
                                                    CDR ;
                                                    PUSH bool False ;
                                                    DIG 2 ;
                                                    CAR ;
                                                    PAIR ;
                                                    SOME ;
                                                    DIG 4 ;
                                                    UPDATE ;
                                                    SWAP ;
                                                    CAR ;
                                                    PAIR } ;
                                                NIL operation ;
                                                PAIR ;
                                                PAIR } ;
                                            UNPAIR ;
                                            UNPAIR ;
                                            DUG 2 ;
                                            PAIR ;
                                            PAIR ;
                                            DUP 2 ;
                                            CDR ;
                                            DUP 3 ;
                                            CAR ;
                                            CDR ;
                                            DUP 4 ;
                                            CAR ;
                                            CAR ;
                                            CDR ;
                                            DUP 4 ;
                                            CAR ;
                                            CAR ;
                                            DUP 6 ;
                                            CAR ;
                                            CAR ;
                                            CAR ;
                                            CDR ;
                                            CAR ;
                                            PAIR ;
                                            DUP 6 ;
                                            CAR ;
                                            CAR ;
                                            CAR ;
                                            CAR ;
                                            PAIR ;
                                            PAIR ;
                                            PAIR ;
                                            PAIR ;
                                            DUP ;
                                            CDR ;
                                            DUP 2 ;
                                            CAR ;
                                            CDR ;
                                            CDR ;
                                            DUP 3 ;
                                            CAR ;
                                            CDR ;
                                            CAR ;
                                            CDR ;
                                            DUP 4 ;
                                            CAR ;
                                            CDR ;
                                            CAR ;
                                            CAR ;
                                            CDR ;
                                            DUP 6 ;
                                            CAR ;
                                            CDR ;
                                            IF_NONE { DIG 6 ; CAR ; CDR ; CAR ; CAR ; CAR } { DIG 7 ; DROP } ;
                                            PAIR ;
                                            PAIR ;
                                            PAIR ;
                                            DIG 2 ;
                                            CAR ;
                                            CAR ;
                                            PAIR ;
                                            PAIR ;
                                            SWAP ;
                                            CDR }
                                          { SWAP ; DROP ; DUP 11 } ;
                                       DIG 4 ;
                                       ITER { CONS } ;
                                       DUP 2 ;
                                       CDR ;
                                       DUP 3 ;
                                       CAR ;
                                       CDR ;
                                       CDR ;
                                       DUP 4 ;
                                       CAR ;
                                       CDR ;
                                       CAR ;
                                       CDR ;
                                       CDR ;
                                       DIG 5 ;
                                       PAIR ;
                                       DUP 5 ;
                                       CAR ;
                                       CDR ;
                                       CAR ;
                                       CAR ;
                                       PAIR ;
                                       PAIR ;
                                       DIG 3 ;
                                       CAR ;
                                       CAR ;
                                       PAIR ;
                                       PAIR ;
                                       PUSH int 1 ;
                                       DIG 3 ;
                                       SUB ;
                                       PAIR ;
                                       PAIR ;
                                       LEFT (pair (pair (list operation)
                                                        (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                                                                          (big_map (pair address address) unit)
                                                                          (pair (map string bytes)
                                                                                (big_map
                                                                                   string
                                                                                   (pair (pair (lambda
                                                                                                  (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                                                                  (pair (pair (option address) (map string bytes)) (list operation)))
                                                                                               (lambda (pair bytes (map string bytes)) unit))
                                                                                         bool))))
                                                                    (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                                                                    nat
                                                                    (pair address nat))
                                                              (pair (pair address (big_map string bytes))
                                                                    (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                                                                    address)
                                                              (pair nat
                                                                    (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                                                              (pair (pair nat nat) nat)
                                                              (big_map (pair address bytes) nat))
                                                        nat)
                                                  int) }
                                     { DROP 2 ;
                                       SWAP ;
                                       DIG 2 ;
                                       PAIR ;
                                       PAIR ;
                                       RIGHT
                                         (pair (pair int
                                                     (pair (pair (pair (pair address (pair (pair (pair (pair nat nat) int int) (pair int nat) nat nat) int))
                                                                       (big_map (pair address address) unit)
                                                                       (pair (map string bytes)
                                                                             (big_map
                                                                                string
                                                                                (pair (pair (lambda
                                                                                               (pair (pair (map string bytes) bytes) (pair address nat bytes))
                                                                                               (pair (pair (option address) (map string bytes)) (list operation)))
                                                                                            (lambda (pair bytes (map string bytes)) unit))
                                                                                      bool))))
                                                                 (pair (big_map address (pair (pair nat nat) nat nat)) nat)
                                                                 nat
                                                                 (pair address nat))
                                                           (pair (pair address (big_map string bytes))
                                                                 (option (pair bytes bytes (big_map (pair bytes bool) bytes)))
                                                                 address)
                                                           (pair nat
                                                                 (big_map bytes (pair (pair (pair nat bytes) address nat) (pair nat nat) nat nat)))
                                                           (pair (pair nat nat) nat)
                                                           (big_map (pair address bytes) nat))
                                                     nat)
                                               (list operation)) } } } ;
                          DIG 2 ;
                          DIG 3 ;
                          DIG 4 ;
                          DIG 5 ;
                          DIG 6 ;
                          DIG 7 ;
                          DIG 8 ;
                          DIG 9 ;
                          DROP 8 ;
                          UNPAIR ;
                          UNPAIR ;
                          DIG 3 ;
                          INT ;
                          DIG 3 ;
                          COMPARE ;
                          EQ ;
                          IF { DROP 2 ; PUSH nat 119 ; FAILWITH } { PAIR } } }
                    { DIG 2 ;
                      DIG 4 ;
                      DIG 8 ;
                      DIG 9 ;
                      DIG 10 ;
                      DIG 11 ;
                      DIG 12 ;
                      DIG 13 ;
                      DROP 8 ;
                      IF_LEFT
                        { DIG 4 ;
                          DROP ;
                          SENDER ;
                          DUP 3 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          CDR ;
                          NIL (pair address nat nat) ;
                          DUP 4 ;
                          DUP 3 ;
                          CDR ;
                          SELF_ADDRESS ;
                          PAIR 3 ;
                          CONS ;
                          DUP 3 ;
                          PAIR ;
                          SWAP ;
                          CAR ;
                          NIL (pair address (list (pair address nat nat))) ;
                          DIG 2 ;
                          CONS ;
                          PAIR ;
                          DIG 6 ;
                          SWAP ;
                          EXEC ;
                          DUP 3 ;
                          DUP 5 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          CAR ;
                          ADD ;
                          NIL operation ;
                          DIG 2 ;
                          CONS ;
                          DUP 5 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          DUP 6 ;
                          CDR ;
                          PAIR ;
                          DIG 6 ;
                          SWAP ;
                          EXEC ;
                          DUP 6 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CAR ;
                          DUP 5 ;
                          GET ;
                          IF_NONE
                            { DIG 6 ; DROP ; PUSH nat 0 ; PUSH nat 0 ; PAIR ; DIG 5 ; DIG 2 }
                            { SWAP ;
                              PAIR ;
                              DIG 6 ;
                              SWAP ;
                              EXEC ;
                              DUP ;
                              CDR ;
                              DIG 5 ;
                              DUP 3 ;
                              CAR ;
                              CDR ;
                              ADD ;
                              DIG 2 ;
                              CAR ;
                              CAR } ;
                          PAIR ;
                          PAIR ;
                          DUP 5 ;
                          CDR ;
                          DUP 6 ;
                          CAR ;
                          CDR ;
                          DUP 7 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          CDR ;
                          DIG 5 ;
                          PAIR ;
                          DUP 7 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          PAIR ;
                          DUP 7 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          PAIR ;
                          PAIR ;
                          PAIR ;
                          DUP ;
                          CDR ;
                          DUP 2 ;
                          CAR ;
                          CDR ;
                          DUP 3 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          DUP 4 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          DIG 8 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CAR ;
                          DIG 6 ;
                          SOME ;
                          DIG 8 ;
                          UPDATE ;
                          PAIR ;
                          PAIR ;
                          DIG 3 ;
                          CAR ;
                          CAR ;
                          CAR }
                        { SENDER ;
                          DUP 3 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          DUP 4 ;
                          CDR ;
                          PAIR ;
                          DIG 4 ;
                          SWAP ;
                          EXEC ;
                          DUP 4 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CAR ;
                          DUP 3 ;
                          GET ;
                          IF_NONE
                            { SWAP ; DIG 4 ; DIG 5 ; DROP 4 ; PUSH nat 114 ; FAILWITH }
                            { SWAP ;
                              PAIR ;
                              DIG 4 ;
                              SWAP ;
                              EXEC ;
                              DUP 3 ;
                              PAIR ;
                              DIG 4 ;
                              SWAP ;
                              EXEC ;
                              DUP 4 ;
                              CAR ;
                              CAR ;
                              CDR ;
                              CAR ;
                              CAR ;
                              SWAP ;
                              SOME ;
                              DIG 2 ;
                              UPDATE } ;
                          DUP 3 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          CDR ;
                          DUP 4 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          CAR ;
                          PAIR ;
                          SENDER ;
                          DIG 3 ;
                          DIG 2 ;
                          UNPAIR ;
                          NIL (pair address nat nat) ;
                          DUP 4 ;
                          DUP 4 ;
                          CDR ;
                          DIG 6 ;
                          PAIR 3 ;
                          CONS ;
                          SELF_ADDRESS ;
                          PAIR ;
                          DIG 2 ;
                          CAR ;
                          NIL (pair address (list (pair address nat nat))) ;
                          DIG 2 ;
                          CONS ;
                          PAIR ;
                          DIG 5 ;
                          SWAP ;
                          EXEC ;
                          DUG 2 ;
                          SUB ;
                          ISNAT ;
                          IF_NONE { PUSH nat 300 ; FAILWITH } {} ;
                          NIL operation ;
                          DIG 2 ;
                          CONS ;
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
                          DUP 7 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          CDR ;
                          DIG 6 ;
                          PAIR ;
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
                          DUP 2 ;
                          CAR ;
                          CDR ;
                          DUP 3 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CDR ;
                          CDR ;
                          DIG 5 ;
                          PAIR ;
                          DUP 4 ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          PAIR ;
                          DIG 3 ;
                          CAR ;
                          CAR ;
                          CAR } ;
                      PAIR ;
                      PAIR ;
                      PAIR ;
                      SWAP ;
                      PAIR } }
                { DIG 2 ;
                  DIG 7 ;
                  DIG 8 ;
                  DIG 9 ;
                  DIG 10 ;
                  DIG 11 ;
                  DIG 12 ;
                  DIG 15 ;
                  DROP 8 ;
                  IF_LEFT
                    { DIG 2 ;
                      DIG 4 ;
                      DIG 5 ;
                      DROP 3 ;
                      IF_LEFT
                        { DUP 2 ;
                          SWAP ;
                          ITER { SWAP ;
                                 DUP ;
                                 CAR ;
                                 CDR ;
                                 CAR ;
                                 CDR ;
                                 CAR ;
                                 IF_NONE
                                   { PUSH bool False }
                                   { DUP ;
                                     CAR ;
                                     DUP 4 ;
                                     COMPARE ;
                                     EQ ;
                                     IF { DROP ; PUSH bool True } { GET 4 ; DUP 7 ; DUP 4 ; PAIR ; MEM } } ;
                                 IF { PUSH nat 123 ; FAILWITH } {} ;
                                 DUP ;
                                 CAR ;
                                 CDR ;
                                 CDR ;
                                 CDR ;
                                 CDR ;
                                 DUP 3 ;
                                 SENDER ;
                                 PAIR ;
                                 GET ;
                                 IF_NONE { PUSH nat 124 ; FAILWITH } {} ;
                                 SWAP ;
                                 DUP 4 ;
                                 CAR ;
                                 CAR ;
                                 CAR ;
                                 CAR ;
                                 CDR ;
                                 CAR ;
                                 CDR ;
                                 CAR ;
                                 CDR ;
                                 SENDER ;
                                 PAIR ;
                                 PUSH nat 0 ;
                                 DIG 3 ;
                                 PAIR ;
                                 PAIR ;
                                 PAIR ;
                                 DUP 4 ;
                                 SWAP ;
                                 EXEC ;
                                 DUP ;
                                 CDR ;
                                 DUP 2 ;
                                 CAR ;
                                 CDR ;
                                 CDR ;
                                 CDR ;
                                 CDR ;
                                 DIG 3 ;
                                 SENDER ;
                                 PAIR ;
                                 NONE nat ;
                                 SWAP ;
                                 UPDATE ;
                                 DUP 3 ;
                                 CAR ;
                                 CDR ;
                                 CDR ;
                                 CDR ;
                                 CAR ;
                                 PAIR ;
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
                                 PAIR } ;
                          SWAP ;
                          DIG 2 ;
                          DIG 4 ;
                          DROP 3 }
                        { DIG 2 ;
                          DIG 4 ;
                          DROP 2 ;
                          DUP 2 ;
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
                          CDR ;
                          DUP 6 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          CDR ;
                          CAR ;
                          DIG 5 ;
                          ITER { SWAP ;
                                 DUP 2 ;
                                 CDR ;
                                 SENDER ;
                                 PAIR ;
                                 SWAP ;
                                 DIG 2 ;
                                 CAR ;
                                 IF { UNIT ; SOME } { NONE unit } ;
                                 DIG 2 ;
                                 UPDATE } ;
                          PAIR ;
                          DIG 4 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          CAR ;
                          PAIR ;
                          PAIR ;
                          PAIR ;
                          PAIR } }
                    { DIG 3 ;
                      DROP ;
                      ITER { SWAP ;
                             DUP 2 ;
                             CDR ;
                             IF_NONE
                               { SENDER ; DUP 3 ; CAR }
                               { DUP 3 ;
                                 CAR ;
                                 DUP 3 ;
                                 CDR ;
                                 DUP 4 ;
                                 CAR ;
                                 CDR ;
                                 CDR ;
                                 CDR ;
                                 DUP 5 ;
                                 CAR ;
                                 CDR ;
                                 CDR ;
                                 CAR ;
                                 CDR ;
                                 PUSH nat 1 ;
                                 DUP 7 ;
                                 CAR ;
                                 CDR ;
                                 CDR ;
                                 CAR ;
                                 CAR ;
                                 ADD ;
                                 PAIR ;
                                 PAIR ;
                                 DUP 5 ;
                                 CAR ;
                                 CDR ;
                                 CAR ;
                                 PAIR ;
                                 DUP 5 ;
                                 CAR ;
                                 CAR ;
                                 PAIR ;
                                 PAIR ;
                                 DUP 2 ;
                                 DIG 4 ;
                                 CAR ;
                                 CDR ;
                                 CDR ;
                                 CAR ;
                                 CAR ;
                                 PAIR ;
                                 SELF_ADDRESS ;
                                 CHAIN_ID ;
                                 PAIR ;
                                 PAIR ;
                                 PACK ;
                                 DUP ;
                                 DUP 5 ;
                                 UNPAIR ;
                                 CHECK_SIGNATURE ;
                                 IF { DROP ; DIG 2 ; CAR ; HASH_KEY ; IMPLICIT_ACCOUNT ; ADDRESS }
                                    { DIG 3 ; DROP ; PUSH nat 109 ; PAIR ; FAILWITH } ;
                                 DIG 2 } ;
                             DIG 3 ;
                             CAR ;
                             CAR ;
                             CAR ;
                             DUP 4 ;
                             CAR ;
                             CAR ;
                             CAR ;
                             CDR ;
                             CAR ;
                             DUP 4 ;
                             DUP 3 ;
                             PAIR ;
                             MEM ;
                             NOT ;
                             DUP 2 ;
                             DIG 4 ;
                             COMPARE ;
                             NEQ ;
                             AND ;
                             IF { DROP ; PUSH nat 120 ; FAILWITH } {} ;
                             DUP 2 ;
                             CAR ;
                             CDR ;
                             DUP 4 ;
                             DUP 2 ;
                             PAIR ;
                             DUP 8 ;
                             SWAP ;
                             EXEC ;
                             DUP 5 ;
                             CAR ;
                             CDR ;
                             CAR ;
                             CDR ;
                             CAR ;
                             IF_NONE
                               { SWAP ; DROP ; PUSH bool False }
                               { DUP ;
                                 CAR ;
                                 DUP 4 ;
                                 COMPARE ;
                                 EQ ;
                                 IF { DIG 2 ; DROP 2 ; PUSH bool True }
                                    { GET 4 ; DUP 11 ; DIG 3 ; PAIR ; MEM } } ;
                             IF {} { DROP ; PUSH nat 103 ; FAILWITH } ;
                             DUP 4 ;
                             CAR ;
                             CAR ;
                             CAR ;
                             CAR ;
                             CDR ;
                             CAR ;
                             CDR ;
                             CAR ;
                             CDR ;
                             DUP 5 ;
                             CDR ;
                             PAIR ;
                             DUP 7 ;
                             SWAP ;
                             EXEC ;
                             DUP 2 ;
                             CDR ;
                             CDR ;
                             CDR ;
                             SWAP ;
                             COMPARE ;
                             EQ ;
                             IF { DIG 3 } { DIG 3 ; DROP ; PUSH nat 104 ; FAILWITH } ;
                             DUP 4 ;
                             CAR ;
                             CDR ;
                             DUP 5 ;
                             CDR ;
                             CAR ;
                             DUP 3 ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CDR ;
                             CDR ;
                             DUP 3 ;
                             DUP 7 ;
                             PAIR ;
                             GET ;
                             IF_NONE { PUSH nat 0 } {} ;
                             ADD ;
                             DUP 6 ;
                             CDR ;
                             CDR ;
                             IF { DUP 4 ;
                                  CDR ;
                                  CDR ;
                                  CDR ;
                                  DUP 7 ;
                                  CDR ;
                                  CAR ;
                                  DUP 6 ;
                                  CDR ;
                                  CDR ;
                                  CAR ;
                                  ADD ;
                                  PAIR ;
                                  DUP 5 ;
                                  CDR ;
                                  CAR ;
                                  PAIR ;
                                  DIG 4 ;
                                  CAR }
                                { DUP 4 ;
                                  CDR ;
                                  DUP 5 ;
                                  CAR ;
                                  CDR ;
                                  DUP 6 ;
                                  CAR ;
                                  CAR ;
                                  CDR ;
                                  DUP 9 ;
                                  CDR ;
                                  CAR ;
                                  DIG 7 ;
                                  CAR ;
                                  CAR ;
                                  CAR ;
                                  ADD ;
                                  PAIR ;
                                  PAIR } ;
                             PAIR ;
                             DUP 4 ;
                             DIG 4 ;
                             CAR ;
                             CAR ;
                             CAR ;
                             CAR ;
                             CDR ;
                             CAR ;
                             CDR ;
                             CAR ;
                             CDR ;
                             PAIR ;
                             DUP 5 ;
                             DIG 6 ;
                             CDR ;
                             CAR ;
                             PAIR ;
                             PAIR ;
                             DUP 6 ;
                             SWAP ;
                             EXEC ;
                             DUP ;
                             CDR ;
                             DUP 2 ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CDR ;
                             DUP 3 ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CAR ;
                             CDR ;
                             DIG 4 ;
                             DUP 7 ;
                             SWAP ;
                             SOME ;
                             SWAP ;
                             UPDATE ;
                             DUP 4 ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CAR ;
                             CAR ;
                             PAIR ;
                             PAIR ;
                             DUP 3 ;
                             CAR ;
                             CDR ;
                             CAR ;
                             PAIR ;
                             DUP 3 ;
                             CAR ;
                             CAR ;
                             PAIR ;
                             PAIR ;
                             DUP ;
                             CDR ;
                             DIG 2 ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CDR ;
                             CDR ;
                             DIG 3 ;
                             DIG 4 ;
                             DIG 5 ;
                             PAIR ;
                             SWAP ;
                             SOME ;
                             SWAP ;
                             UPDATE ;
                             DUP 3 ;
                             CAR ;
                             CDR ;
                             CDR ;
                             CDR ;
                             CAR ;
                             PAIR ;
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
                             PAIR } ;
                      SWAP ;
                      DIG 2 ;
                      DIG 3 ;
                      DIG 5 ;
                      DROP 4 } ;
                  SWAP ;
                  PAIR } } } } 
`
