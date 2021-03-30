export default `parameter (or (or (or (or (unit %accept_ownership)
(pair %burn (address %from_)
            (pair (nat %token_id)
                  (nat %amount))))
(or (or %call_FA2 (or (pair %balance_of 
                                    (list %requests (pair 
                                                          (address %owner)
                                                          (nat %token_id)))
                                    (contract %callback (list (pair 
                                                                    (pair %request 
                                                                                   (address %owner)
                                                                                   (nat %token_id))
                                                                    (nat %balance)))))
                  (list %transfer (pair 
                                        (address %from_)
                                        (list %txs (pair 
                                                         (address %to_)
                                                         (pair 
                                                               (nat %token_id)
                                                               (nat %amount)))))))
              (list %update_operators (or 
                                          (pair %add_operator 
                                                              (address %owner)
                                                              (pair 
                                                                    (address %operator)
                                                                    (nat %token_id)))
                                          (pair %remove_operator 
                                                                 (address %owner)
                                                                 (pair 
                                                                       (address %operator)
                                                                       (nat %token_id))))))
(or %callCustom (unit %default)
                (unit %none))))
(or (or (unit %confirm_migration)
(bytes %drop_proposal))
(or (nat %flush)
(pair %get_vote_permit_counter (unit %voidParam)
                               (lambda %voidResProxy 
                                                     nat
                                                     nat)))))
(or (or (or (address :newAddress %migrate)
(pair %mint (address %to_)
            (pair (nat %token_id)
                  (nat %amount))))
(or (pair %propose (nat %frozen_token)
               (pair %proposal_metadata 
                                        (nat %agora_post_id)
                                        (list %transfers (or 
                                                             (pair %transfer_type
                                                                   (mutez %amount)
                                                                   (address %recipient))
                                                             (pair %transfer_fa2
                                                                   (address %contract_address)
                                                                   (list %transfer_list (pair
                                                                                              (address %from_)
                                                                                              (list %txs (pair
                                                                                                               (address %to_)
                                                                                                               (pair
                                                                                                                     (nat %token_id)
                                                                                                                     (nat %amount)))))))))))
(nat %set_quorum_threshold)))
(or (or (nat %set_voting_period)
(pair %transfer_contract_tokens 
                                (address %contract_address)
                                (list %params (pair 
                                                    (address %from_)
                                                    (list %txs (pair 
                                                                     (address %to_)
                                                                     (pair 
                                                                           (nat %token_id)
                                                                           (nat %amount))))))))
(or (address :newOwner %transfer_ownership)
(or (list %vote (pair :permit_protected (pair 
                                              (bytes %proposal_key)
                                              (pair 
                                                    (bool %vote_type)
                                                    (nat %vote_amount)))
                                        (option %permit (pair 
                                                              (key %key)
                                                              (signature %signature)))))
    (pair %get_total_supply (nat %voidParam)
                            (lambda %voidResProxy nat
                                                  nat)))))));
storage (pair (pair (pair (pair (big_map %ledger (pair address
                             nat)
                       nat)
      (big_map %operators (pair (address :owner)
                                (address :operator))
                          unit))
(pair (address %token_address)
      (address %admin)))
(pair (pair (address %pending_owner)
      (or %migration_status (unit %notInMigration)
                            (or (address %migratingTo)
                                (address %migratedTo))))
(pair (nat %voting_period)
      (nat %quorum_threshold))))
(pair (pair (pair (pair %extra (pair (nat %frozen_scale_value)
                         (pair 
                               (nat %frozen_extra_value)
                               (nat %slash_scale_value)))
                   (pair (pair 
                               (nat %slash_division_value)
                               (mutez %min_xtz_amount))
                         (pair (mutez %max_xtz_amount)
                               (nat %max_proposal_size))))
      (big_map %proposals bytes
                          (pair (pair (nat %upvotes)
                                      (pair 
                                            (nat %downvotes)
                                            (timestamp %start_date)))
                                (pair (pair 
                                            (pair %metadata 
                                                            (nat %agora_post_id)
                                                            (list %transfers (or 
                                                                                 (pair 
                                                                                       (mutez %amount)
                                                                                       (address %recipient))
                                                                                 (pair 
                                                                                       (address %contract_address)
                                                                                       (list %transfer_list (pair 
                                                                                                                  (address %from_)
                                                                                                                  (list %txs (pair 
                                                                                                                                   (address %to_)
                                                                                                                                   (pair 
                                                                                                                                         (nat %token_id)
                                                                                                                                         (nat %amount))))))))))
                                            (address %proposer))
                                      (pair 
                                            (nat %proposer_frozen_token)
                                            (list %voters (pair 
                                                                (pair 
                                                                      (nat %amount)
                                                                      (bool %type))
                                                                (address %address))))))))
(pair (set %proposal_key_list_sort_by_date (pair 
                                                 timestamp
                                                 bytes))
      (nat %permits_counter)))
(pair (pair (big_map %metadata string
                         bytes)
      (map %total_supply nat
                         nat))
(pair (nat %unfrozen_token_id)
      (nat %frozen_token_id)))));
code { DIP { PUSH
(lambda (pair (pair (pair (pair (pair (big_map (pair address nat) nat) (big_map (pair address address) unit)) (pair address address)) (pair (pair address (or unit (or address address))) (pair nat nat))) (pair (pair (pair (pair (pair nat (pair nat nat)) (pair (pair nat mutez) (pair mutez nat))) (big_map bytes (pair (pair nat (pair nat timestamp)) (pair (pair (pair nat (list (or (pair mutez address) (pair address (list (pair address (list (pair address (pair nat nat))))))))) address) (pair nat (list (pair (pair nat bool) address))))))) (pair (set (pair timestamp bytes)) nat)) (pair (pair (big_map string bytes) (map nat nat)) (pair nat nat)))) (pair address (pair nat nat))) (pair (pair (pair (pair (big_map (pair address nat) nat) (big_map (pair address address) unit)) (pair address address)) (pair (pair address (or unit (or address address))) (pair nat nat))) (pair (pair (pair (pair (pair nat (pair nat nat)) (pair (pair nat mutez) (pair mutez nat))) (big_map bytes (pair (pair nat (pair nat timestamp)) (pair (pair (pair nat (list (or (pair mutez address) (pair address (list (pair address (list (pair address (pair nat nat))))))))) address) (pair nat (list (pair (pair nat bool) address))))))) (pair (set (pair timestamp bytes)) nat)) (pair (pair (big_map string bytes) (map nat nat)) (pair nat nat)))))
{ DUP;
CAR;
DIP { CDR;
DUP;
CAR;
DIP { CDR };
DIP { DUP;
   CAR;
   DIP { CDR } };
PAIR };
DUP 3;
DUP 3;
CDR;
DUP 3;
DUP 2;
DIP { CDR;
CDR;
CAR;
CDR };
GET;
IF_NONE { UNIT;
 PUSH string "FA2_TOKEN_UNDEFINED";
 PAIR;
 FAILWITH }
{  };
DIP { SWAP };
ADD;
SOME;
SWAP;
DIP { DIP { DUP;
   CDR;
   CDR;
   CAR;
   CDR } };
UPDATE;
DIP { DUP;
DIP { CAR };
CDR;
DUP;
DIP { CAR };
CDR;
DUP;
DIP { CDR };
CAR;
DUP;
DIP { CAR };
CDR };
SWAP;
DROP;
SWAP;
PAIR;
PAIR;
SWAP;
PAIR;
SWAP;
PAIR;
DUP;
DUP 3;
DIP { CAR;
CAR;
CAR;
CAR };
GET;
IF_NONE { SWAP;
 DIG 2;
 SOME;
 SWAP;
 DIP { DIP { DUP;
             CAR;
             CAR;
             CAR;
             CAR } };
 UPDATE;
 DIP { DUP;
       DIP { CDR };
       CAR;
       DUP;
       DIP { CDR };
       CAR;
       DUP;
       DIP { CDR };
       CAR;
       DUP;
       DIP { CDR };
       CAR };
 SWAP;
 DROP;
 PAIR;
 PAIR;
 PAIR;
 PAIR }
{ DIG 3;
 ADD;
 SOME;
 DIP { SWAP };
 SWAP;
 DIP { DIP { DUP;
             CAR;
             CAR;
             CAR;
             CAR } };
 UPDATE;
 DIP { DUP;
       DIP { CDR };
       CAR;
       DUP;
       DIP { CDR };
       CAR;
       DUP;
       DIP { CDR };
       CAR;
       DUP;
       DIP { CDR };
       CAR };
 SWAP;
 DROP;
 PAIR;
 PAIR;
 PAIR;
 PAIR } };
PUSH
(lambda (pair (pair (pair (pair (pair (big_map (pair address nat) nat) (big_map (pair address address) unit)) (pair address address)) (pair (pair address (or unit (or address address))) (pair nat nat))) (pair (pair (pair (pair (pair nat (pair nat nat)) (pair (pair nat mutez) (pair mutez nat))) (big_map bytes (pair (pair nat (pair nat timestamp)) (pair (pair (pair nat (list (or (pair mutez address) (pair address (list (pair address (list (pair address (pair nat nat))))))))) address) (pair nat (list (pair (pair nat bool) address))))))) (pair (set (pair timestamp bytes)) nat)) (pair (pair (big_map string bytes) (map nat nat)) (pair nat nat)))) (pair address (pair nat nat))) (pair (pair (pair (pair (big_map (pair address nat) nat) (big_map (pair address address) unit)) (pair address address)) (pair (pair address (or unit (or address address))) (pair nat nat))) (pair (pair (pair (pair (pair nat (pair nat nat)) (pair (pair nat mutez) (pair mutez nat))) (big_map bytes (pair (pair nat (pair nat timestamp)) (pair (pair (pair nat (list (or (pair mutez address) (pair address (list (pair address (list (pair address (pair nat nat))))))))) address) (pair nat (list (pair (pair nat bool) address))))))) (pair (set (pair timestamp bytes)) nat)) (pair (pair (big_map string bytes) (map nat nat)) (pair nat nat)))))
{ DUP;
CAR;
DIP { CDR;
DUP;
CAR;
DIP { CDR };
DIP { DUP;
   CAR;
   DIP { CDR } };
PAIR };
DUP;
DUP 3;
DIP { CAR;
CAR;
CAR;
CAR };
GET;
IF_NONE { SWAP;
 DROP;
 SWAP;
 DUP;
 INT;
 EQ;
 IF { DROP }
    { PUSH nat 0;
      SWAP;
      PAIR;
      PUSH string "FA2_INSUFFICIENT_BALANCE";
      PAIR;
      FAILWITH } }
{ SWAP;
 DUP 4;
 DUP 4;
 CDR;
 DUP 3;
 DUP 2;
 DIP { CDR;
       CDR;
       CAR;
       CDR };
 GET;
 IF_NONE { UNIT;
           PUSH string "FA2_TOKEN_UNDEFINED";
           PAIR;
           FAILWITH }
         {  };
 DIP { SWAP };
 SUB;
 ISNAT;
 IF_NONE { UNIT;
           PUSH string "NEGATIVE_TOTAL_SUPPLY";
           PAIR;
           FAILWITH }
         {  };
 SOME;
 SWAP;
 DIP { DIP { DUP;
             CDR;
             CDR;
             CAR;
             CDR } };
 UPDATE;
 DIP { DUP;
       DIP { CAR };
       CDR;
       DUP;
       DIP { CAR };
       CDR;
       DUP;
       DIP { CDR };
       CAR;
       DUP;
       DIP { CAR };
       CDR };
 SWAP;
 DROP;
 SWAP;
 PAIR;
 PAIR;
 SWAP;
 PAIR;
 SWAP;
 PAIR;
 SWAP;
 DUP 4;
 DUP 2;
 SUB;
 ISNAT;
 IF_NONE { DIP { DROP 2 };
           SWAP;
           PAIR;
           PUSH string "FA2_INSUFFICIENT_BALANCE";
           PAIR;
           FAILWITH }
         { SWAP;
           DROP;
           SOME;
           DIP { SWAP };
           SWAP;
           DIP { DIP { DUP;
                       CAR;
                       CAR;
                       CAR;
                       CAR } };
           UPDATE;
           DIP { DUP;
                 DIP { CDR };
                 CAR;
                 DUP;
                 DIP { CDR };
                 CAR;
                 DUP;
                 DIP { CDR };
                 CAR;
                 DUP;
                 DIP { CDR };
                 CAR };
           SWAP;
           DROP;
           PAIR;
           PAIR;
           PAIR;
           PAIR;
           SWAP;
           DROP } } } };
DUP;
CAR;
DIP { CDR };
IF_LEFT { IF_LEFT { IF_LEFT { IF_LEFT { DROP;
                     DUP;
                     CAR;
                     CDR;
                     CAR;
                     CDR;
                     IF_LEFT { DROP }
                             { IF_LEFT { DROP }
                                       { PUSH string "MIGRATED";
                                         PAIR;
                                         FAILWITH } };
                     DUP;
                     CAR;
                     CDR;
                     CAR;
                     CAR;
                     SENDER;
                     COMPARE;
                     EQ;
                     IF {  }
                        { PUSH string "NOT_PENDING_ADMIN";
                          FAILWITH };
                     DUP;
                     CAR;
                     CDR;
                     CAR;
                     CAR;
                     DIP { DUP;
                           DIP { CDR };
                           CAR;
                           DUP;
                           DIP { CDR };
                           CAR;
                           DUP;
                           DIP { CAR };
                           CDR;
                           DUP;
                           DIP { CAR };
                           CDR };
                     SWAP;
                     DROP;
                     SWAP;
                     PAIR;
                     SWAP;
                     PAIR;
                     PAIR;
                     PAIR;
                     NIL operation;
                     PAIR }
                   { DIP { DUP;
                           CAR;
                           CDR;
                           CAR;
                           CDR;
                           IF_LEFT { DROP }
                                   { IF_LEFT { DROP }
                                             { PUSH string "MIGRATED";
                                               PAIR;
                                               FAILWITH } };
                           DUP;
                           CAR;
                           CAR;
                           CDR;
                           CDR;
                           SENDER;
                           COMPARE;
                           EQ;
                           IF {  }
                              { PUSH string "NOT_ADMIN";
                                FAILWITH } };
                     SWAP;
                     DIP { DUP;
                           CDR;
                           CAR;
                           DIP { DUP;
                                 CDR;
                                 CDR };
                           PAIR;
                           SWAP;
                           CAR };
                     DUP 4;
                     DIP { DIP { PAIR };
                           PAIR };
                     SWAP;
                     EXEC;
                     NIL operation;
                     PAIR } }
         { IF_LEFT { IF_LEFT { IF_LEFT { DIP { DUP;
                                               CAR;
                                               CDR;
                                               CAR;
                                               CDR;
                                               IF_LEFT { DROP }
                                                       { IF_LEFT { DROP }
                                                                 { PUSH string "MIGRATED";
                                                                   PAIR;
                                                                   FAILWITH } } };
                                         DUP;
                                         CAR;
                                         DIP { CDR;
                                               DUP 2 };
                                         NIL (pair (pair address nat) nat);
                                         SWAP;
                                         ITER { DUP;
                                                CAR;
                                                SWAP;
                                                DUP;
                                                CDR;
                                                SWAP;
                                                DUG 2;
                                                DUP;
                                                DUP 6;
                                                DUP;
                                                CDR;
                                                CDR;
                                                CDR;
                                                CAR;
                                                DIP { SWAP };
                                                COMPARE;
                                                EQ;
                                                IF { DROP }
                                                   { DIP { DUP };
                                                     CDR;
                                                     CDR;
                                                     CDR;
                                                     CDR;
                                                     COMPARE;
                                                     EQ;
                                                     IF {  }
                                                        { UNIT;
                                                          PUSH string "FA2_TOKEN_UNDEFINED";
                                                          PAIR;
                                                          FAILWITH } };
                                                SWAP;
                                                PAIR;
                                                DIG 3;
                                                DUP;
                                                CAR;
                                                CAR;
                                                CAR;
                                                CAR;
                                                DIG 2;
                                                GET;
                                                SWAP;
                                                DUG 3;
                                                IF_NONE { PUSH nat 0;
                                                          SWAP;
                                                          PAIR;
                                                          CONS }
                                                        { SWAP;
                                                          PAIR;
                                                          CONS } };
                                         SWAP;
                                         DROP;
                                         DIP { AMOUNT };
                                         TRANSFER_TOKENS;
                                         NIL operation;
                                         SWAP;
                                         CONS;
                                         PAIR }
                                       { DIP { DUP;
                                               CAR;
                                               CDR;
                                               CAR;
                                               CDR;
                                               IF_LEFT { DROP }
                                                       { IF_LEFT { DROP }
                                                                 { PUSH string "MIGRATED";
                                                                   PAIR;
                                                                   FAILWITH } } };
                                         ITER { SWAP;
                                                DUP;
                                                CAR;
                                                CAR;
                                                CDR;
                                                CDR;
                                                SENDER;
                                                COMPARE;
                                                EQ;
                                                DIG 2;
                                                DUP;
                                                CDR;
                                                SWAP;
                                                DUP;
                                                CAR;
                                                SWAP;
                                                DROP;
                                                DUG 2;
                                                ITER { SWAP;
                                                       DUP;
                                                       IF {  }
                                                          { DUG 3;
                                                            DUG 3;
                                                            DUP;
                                                            SENDER;
                                                            COMPARE;
                                                            EQ;
                                                            IF {  }
                                                               { DUP;
                                                                 DIG 2;
                                                                 DUP;
                                                                 CAR;
                                                                 CAR;
                                                                 CAR;
                                                                 CDR;
                                                                 SWAP;
                                                                 DUG 3;
                                                                 SWAP;
                                                                 SENDER;
                                                                 SWAP;
                                                                 PAIR;
                                                                 MEM;
                                                                 IF {  }
                                                                    { UNIT;
                                                                      PUSH string "FA2_NOT_OPERATOR";
                                                                      PAIR;
                                                                      FAILWITH } };
                                                            DIG 3;
                                                            DIG 3 };
                                                       DUG 3;
                                                       DUP;
                                                       CAR;
                                                       SWAP;
                                                       DUP;
                                                       CDR;
                                                       CDR;
                                                       SWAP;
                                                       DUP;
                                                       CDR;
                                                       CAR;
                                                       SWAP;
                                                       DROP;
                                                       DUP;
                                                       DUP 6;
                                                       DUP;
                                                       CDR;
                                                       CDR;
                                                       CDR;
                                                       CAR;
                                                       DIP { SWAP };
                                                       COMPARE;
                                                       EQ;
                                                       IF { DROP }
                                                          { DIP { DUP };
                                                            CDR;
                                                            CDR;
                                                            CDR;
                                                            CDR;
                                                            COMPARE;
                                                            EQ;
                                                            IF { DIG 5;
                                                                 DUP;
                                                                 IF { DUG 5 }
                                                                    { PUSH string "FROZEN_TOKEN_NOT_TRANSFERABLE";
                                                                      FAILWITH } }
                                                               { UNIT;
                                                                 PUSH string "FA2_TOKEN_UNDEFINED";
                                                                 PAIR;
                                                                 FAILWITH } };
                                                       PAIR;
                                                       DUP;
                                                       DIG 3;
                                                       DUP;
                                                       DUG 5;
                                                       DIG 3;
                                                       DUG 2;
                                                       DIG 4;
                                                       DUP 8;
                                                       DIP { DIP { PAIR };
                                                             PAIR };
                                                       SWAP;
                                                       EXEC;
                                                       DUP 7;
                                                       DIP { DIP { PAIR };
                                                             PAIR };
                                                       SWAP;
                                                       EXEC;
                                                       DUG 2;
                                                       SWAP };
                                                DROP 2 };
                                         NIL operation;
                                         PAIR } }
                             { DIP { DUP;
                                     CAR;
                                     CDR;
                                     CAR;
                                     CDR;
                                     IF_LEFT { DROP }
                                             { IF_LEFT { DROP }
                                                       { PUSH string "MIGRATED";
                                                         PAIR;
                                                         FAILWITH } } };
                               ITER { IF_LEFT { DIP { DUP };
                                                DUP;
                                                CDR;
                                                CDR;
                                                DIP { DUP;
                                                      CDR;
                                                      CAR;
                                                      DIP { CAR };
                                                      DIG 2;
                                                      DUP;
                                                      CDR;
                                                      CDR;
                                                      CDR;
                                                      CAR };
                                                DUP;
                                                DIP { SWAP };
                                                COMPARE;
                                                EQ;
                                                IF { DROP 2 }
                                                   { DIP { CDR;
                                                           CDR;
                                                           CDR;
                                                           CDR };
                                                     COMPARE;
                                                     EQ;
                                                     IF { PUSH string "OPERATION_PROHIBITED";
                                                          FAILWITH }
                                                        { UNIT;
                                                          PUSH string "FA2_TOKEN_UNDEFINED";
                                                          PAIR;
                                                          FAILWITH } };
                                                SWAP;
                                                DUP;
                                                SENDER;
                                                COMPARE;
                                                EQ;
                                                IF {  }
                                                   { PUSH string "NOT_OWNER";
                                                     FAILWITH };
                                                PAIR;
                                                SWAP;
                                                DUP;
                                                CAR;
                                                CAR;
                                                CAR;
                                                CDR;
                                                DIG 2;
                                                DUP 2;
                                                DUP 2;
                                                MEM;
                                                IF { DROP 2 }
                                                   { UNIT;
                                                     SOME;
                                                     SWAP;
                                                     UPDATE;
                                                     DIP { DUP;
                                                           DIP { CDR };
                                                           CAR;
                                                           DUP;
                                                           DIP { CDR };
                                                           CAR;
                                                           DUP;
                                                           DIP { CDR };
                                                           CAR;
                                                           DUP;
                                                           DIP { CAR };
                                                           CDR };
                                                     SWAP;
                                                     DROP;
                                                     SWAP;
                                                     PAIR;
                                                     PAIR;
                                                     PAIR;
                                                     PAIR } }
                                              { DIP { DUP };
                                                DUP;
                                                CDR;
                                                CDR;
                                                DIP { DUP;
                                                      CDR;
                                                      CAR;
                                                      DIP { CAR };
                                                      DIG 2;
                                                      DUP;
                                                      CDR;
                                                      CDR;
                                                      CDR;
                                                      CAR };
                                                DUP;
                                                DIP { SWAP };
                                                COMPARE;
                                                EQ;
                                                IF { DROP 2 }
                                                   { DIP { CDR;
                                                           CDR;
                                                           CDR;
                                                           CDR };
                                                     COMPARE;
                                                     EQ;
                                                     IF { PUSH string "OPERATION_PROHIBITED";
                                                          FAILWITH }
                                                        { UNIT;
                                                          PUSH string "FA2_TOKEN_UNDEFINED";
                                                          PAIR;
                                                          FAILWITH } };
                                                SWAP;
                                                DUP;
                                                SENDER;
                                                COMPARE;
                                                EQ;
                                                IF {  }
                                                   { PUSH string "NOT_OWNER";
                                                     FAILWITH };
                                                PAIR;
                                                SWAP;
                                                DUP;
                                                CAR;
                                                CAR;
                                                CAR;
                                                CDR;
                                                DIG 2;
                                                DUP 2;
                                                DUP 2;
                                                MEM;
                                                IF { PUSH (option unit) None;
                                                     SWAP;
                                                     UPDATE;
                                                     DIP { DUP;
                                                           DIP { CDR };
                                                           CAR;
                                                           DUP;
                                                           DIP { CDR };
                                                           CAR;
                                                           DUP;
                                                           DIP { CDR };
                                                           CAR;
                                                           DUP;
                                                           DIP { CAR };
                                                           CDR };
                                                     SWAP;
                                                     DROP;
                                                     SWAP;
                                                     PAIR;
                                                     PAIR;
                                                     PAIR;
                                                     PAIR }
                                                   { DROP 2 } } };
                               NIL operation;
                               PAIR } }
                   { IF_LEFT { DROP;
                               DUP;
                               CAR;
                               CDR;
                               CAR;
                               CDR;
                               IF_LEFT { DROP }
                                       { IF_LEFT { DROP }
                                                 { PUSH string "MIGRATED";
                                                   PAIR;
                                                   FAILWITH } };
                               NIL operation }
                             { DROP;
                               NIL operation };
                     PAIR } } }
{ IF_LEFT { IF_LEFT { DROP;
                     DUP;
                     CAR;
                     CDR;
                     CAR;
                     CDR;
                     IF_LEFT { DROP;
                               PUSH string "NOT_MIGRATING";
                               FAILWITH }
                             { IF_LEFT { DUP;
                                         SENDER;
                                         COMPARE;
                                         EQ;
                                         IF {  }
                                            { PUSH string "NOT_MIGRATION_TARGET";
                                              FAILWITH };
                                         RIGHT address;
                                         RIGHT unit;
                                         DIP { DUP;
                                               DIP { CDR };
                                               CAR;
                                               DUP;
                                               DIP { CAR };
                                               CDR;
                                               DUP;
                                               DIP { CDR };
                                               CAR;
                                               DUP;
                                               DIP { CAR };
                                               CDR };
                                         SWAP;
                                         DROP;
                                         SWAP;
                                         PAIR;
                                         PAIR;
                                         SWAP;
                                         PAIR;
                                         PAIR }
                                       { PUSH string "MIGRATED";
                                         PAIR;
                                         FAILWITH } };
                     NIL operation;
                     PAIR }
                   { DIP { DUP;
                           CAR;
                           CDR;
                           CAR;
                           CDR;
                           IF_LEFT { DROP }
                                   { IF_LEFT { DROP }
                                             { PUSH string "MIGRATED";
                                               PAIR;
                                               FAILWITH } };
                           DUP;
                           CAR;
                           CAR;
                           CDR;
                           CDR;
                           SENDER;
                           COMPARE;
                           EQ;
                           IF {  }
                              { PUSH string "NOT_ADMIN";
                                FAILWITH } };
                     DUP 2;
                     DUP 2;
                     DIP { CDR;
                           CAR;
                           CAR;
                           CDR };
                     GET;
                     IF_NONE { PUSH string "PROPOSAL_NOT_EXIST";
                               FAILWITH }
                             {  };
                     DIP { SWAP };
                     DUP 2;
                     DUP 2;
                     CAR;
                     CDR;
                     CDR;
                     SWAP;
                     CAR;
                     CDR;
                     CDR;
                     CAR;
                     INT;
                     ADD;
                     NOW;
                     COMPARE;
                     GE;
                     IF { PUSH bool True }
                        { PUSH bool False };
                     IF { DUP 2;
                          DUP 2;
                          DUP;
                          CAR;
                          CAR;
                          DIP { CAR;
                                CDR;
                                CAR };
                          ADD;
                          SWAP;
                          CAR;
                          CDR;
                          CDR;
                          CDR;
                          COMPARE;
                          LE;
                          IF { PUSH bool True }
                             { PUSH bool False };
                          DIP { DUP;
                                CAR;
                                CAR;
                                DIP { DUP;
                                      CAR;
                                      CDR;
                                      CAR };
                                COMPARE;
                                GT;
                                IF { PUSH bool True }
                                   { PUSH bool False } };
                          AND;
                          IF { NIL operation;
                               DUG 3;
                               DUP;
                               CDR;
                               CDR;
                               CAR;
                               DIP { DUP;
                                     CDR;
                                     CAR;
                                     CDR;
                                     DIP { SWAP } };
                               SWAP;
                               DIP { SWAP };
                               DUP 2;
                               DUP 2;
                               DIP { DUP;
                                     CDR;
                                     CDR;
                                     CDR;
                                     CDR };
                               PAIR;
                               DIP { CAR;
                                     CAR;
                                     CAR;
                                     CAR };
                               GET;
                               IF_NONE { PUSH string "PROPOSER_NOT_EXIST_IN_LEDGER";
                                         FAILWITH }
                                       {  };
                               DIG 3;
                               DUP 2;
                               DUP 2;
                               COMPARE;
                               GT;
                               IF { DROP }
                                  { SWAP;
                                    DROP };
                               DIG 2;
                               DUP 3;
                               DUP 3;
                               DUP 3;
                               CDR;
                               CDR;
                               CDR;
                               CDR;
                               PAIR;
                               DIP { SWAP };
                               SWAP;
                               DIP { SWAP };
                               DUP 9;
                               DIP { DIP { PAIR };
                                     PAIR };
                               SWAP;
                               EXEC;
                               DUP;
                               CDR;
                               CDR;
                               CDR;
                               CAR;
                               SWAP;
                               DIP { PAIR;
                                     SWAP };
                               DUP 8;
                               DIP { DIP { PAIR };
                                     PAIR };
                               SWAP;
                               EXEC;
                               SWAP;
                               DUP;
                               DIG 2;
                               SWAP;
                               CDR;
                               CDR;
                               CDR;
                               ITER { DUP;
                                      CAR;
                                      CAR;
                                      DIP { CDR };
                                      DIG 2;
                                      DUP 3;
                                      DUP 3;
                                      DUP 3;
                                      CDR;
                                      CDR;
                                      CDR;
                                      CDR;
                                      PAIR;
                                      DIP { SWAP };
                                      SWAP;
                                      DIP { SWAP };
                                      DUP 9;
                                      DIP { DIP { PAIR };
                                            PAIR };
                                      SWAP;
                                      EXEC;
                                      DUP;
                                      CDR;
                                      CDR;
                                      CDR;
                                      CAR;
                                      SWAP;
                                      DIP { PAIR;
                                            SWAP };
                                      DUP 8;
                                      DIP { DIP { PAIR };
                                            PAIR };
                                      SWAP;
                                      EXEC };
                               SWAP;
                               DIP { SWAP };
                               CAR;
                               CDR;
                               CDR;
                               PAIR;
                               DIP { DUP;
                                     CDR;
                                     CAR;
                                     CDR;
                                     CAR;
                                     PUSH bool False };
                               UPDATE;
                               DIP { DUP;
                                     DIP { CAR };
                                     CDR;
                                     DUP;
                                     DIP { CDR };
                                     CAR;
                                     DUP;
                                     DIP { CAR };
                                     CDR;
                                     DUP;
                                     DIP { CDR };
                                     CAR };
                               SWAP;
                               DROP;
                               PAIR;
                               SWAP;
                               PAIR;
                               PAIR;
                               SWAP;
                               PAIR;
                               SWAP;
                               PAIR }
                             { PUSH string "FAIL_DROP_PROPOSAL_NOT_ACCEPTED";
                               FAILWITH } }
                        { PUSH string "FAIL_DROP_PROPOSAL_NOT_OVER";
                          FAILWITH } } }
         { IF_LEFT { DIP { DUP;
                           CAR;
                           CDR;
                           CAR;
                           CDR;
                           IF_LEFT { DROP }
                                   { IF_LEFT { DROP }
                                             { PUSH string "MIGRATED";
                                               PAIR;
                                               FAILWITH } } };
                     DUP;
                     INT;
                     EQ;
                     IF { PUSH string "BAD_ENTRYPOINT_PARAMETER";
                          FAILWITH }
                        {  };
                     PUSH nat 0;
                     PAIR;
                     NIL operation;
                     DIG 2;
                     DUP;
                     CDR;
                     CAR;
                     CDR;
                     CAR;
                     ITER { CDR;
                            DUP 2;
                            DUP 2;
                            DIP { CDR;
                                  CAR;
                                  CAR;
                                  CDR };
                            GET;
                            IF_NONE { PUSH string "PROPOSAL_NOT_EXIST";
                                      FAILWITH }
                                    {  };
                            DIP { SWAP };
                            DUP 2;
                            DUP 2;
                            CAR;
                            CDR;
                            CDR;
                            SWAP;
                            CAR;
                            CDR;
                            CDR;
                            CAR;
                            INT;
                            ADD;
                            NOW;
                            COMPARE;
                            GE;
                            IF { PUSH bool True }
                               { PUSH bool False };
                            IF { DIG 4;
                                 DUP;
                                 CAR;
                                 DIP { CDR };
                                 SWAP;
                                 DUP;
                                 DUP 3;
                                 COMPARE;
                                 GE;
                                 IF { SWAP;
                                      PAIR;
                                      PUSH bool True }
                                    { SWAP;
                                      PUSH nat 1;
                                      ADD;
                                      PAIR;
                                      PUSH bool False };
                                 NOT;
                                 IF { DUG 4;
                                      DUP 2;
                                      DUP 2;
                                      DUP;
                                      CAR;
                                      CAR;
                                      DIP { CAR;
                                            CDR;
                                            CAR };
                                      ADD;
                                      SWAP;
                                      CAR;
                                      CDR;
                                      CDR;
                                      CDR;
                                      COMPARE;
                                      LE;
                                      IF { PUSH bool True }
                                         { PUSH bool False };
                                      DIP { DUP;
                                            CAR;
                                            CAR;
                                            DIP { DUP;
                                                  CAR;
                                                  CDR;
                                                  CAR };
                                            COMPARE;
                                            GT;
                                            IF { PUSH bool True }
                                               { PUSH bool False } };
                                      AND;
                                      IF { DUP;
                                           CDR;
                                           CDR;
                                           CAR;
                                           DIP { DUP;
                                                 CDR;
                                                 CAR;
                                                 CDR;
                                                 DIP { SWAP } };
                                           SWAP;
                                           DIP { SWAP };
                                           DUP 2;
                                           DUP 2;
                                           DIP { DUP;
                                                 CDR;
                                                 CDR;
                                                 CDR;
                                                 CDR };
                                           PAIR;
                                           DIP { CAR;
                                                 CAR;
                                                 CAR;
                                                 CAR };
                                           GET;
                                           IF_NONE { PUSH string "PROPOSER_NOT_EXIST_IN_LEDGER";
                                                     FAILWITH }
                                                   {  };
                                           DIG 3;
                                           DUP 2;
                                           DUP 2;
                                           COMPARE;
                                           GT;
                                           IF { DROP }
                                              { SWAP;
                                                DROP };
                                           DIG 2;
                                           DUP 3;
                                           DUP 3;
                                           DUP 3;
                                           CDR;
                                           CDR;
                                           CDR;
                                           CDR;
                                           PAIR;
                                           DIP { SWAP };
                                           SWAP;
                                           DIP { SWAP };
                                           DUP 10;
                                           DIP { DIP { PAIR };
                                                 PAIR };
                                           SWAP;
                                           EXEC;
                                           DUP;
                                           CDR;
                                           CDR;
                                           CDR;
                                           CAR;
                                           SWAP;
                                           DIP { PAIR;
                                                 SWAP };
                                           DUP 9;
                                           DIP { DIP { PAIR };
                                                 PAIR };
                                           SWAP;
                                           EXEC;
                                           SWAP;
                                           DUP;
                                           DIG 2;
                                           SWAP;
                                           CDR;
                                           CDR;
                                           CDR;
                                           ITER { DUP;
                                                  CAR;
                                                  CAR;
                                                  DIP { CDR };
                                                  DIG 2;
                                                  DUP 3;
                                                  DUP 3;
                                                  DUP 3;
                                                  CDR;
                                                  CDR;
                                                  CDR;
                                                  CDR;
                                                  PAIR;
                                                  DIP { SWAP };
                                                  SWAP;
                                                  DIP { SWAP };
                                                  DUP 10;
                                                  DIP { DIP { PAIR };
                                                        PAIR };
                                                  SWAP;
                                                  EXEC;
                                                  DUP;
                                                  CDR;
                                                  CDR;
                                                  CDR;
                                                  CAR;
                                                  SWAP;
                                                  DIP { PAIR;
                                                        SWAP };
                                                  DUP 9;
                                                  DIP { DIP { PAIR };
                                                        PAIR };
                                                  SWAP;
                                                  EXEC };
                                           SWAP;
                                           DUP;
                                           DIP { SWAP };
                                           CDR;
                                           CAR;
                                           CAR;
                                           CDR;
                                           NIL operation;
                                           PUSH bool False;
                                           DIG 2;
                                           ITER { IF_LEFT { DUP;
                                                            CDR;
                                                            CONTRACT unit;
                                                            IF_NONE { DROP 2;
                                                                      PUSH bool True }
                                                                    { SWAP;
                                                                      CAR;
                                                                      UNIT;
                                                                      TRANSFER_TOKENS;
                                                                      DIP { SWAP };
                                                                      CONS;
                                                                      SWAP } }
                                                          { DUP;
                                                            CAR;
                                                            CONTRACT %transfer (list (pair address (list (pair address (pair nat nat)))));
                                                            IF_NONE { DROP 2;
                                                                      PUSH bool True }
                                                                    { SWAP;
                                                                      CDR;
                                                                      PUSH mutez 0;
                                                                      SWAP;
                                                                      TRANSFER_TOKENS;
                                                                      DIP { SWAP };
                                                                      CONS;
                                                                      SWAP } } };
                                           IF { PUSH string "FAIL_DECISION_LAMBDA";
                                                FAILWITH }
                                              {  };
                                           DIG 4;
                                           ITER { CONS };
                                           SWAP;
                                           DIG 3;
                                           DIG 3;
                                           CAR;
                                           CDR;
                                           CDR;
                                           PAIR;
                                           DIP { DUP;
                                                 CDR;
                                                 CAR;
                                                 CDR;
                                                 CAR;
                                                 PUSH bool False };
                                           UPDATE;
                                           DIP { DUP;
                                                 DIP { CAR };
                                                 CDR;
                                                 DUP;
                                                 DIP { CDR };
                                                 CAR;
                                                 DUP;
                                                 DIP { CAR };
                                                 CDR;
                                                 DUP;
                                                 DIP { CDR };
                                                 CAR };
                                           SWAP;
                                           DROP;
                                           PAIR;
                                           SWAP;
                                           PAIR;
                                           PAIR;
                                           SWAP;
                                           PAIR }
                                         { DUP 2;
                                           DUP 2;
                                           CDR;
                                           CDR;
                                           CAR;
                                           SWAP;
                                           CDR;
                                           CAR;
                                           CAR;
                                           CAR;
                                           DUP;
                                           CAR;
                                           CDR;
                                           CDR;
                                           DIP { SWAP };
                                           MUL;
                                           SWAP;
                                           CDR;
                                           CAR;
                                           CAR;
                                           SWAP;
                                           EDIV;
                                           IF_NONE { PUSH nat 0 }
                                                   { CAR };
                                           DIP { DUP;
                                                 CDR;
                                                 CDR;
                                                 CAR;
                                                 DIP { DUP;
                                                       CDR;
                                                       CAR;
                                                       CDR;
                                                       DIP { SWAP } } };
                                           DUP 2;
                                           DUP 2;
                                           SWAP;
                                           SUB;
                                           ISNAT;
                                           IF_NONE { DIG 3;
                                                     DUP 3;
                                                     DUP 5 }
                                                   { DROP;
                                                     DIG 3;
                                                     DUP 2;
                                                     DUP 5 };
                                           DIP { DUP 2;
                                                 CDR;
                                                 CDR;
                                                 CDR;
                                                 CDR;
                                                 PAIR };
                                           DIG 2;
                                           DUP 11;
                                           DIP { DIP { PAIR };
                                                 PAIR };
                                           SWAP;
                                           EXEC;
                                           SWAP;
                                           DIP { SWAP;
                                                 DIP { SWAP } };
                                           SWAP;
                                           SUB;
                                           ISNAT;
                                           IF_NONE { PUSH nat 0 }
                                                   {  };
                                           SWAP;
                                           DIP { SWAP };
                                           DUP 2;
                                           DUP 2;
                                           DIP { DUP;
                                                 CDR;
                                                 CDR;
                                                 CDR;
                                                 CDR };
                                           PAIR;
                                           DIP { CAR;
                                                 CAR;
                                                 CAR;
                                                 CAR };
                                           GET;
                                           IF_NONE { PUSH string "PROPOSER_NOT_EXIST_IN_LEDGER";
                                                     FAILWITH }
                                                   {  };
                                           DIG 3;
                                           DUP 2;
                                           DUP 2;
                                           COMPARE;
                                           GT;
                                           IF { DROP }
                                              { SWAP;
                                                DROP };
                                           DIG 2;
                                           DUP 3;
                                           DUP 3;
                                           DUP 3;
                                           CDR;
                                           CDR;
                                           CDR;
                                           CDR;
                                           PAIR;
                                           DIP { SWAP };
                                           SWAP;
                                           DIP { SWAP };
                                           DUP 10;
                                           DIP { DIP { PAIR };
                                                 PAIR };
                                           SWAP;
                                           EXEC;
                                           DUP;
                                           CDR;
                                           CDR;
                                           CDR;
                                           CAR;
                                           SWAP;
                                           DIP { PAIR;
                                                 SWAP };
                                           DUP 9;
                                           DIP { DIP { PAIR };
                                                 PAIR };
                                           SWAP;
                                           EXEC;
                                           SWAP;
                                           DUP;
                                           DIG 2;
                                           SWAP;
                                           CDR;
                                           CDR;
                                           CDR;
                                           ITER { DUP;
                                                  CAR;
                                                  CAR;
                                                  DIP { CDR };
                                                  DIG 2;
                                                  DUP 3;
                                                  DUP 3;
                                                  DUP 3;
                                                  CDR;
                                                  CDR;
                                                  CDR;
                                                  CDR;
                                                  PAIR;
                                                  DIP { SWAP };
                                                  SWAP;
                                                  DIP { SWAP };
                                                  DUP 10;
                                                  DIP { DIP { PAIR };
                                                        PAIR };
                                                  SWAP;
                                                  EXEC;
                                                  DUP;
                                                  CDR;
                                                  CDR;
                                                  CDR;
                                                  CAR;
                                                  SWAP;
                                                  DIP { PAIR;
                                                        SWAP };
                                                  DUP 9;
                                                  DIP { DIP { PAIR };
                                                        PAIR };
                                                  SWAP;
                                                  EXEC };
                                           SWAP;
                                           DIP { SWAP };
                                           CAR;
                                           CDR;
                                           CDR;
                                           PAIR;
                                           DIP { DUP;
                                                 CDR;
                                                 CAR;
                                                 CDR;
                                                 CAR;
                                                 PUSH bool False };
                                           UPDATE;
                                           DIP { DUP;
                                                 DIP { CAR };
                                                 CDR;
                                                 DUP;
                                                 DIP { CDR };
                                                 CAR;
                                                 DUP;
                                                 DIP { CAR };
                                                 CDR;
                                                 DUP;
                                                 DIP { CDR };
                                                 CAR };
                                           SWAP;
                                           DROP;
                                           PAIR;
                                           SWAP;
                                           PAIR;
                                           PAIR;
                                           SWAP;
                                           PAIR } }
                                    { DUG 4;
                                      DROP;
                                      SWAP;
                                      DROP } }
                               { DROP;
                                 SWAP;
                                 DROP } };
                     DIP { SWAP;
                           DROP };
                     SWAP;
                     PAIR }
                   { DUP;
                     CAR;
                     DIP { CDR };
                     SWAP;
                     DIP { DROP;
                           CDR;
                           CAR;
                           CDR;
                           CDR };
                     SWAP;
                     EXEC;
                     PUSH string "VoidResult";
                     PAIR;
                     FAILWITH } } } }
{ IF_LEFT { IF_LEFT { IF_LEFT { DIP { DUP;
                           CAR;
                           CDR;
                           CAR;
                           CDR;
                           IF_LEFT { DROP }
                                   { IF_LEFT { DROP }
                                             { PUSH string "MIGRATED";
                                               PAIR;
                                               FAILWITH } };
                           DUP;
                           CAR;
                           CAR;
                           CDR;
                           CDR;
                           SENDER;
                           COMPARE;
                           EQ;
                           IF {  }
                              { PUSH string "NOT_ADMIN";
                                FAILWITH } };
                     LEFT address;
                     RIGHT unit;
                     DIP { DUP;
                           DIP { CDR };
                           CAR;
                           DUP;
                           DIP { CAR };
                           CDR;
                           DUP;
                           DIP { CDR };
                           CAR;
                           DUP;
                           DIP { CAR };
                           CDR };
                     SWAP;
                     DROP;
                     SWAP;
                     PAIR;
                     PAIR;
                     SWAP;
                     PAIR;
                     PAIR;
                     NIL operation;
                     PAIR }
                   { DIP { DUP;
                           CAR;
                           CDR;
                           CAR;
                           CDR;
                           IF_LEFT { DROP }
                                   { IF_LEFT { DROP }
                                             { PUSH string "MIGRATED";
                                               PAIR;
                                               FAILWITH } };
                           DUP;
                           CAR;
                           CAR;
                           CDR;
                           CDR;
                           SENDER;
                           COMPARE;
                           EQ;
                           IF {  }
                              { PUSH string "NOT_ADMIN";
                                FAILWITH } };
                     SWAP;
                     DIP { DUP;
                           CDR;
                           CAR;
                           DIP { DUP;
                                 CDR;
                                 CDR };
                           PAIR;
                           SWAP;
                           CAR };
                     DUP 5;
                     DIP { DIP { PAIR };
                           PAIR };
                     SWAP;
                     EXEC;
                     NIL operation;
                     PAIR } }
         { IF_LEFT { DUP 2;
                     DUP 2;
                     DUP;
                     CDR;
                     PACK;
                     SIZE;
                     DUP 3;
                     CDR;
                     CAR;
                     CAR;
                     CAR;
                     CDR;
                     CDR;
                     CDR;
                     DIP { DUP };
                     COMPARE;
                     GT;
                     IF { DUP 3;
                          CDR;
                          CAR;
                          CAR;
                          CAR;
                          DUP;
                          CAR;
                          CAR;
                          DIP { SWAP };
                          MUL;
                          SWAP;
                          CAR;
                          CDR;
                          CAR;
                          ADD;
                          DUP 2;
                          CAR;
                          SWAP;
                          COMPARE;
                          EQ;
                          IF { CDR;
                               CDR;
                               PUSH bool True;
                               SWAP;
                               ITER { IF_LEFT { CAR;
                                                DUP 3;
                                                CDR;
                                                CAR;
                                                CAR;
                                                CAR;
                                                DUP 2;
                                                DUP 2;
                                                CDR;
                                                CDR;
                                                CAR;
                                                COMPARE;
                                                GE;
                                                IF { CDR;
                                                     CAR;
                                                     CDR;
                                                     COMPARE;
                                                     LE;
                                                     IF {  }
                                                        { DROP;
                                                          PUSH bool False } }
                                                   { DROP 3;
                                                     PUSH bool False } }
                                              { DROP } };
                               SWAP;
                               DROP }
                             { DROP 2;
                               PUSH bool False } }
                        { DROP 3;
                          PUSH bool False };
                     IF {  }
                        { PUSH string "FAIL_PROPOSAL_CHECK";
                          FAILWITH };
                     DUP 2;
                     CDR;
                     CAR;
                     CDR;
                     CAR;
                     SIZE;
                     PUSH nat 500;
                     COMPARE;
                     LE;
                     IF { PUSH string "MAX_PROPOSALS_REACHED";
                          FAILWITH }
                        {  };
                     DUP 2;
                     DUP;
                     CDR;
                     CDR;
                     CDR;
                     CAR;
                     SENDER;
                     PAIR;
                     DIP { CAR;
                           CAR;
                           CAR;
                           CAR };
                     GET;
                     IF_NONE { DUP;
                               CAR;
                               DIP { PUSH nat 0 };
                               PAIR;
                               PUSH string "FA2_INSUFFICIENT_BALANCE";
                               PAIR;
                               FAILWITH }
                             {  };
                     DUP 2;
                     CAR;
                     COMPARE;
                     GT;
                     IF { PUSH string "PROPOSAL_INSUFFICIENT_BALANCE";
                          FAILWITH }
                        {  };
                     DUP;
                     CAR;
                     DIP { SWAP };
                     SENDER;
                     SWAP;
                     DIG 2;
                     DUP 3;
                     DUP 3;
                     DUP 3;
                     CDR;
                     CDR;
                     CDR;
                     CAR;
                     PAIR;
                     DIP { SWAP };
                     SWAP;
                     DIP { SWAP };
                     DUP 7;
                     DIP { DIP { PAIR };
                           PAIR };
                     SWAP;
                     EXEC;
                     DUP;
                     CDR;
                     CDR;
                     CDR;
                     CDR;
                     SWAP;
                     DIP { PAIR;
                           SWAP };
                     DUP 6;
                     DIP { DIP { PAIR };
                           PAIR };
                     SWAP;
                     EXEC;
                     SWAP;
                     DUP 2;
                     DUP 2;
                     SENDER;
                     SWAP;
                     PAIR;
                     PACK;
                     BLAKE2B;
                     DIP { CDR;
                           CAR;
                           CAR;
                           CDR };
                     MEM;
                     IF { PUSH string "PROPOSAL_NOT_UNIQUE";
                          FAILWITH }
                        {  };
                     NOW;
                     PAIR;
                     DUP;
                     CAR;
                     PUSH nat 0;
                     PAIR;
                     PUSH nat 0;
                     PAIR;
                     DIP { DUP;
                           CDR;
                           CDR;
                           DIP { SENDER };
                           PAIR;
                           DIP { DUP;
                                 CDR;
                                 CAR;
                                 DIP { PUSH (list (pair (pair nat bool) address)) { } };
                                 PAIR };
                           PAIR };
                     PAIR;
                     DIP { SWAP };
                     SOME;
                     DUP 3;
                     CDR;
                     SENDER;
                     SWAP;
                     PAIR;
                     PACK;
                     BLAKE2B;
                     DUP;
                     DIP { DIP { DIP { DUP;
                                       CDR;
                                       CAR;
                                       CAR;
                                       CDR } };
                           UPDATE;
                           DIP { DUP;
                                 DIP { CAR };
                                 CDR;
                                 DUP;
                                 DIP { CDR };
                                 CAR;
                                 DUP;
                                 DIP { CDR };
                                 CAR;
                                 DUP;
                                 DIP { CAR };
                                 CDR };
                           SWAP;
                           DROP;
                           SWAP;
                           PAIR;
                           PAIR;
                           PAIR;
                           SWAP;
                           PAIR;
                           DUP;
                           CDR;
                           CAR;
                           CDR;
                           CAR };
                     DUP 4;
                     CAR;
                     PAIR;
                     PUSH bool True;
                     SWAP;
                     UPDATE;
                     DIP { DUP;
                           DIP { CAR };
                           CDR;
                           DUP;
                           DIP { CDR };
                           CAR;
                           DUP;
                           DIP { CAR };
                           CDR;
                           DUP;
                           DIP { CDR };
                           CAR };
                     SWAP;
                     DROP;
                     PAIR;
                     SWAP;
                     PAIR;
                     PAIR;
                     SWAP;
                     PAIR;
                     SWAP;
                     CDR;
                     DROP;
                     NIL operation;
                     PAIR }
                   { DIP { DUP;
                           CAR;
                           CDR;
                           CAR;
                           CDR;
                           IF_LEFT { DROP }
                                   { IF_LEFT { DROP }
                                             { PUSH string "MIGRATED";
                                               PAIR;
                                               FAILWITH } };
                           DUP;
                           CAR;
                           CAR;
                           CDR;
                           CDR;
                           SENDER;
                           COMPARE;
                           EQ;
                           IF {  }
                              { PUSH string "NOT_ADMIN";
                                FAILWITH } };
                     DUP;
                     PUSH nat 1000;
                     COMPARE;
                     LT;
                     IF { PUSH string "OUT_OF_BOUND_QUORUM_THRESHOLD";
                          FAILWITH }
                        { DUP;
                          PUSH nat 1;
                          COMPARE;
                          GT;
                          IF { PUSH string "OUT_OF_BOUND_QUORUM_THRESHOLD";
                               FAILWITH }
                             { DIP { DUP;
                                     DIP { CDR };
                                     CAR;
                                     DUP;
                                     DIP { CAR };
                                     CDR;
                                     DUP;
                                     DIP { CAR };
                                     CDR;
                                     DUP;
                                     DIP { CAR };
                                     CDR };
                               SWAP;
                               DROP;
                               SWAP;
                               PAIR;
                               SWAP;
                               PAIR;
                               SWAP;
                               PAIR;
                               PAIR;
                               NIL operation;
                               PAIR } } } } }
{ IF_LEFT { IF_LEFT { DIP { DUP;
                           CAR;
                           CDR;
                           CAR;
                           CDR;
                           IF_LEFT { DROP }
                                   { IF_LEFT { DROP }
                                             { PUSH string "MIGRATED";
                                               PAIR;
                                               FAILWITH } };
                           DUP;
                           CAR;
                           CAR;
                           CDR;
                           CDR;
                           SENDER;
                           COMPARE;
                           EQ;
                           IF {  }
                              { PUSH string "NOT_ADMIN";
                                FAILWITH } };
                     DUP;
                     PUSH nat 2592000;
                     COMPARE;
                     LT;
                     IF { PUSH string "OUT_OF_BOUND_VOTING_PERIOD";
                          FAILWITH }
                        { DUP;
                          PUSH nat 1;
                          COMPARE;
                          GT;
                          IF { PUSH string "OUT_OF_BOUND_VOTING_PERIOD";
                               FAILWITH }
                             { DIP { DUP;
                                     DIP { CDR };
                                     CAR;
                                     DUP;
                                     DIP { CAR };
                                     CDR;
                                     DUP;
                                     DIP { CAR };
                                     CDR;
                                     DUP;
                                     DIP { CDR };
                                     CAR };
                               SWAP;
                               DROP;
                               PAIR;
                               SWAP;
                               PAIR;
                               SWAP;
                               PAIR;
                               PAIR;
                               NIL operation;
                               PAIR } } }
                   { DIP { DUP;
                           CAR;
                           CAR;
                           CDR;
                           CDR;
                           SENDER;
                           COMPARE;
                           EQ;
                           IF {  }
                              { PUSH string "NOT_ADMIN";
                                FAILWITH } };
                     DUP;
                     CDR;
                     DIP { CAR;
                           CONTRACT %transfer (list (pair address (list (pair address (pair nat nat)))));
                           IF_NONE { PUSH string "FAIL_TRANSFER_CONTRACT_TOKENS";
                                     FAILWITH }
                                   {  };
                           PUSH mutez 0 };
                     TRANSFER_TOKENS;
                     NIL operation;
                     SWAP;
                     CONS;
                     PAIR } }
         { IF_LEFT { DIP { DUP;
                           CAR;
                           CDR;
                           CAR;
                           CDR;
                           IF_LEFT { DROP }
                                   { IF_LEFT { DROP }
                                             { PUSH string "MIGRATED";
                                               PAIR;
                                               FAILWITH } };
                           DUP;
                           CAR;
                           CAR;
                           CDR;
                           CDR;
                           SENDER;
                           COMPARE;
                           EQ;
                           IF {  }
                              { PUSH string "NOT_ADMIN";
                                FAILWITH };
                           DUP;
                           DIP { CDR };
                           CAR;
                           DUP;
                           DIP { CAR };
                           CDR;
                           DUP;
                           DIP { CDR };
                           CAR;
                           DUP;
                           DIP { CDR };
                           CAR };
                     SWAP;
                     DROP;
                     PAIR;
                     PAIR;
                     SWAP;
                     PAIR;
                     PAIR;
                     NIL operation;
                     PAIR }
                   { IF_LEFT { DIP { DUP;
                                     CAR;
                                     CDR;
                                     CAR;
                                     CDR;
                                     IF_LEFT { DROP }
                                             { IF_LEFT { DROP }
                                                       { PUSH string "MIGRATED";
                                                         PAIR;
                                                         FAILWITH } } };
                               ITER { DUP;
                                      CDR;
                                      DIP { CAR };
                                      IF_NONE { DIP { SENDER } }
                                              { DUP 2;
                                                DIP { DIP { CHAIN_ID;
                                                            DIP { SELF_ADDRESS };
                                                            PAIR;
                                                            DIP { DIP { DUP;
                                                                        CDR;
                                                                        CAR;
                                                                        CDR;
                                                                        CDR;
                                                                        DUP;
                                                                        DIP { PUSH nat 1;
                                                                              ADD;
                                                                              DIP { DUP;
                                                                                    DIP { CAR };
                                                                                    CDR;
                                                                                    DUP;
                                                                                    DIP { CDR };
                                                                                    CAR;
                                                                                    DUP;
                                                                                    DIP { CAR };
                                                                                    CDR;
                                                                                    DUP;
                                                                                    DIP { CAR };
                                                                                    CDR };
                                                                              SWAP;
                                                                              DROP;
                                                                              SWAP;
                                                                              PAIR;
                                                                              SWAP;
                                                                              PAIR;
                                                                              PAIR;
                                                                              SWAP;
                                                                              PAIR } };
                                                                  SWAP;
                                                                  DIP { DUP };
                                                                  PAIR };
                                                            PAIR;
                                                            SWAP;
                                                            DROP;
                                                            PACK };
                                                      DUP 2;
                                                      DUP 2;
                                                      DUP;
                                                      CAR;
                                                      DIP { CDR };
                                                      CHECK_SIGNATURE;
                                                      IF { SWAP;
                                                           DROP;
                                                           CAR;
                                                           HASH_KEY;
                                                           IMPLICIT_ACCOUNT;
                                                           ADDRESS }
                                                         { DROP;
                                                           PUSH string "MISSIGNED";
                                                           PAIR;
                                                           FAILWITH } } };
                                      DIP { SWAP };
                                      DUP 2;
                                      DUP 2;
                                      CAR;
                                      DIP { CDR;
                                            CAR;
                                            CAR;
                                            CDR };
                                      GET;
                                      IF_NONE { PUSH string "PROPOSAL_NOT_EXIST";
                                                FAILWITH }
                                              {  };
                                      DUP 2;
                                      DUP 2;
                                      DUP;
                                      CAR;
                                      CAR;
                                      DIP { CAR;
                                            CDR;
                                            CAR };
                                      ADD;
                                      DIP { CDR;
                                            CDR };
                                      ADD;
                                      PUSH nat 1000;
                                      COMPARE;
                                      LT;
                                      IF { PUSH string "MAX_VOTES_REACHED";
                                           FAILWITH }
                                         {  };
                                      DUP 3;
                                      SWAP;
                                      CAR;
                                      CDR;
                                      CDR;
                                      SWAP;
                                      CAR;
                                      CDR;
                                      CDR;
                                      CAR;
                                      INT;
                                      ADD;
                                      NOW;
                                      COMPARE;
                                      GE;
                                      IF { PUSH string "VOTING_PERIOD_OVER";
                                           FAILWITH }
                                         {  };
                                      DUP 2;
                                      DUP;
                                      CDR;
                                      CDR;
                                      CDR;
                                      CAR;
                                      DUP 5;
                                      PAIR;
                                      DIP { CAR;
                                            CAR;
                                            CAR;
                                            CAR };
                                      GET;
                                      IF_NONE { DUP;
                                                CDR;
                                                CDR;
                                                DIP { PUSH nat 0 };
                                                PAIR;
                                                PUSH string "FA2_INSUFFICIENT_BALANCE";
                                                PAIR;
                                                FAILWITH }
                                              {  };
                                      DUP 2;
                                      CDR;
                                      CDR;
                                      COMPARE;
                                      GT;
                                      IF { PUSH string "VOTING_INSUFFICIENT_BALANCE";
                                           FAILWITH }
                                         {  };
                                      DUP 2;
                                      DUP 2;
                                      CAR;
                                      DIP { CDR;
                                            CAR;
                                            CAR;
                                            CDR };
                                      GET;
                                      IF_NONE { PUSH string "PROPOSAL_NOT_EXIST";
                                                FAILWITH }
                                              {  };
                                      DIG 2;
                                      DUP 3;
                                      CDR;
                                      CDR;
                                      DUP 5;
                                      SWAP;
                                      DIG 2;
                                      DUP 3;
                                      DUP 3;
                                      DUP 3;
                                      CDR;
                                      CDR;
                                      CDR;
                                      CAR;
                                      PAIR;
                                      DIP { SWAP };
                                      SWAP;
                                      DIP { SWAP };
                                      DUP 9;
                                      DIP { DIP { PAIR };
                                            PAIR };
                                      SWAP;
                                      EXEC;
                                      DUP;
                                      CDR;
                                      CDR;
                                      CDR;
                                      CDR;
                                      SWAP;
                                      DIP { PAIR;
                                            SWAP };
                                      DUP 8;
                                      DIP { DIP { PAIR };
                                            PAIR };
                                      SWAP;
                                      EXEC;
                                      DIG 2;
                                      DIG 2;
                                      DUP 2;
                                      DUP;
                                      DIP { CDR;
                                            CDR };
                                      CDR;
                                      CAR;
                                      IF { DIP { DUP;
                                                 CAR;
                                                 CAR };
                                           ADD;
                                           DIP { DUP;
                                                 DIP { CDR };
                                                 CAR;
                                                 DUP;
                                                 DIP { CDR };
                                                 CAR };
                                           SWAP;
                                           DROP;
                                           PAIR;
                                           PAIR }
                                         { DIP { DUP;
                                                 CAR;
                                                 CDR;
                                                 CAR };
                                           ADD;
                                           DIP { DUP;
                                                 DIP { CDR };
                                                 CAR;
                                                 DUP;
                                                 DIP { CAR };
                                                 CDR;
                                                 DUP;
                                                 DIP { CDR };
                                                 CAR };
                                           SWAP;
                                           DROP;
                                           PAIR;
                                           SWAP;
                                           PAIR;
                                           PAIR };
                                      DUP 2;
                                      DUP;
                                      CDR;
                                      CDR;
                                      DIP { DUP;
                                            CDR;
                                            CAR };
                                      PAIR;
                                      DIP { DUP 5 };
                                      PAIR;
                                      DIP { DROP;
                                            DUP;
                                            CDR;
                                            CDR;
                                            CDR };
                                      CONS;
                                      DIP { DUP;
                                            DIP { CAR };
                                            CDR;
                                            DUP;
                                            DIP { CAR };
                                            CDR;
                                            DUP;
                                            DIP { CAR };
                                            CDR };
                                      SWAP;
                                      DROP;
                                      SWAP;
                                      PAIR;
                                      SWAP;
                                      PAIR;
                                      SWAP;
                                      PAIR;
                                      SWAP;
                                      CAR;
                                      DIP { DIP { DUP;
                                                  CDR;
                                                  CAR;
                                                  CAR;
                                                  CDR };
                                            SOME };
                                      UPDATE;
                                      DIP { DUP;
                                            DIP { CAR };
                                            CDR;
                                            DUP;
                                            DIP { CDR };
                                            CAR;
                                            DUP;
                                            DIP { CDR };
                                            CAR;
                                            DUP;
                                            DIP { CAR };
                                            CDR };
                                      SWAP;
                                      DROP;
                                      SWAP;
                                      PAIR;
                                      PAIR;
                                      PAIR;
                                      SWAP;
                                      PAIR;
                                      SWAP;
                                      DROP };
                               NIL operation;
                               PAIR }
                             { DUP;
                               CAR;
                               DIP { CDR };
                               SWAP;
                               DIP { DIP { CDR;
                                           CDR;
                                           CAR;
                                           CDR };
                                     GET;
                                     IF_NONE { UNIT;
                                               PUSH string "FA2_TOKEN_UNDEFINED";
                                               PAIR;
                                               FAILWITH }
                                             {  } };
                               SWAP;
                               EXEC;
                               PUSH string "VoidResult";
                               PAIR;
                               FAILWITH } } } } };
DIP { DROP 2 } };`;
