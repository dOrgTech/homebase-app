export const code = `parameter (or (or (or (or %call_FA2 (or (list %transfer (pair (address %from_)
(list %txs (pair 
                 (address %to_)
                 (pair 
                       (nat %token_id)
                       (nat %amount))))))
(pair %balance_of (list %requests (pair 
                  (address %owner)
                  (nat %token_id)))
(contract %callback (list (pair 
                            (pair %request 
                                           (address %owner)
                                           (nat %token_id))
                            (nat %balance))))))
(or 
(contract %token_metadata_registry address)
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
                                   (nat %token_id)))))))
(or (address :newOwner %transfer_ownership)
(unit %accept_ownership)))
(or (or (address :newAddress %migrate)
(unit %confirm_migration))
(or (pair %propose (nat %frozen_token)
(unit %proposal_metadata))
(list %vote (pair (bytes %proposal_key)
(pair (bool %vote_type)
(nat %vote_amount)))))))
(or (or (nat %set_voting_period)
(or (nat %set_quorum_threshold)
(unit %flush)))
(or (or (pair %burn (address %from_)
(pair (nat %token_id)
(nat %amount)))
(pair %mint (address %to_)
(pair (nat %token_id)
(nat %amount))))
(or (pair %transfer_contract_tokens 
(address %contract_address)
(list %params (pair 
                (address %from_)
                (list %txs (pair 
                                 (address %to_)
                                 (pair 
                                       (nat %token_id)
                                       (nat %amount)))))))
(contract %token_address address)))));
storage (pair (pair (pair (big_map %sLedger (pair address
nat)
nat)
(big_map %sOperators (pair (address :owner)
(address :operator))
unit))
(pair (address %sTokenAddress)
(pair (address %sAdmin)
(address %sPendingOwner))))
(pair (pair (or %sMigrationStatus (unit %notInMigration)
(or (address %migratingTo)
(address %migratedTo)))
(pair (nat %sVotingPeriod)
(nat %sQuorumThreshold)))
(pair (unit %sExtra)
(pair (big_map %sProposals bytes
(pair (pair (nat %upvotes)
   (pair 
         (nat %downvotes)
         (timestamp %start_date)))
(pair (pair 
         (unit %metadata)
         (address %proposer))
   (pair 
         (nat %proposer_frozen_token)
         (list %voters (pair 
                             address
                             nat))))))
(list %sProposalKeyListSortByDate bytes)))));
code { CAST (pair (or (or (or (or (or (list (pair address (list (pair address (pair nat nat))))) (pair (list (pair address nat)) (contract (list (pair (pair address nat) nat))))) (or (contract address) (list (or (pair address (pair address nat)) (pair address (pair address nat)))))) (or address unit)) (or (or address unit) (or (pair nat unit) (list (pair bytes (pair bool nat)))))) (or (or nat (or nat unit)) (or (or (pair address (pair nat nat)) (pair address (pair nat nat))) (or (pair address (list (pair address (list (pair address (pair nat nat)))))) (contract address))))) (pair (pair (pair (big_map (pair address nat) nat) (big_map (pair address address) unit)) (pair address (pair address address))) (pair (pair (or unit (or address address)) (pair nat nat)) (pair unit (pair (big_map bytes (pair (pair nat (pair nat timestamp)) (pair (pair unit address) (pair nat (list (pair address nat)))))) (list bytes))))));
AMOUNT;
PUSH mutez 0;
COMPARE;
EQ;
IF {  }
{ UNIT;
PUSH string "FORBIDDEN_XTZ";
PAIR;
FAILWITH };
DIP { PUSH (lambda (pair (pair (pair (pair (pair (big_map (pair address nat) nat) (big_map (pair address address) unit)) (pair address (pair address address))) (pair (pair (or unit (or address address)) (pair nat nat)) (pair unit (pair (big_map bytes (pair (pair nat (pair nat timestamp)) (pair (pair unit address) (pair nat (list (pair address nat)))))) (list bytes))))) address) (pair nat nat)) (pair (pair (pair (big_map (pair address nat) nat) (big_map (pair address address) unit)) (pair address (pair address address))) (pair (pair (or unit (or address address)) (pair nat nat)) (pair unit (pair (big_map bytes (pair (pair nat (pair nat timestamp)) (pair (pair unit address) (pair nat (list (pair address nat)))))) (list bytes)))))) { DUP; CAR; DIP { CDR }; DUP; CAR; DIP { CDR }; DIG 2; DUP; CAR; DIP { CDR }; DIG 3; PAIR; DIG 2; DUP; CAR; CAR; CAR; DIG 2; DIP { DUP }; SWAP; DIP { DUP }; SWAP; GET; IF_NONE { DIG 3;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              SOME;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              SWAP;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              UPDATE;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              DIP { DUP;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    DIP { CDR };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    CAR };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              DIP { DUP;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    DIP { CDR };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    CAR };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              DIP { DUP;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    DIP { CDR };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    CAR };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              DIP { DROP };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              PAIR;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              PAIR;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              PAIR }
{ DIG 4;
ADD;
SOME;
SWAP;
UPDATE;
DIP { DUP;
DIP { CDR };
CAR };
DIP { DUP;
DIP { CDR };
CAR };
DIP { DUP;
DIP { CDR };
CAR };
DIP { DROP };
PAIR;
PAIR;
PAIR } };
PUSH (lambda (pair (pair (pair (pair (pair (big_map (pair address nat) nat) (big_map (pair address address) unit)) (pair address (pair address address))) (pair (pair (or unit (or address address)) (pair nat nat)) (pair unit (pair (big_map bytes (pair (pair nat (pair nat timestamp)) (pair (pair unit address) (pair nat (list (pair address nat)))))) (list bytes))))) address) (pair nat nat)) (pair (pair (pair (big_map (pair address nat) nat) (big_map (pair address address) unit)) (pair address (pair address address))) (pair (pair (or unit (or address address)) (pair nat nat)) (pair unit (pair (big_map bytes (pair (pair nat (pair nat timestamp)) (pair (pair unit address) (pair nat (list (pair address nat)))))) (list bytes)))))) { DUP; CAR; DIP { CDR }; DUP; CAR; DIP { CDR }; DIG 2; DUP; CAR; DIP { CDR }; DIG 3; PAIR; DIG 2; DUP; CAR; CAR; CAR; DIG 2; DIP { DUP }; SWAP; DIP { DUP }; SWAP; GET; IF_NONE { DROP 2;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              SWAP;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              PUSH nat 0;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              DIP { DUP };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              SWAP;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              DIP { DUP };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              SWAP;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              COMPARE;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              LT;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              IF { SWAP;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   PAIR;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   PUSH string "FA2_INSUFFICIENT_BALANCE";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   PAIR;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   FAILWITH }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 { DROP 2 } }
{ DIG 4;
DIP { DUP };
SWAP;
DIP { DUP };
SWAP;
SWAP;
SUB;
ISNAT;
IF_NONE { SWAP;
SWAP;
PAIR;
PUSH string "FA2_INSUFFICIENT_BALANCE";
PAIR;
FAILWITH }
{ SOME;
SWAP;
DROP;
SWAP;
DROP;
SWAP;
UPDATE;
DIP { DUP;
DIP { CDR };
CAR };
DIP { DUP;
DIP { CDR };
CAR };
DIP { DUP;
DIP { CDR };
CAR };
DIP { DROP };
PAIR;
PAIR;
PAIR } } } };
DUP;
CAR;
DIP { CDR };
IF_LEFT { IF_LEFT { IF_LEFT { IF_LEFT { IF_LEFT { DIP { DUP;
 CDR;
 CAR;
 CAR;
 IF_LEFT { DROP }
         { IF_LEFT { DROP }
                   { PUSH string "MIGRATED";
                     PAIR;
                     FAILWITH } } };
ITER { SWAP;
  DUP;
  CAR;
  CDR;
  CDR;
  CAR;
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
         INT;
         EQ;
         IF {  }
            { DUP;
              PUSH nat 1;
              COMPARE;
              EQ;
              IF { DIG 5;
                   DUP;
                   IF { DUG 5 }
                      { UNIT;
                        PUSH string "FROZEN_TOKEN_NOT_TRANSFERABLE";
                        PAIR;
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
         DIP 7
             { DUP };
         DIG 7;
         DIP { PAIR;
               PAIR };
         SWAP;
         EXEC;
         DIP 6
             { DUP };
         DIG 6;
         DIP { PAIR;
               PAIR };
         SWAP;
         EXEC;
         DUG 2;
         SWAP };
  DROP 2 };
NIL operation;
PAIR }
{ DIP { DUP;
 CDR;
 CAR;
 CAR;
 IF_LEFT { DROP }
         { IF_LEFT { DROP }
                   { PUSH string "MIGRATED";
                     PAIR;
                     FAILWITH } } };
DUP;
CAR;
DIP { CDR;
 DIP { DUP };
 SWAP };
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
  INT;
  EQ;
  IF {  }
     { DUP;
       PUSH nat 1;
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
PAIR } }
{ IF_LEFT { DIP { DUP;
 CDR;
 CAR;
 CAR;
 IF_LEFT { DROP }
         { IF_LEFT { DROP }
                   { PUSH string "MIGRATED";
                     PAIR;
                     FAILWITH } } };
SWAP;
DUP;
CAR;
CDR;
CAR;
DIG 2;
SWAP;
PUSH mutez 0;
SWAP;
TRANSFER_TOKENS;
NIL operation;
SWAP;
CONS;
PAIR }
{ DIP { DUP;
 CDR;
 CAR;
 CAR;
 IF_LEFT { DROP }
         { IF_LEFT { DROP }
                   { PUSH string "MIGRATED";
                     PAIR;
                     FAILWITH } } };
ITER { IF_LEFT { DUP;
            CDR;
            CDR;
            DIP { DUP;
                  CDR;
                  CAR;
                  DIP { CAR } };
            DUP;
            INT;
            EQ;
            IF { DROP }
               { DUP;
                 PUSH nat 1;
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
               { UNIT;
                 PUSH string "NOT_OWNER";
                 PAIR;
                 FAILWITH };
            PAIR;
            SWAP;
            DUP;
            CAR;
            CAR;
            CDR;
            DIG 2;
            DIP { DUP };
            SWAP;
            DIP { DUP };
            SWAP;
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
                       DIP { CAR };
                       CDR };
                 SWAP;
                 DROP;
                 SWAP;
                 PAIR;
                 PAIR;
                 PAIR } }
          { DUP;
            CDR;
            CDR;
            DIP { DUP;
                  CDR;
                  CAR;
                  DIP { CAR } };
            DUP;
            INT;
            EQ;
            IF { DROP }
               { DUP;
                 PUSH nat 1;
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
               { UNIT;
                 PUSH string "NOT_OWNER";
                 PAIR;
                 FAILWITH };
            PAIR;
            SWAP;
            DUP;
            CAR;
            CAR;
            CDR;
            DIG 2;
            DIP { DUP };
            SWAP;
            DIP { DUP };
            SWAP;
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
                       DIP { CAR };
                       CDR };
                 SWAP;
                 DROP;
                 SWAP;
                 PAIR;
                 PAIR;
                 PAIR }
               { DROP 2 } } };
NIL operation;
PAIR } } }
{ IF_LEFT { DIP { DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP }
{ IF_LEFT { DROP }
         { PUSH string "MIGRATED";
           PAIR;
           FAILWITH } };
DUP;
CAR;
CDR;
CDR;
CAR;
SENDER;
COMPARE;
EQ;
IF {  }
{ UNIT;
PUSH string "NOT_ADMIN";
PAIR;
FAILWITH };
DUP;
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
PAIR }
{ DROP;
DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP }
{ IF_LEFT { DROP }
   { PUSH string "MIGRATED";
     PAIR;
     FAILWITH } };
DUP;
CAR;
CDR;
CDR;
CDR;
SENDER;
COMPARE;
EQ;
IF {  }
{ UNIT;
PUSH string "NOT_PENDING_ADMIN";
PAIR;
FAILWITH };
DUP;
CAR;
CDR;
CDR;
CDR;
DIP { DUP;
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
{ IF_LEFT { IF_LEFT { DIP { DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP }
{ IF_LEFT { DROP }
         { PUSH string "MIGRATED";
           PAIR;
           FAILWITH } };
DUP;
CAR;
CDR;
CDR;
CAR;
SENDER;
COMPARE;
EQ;
IF {  }
{ UNIT;
PUSH string "NOT_ADMIN";
PAIR;
FAILWITH } };
LEFT address;
RIGHT unit;
DIP { DUP;
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
NIL operation;
PAIR }
{ DROP;
DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP;
UNIT;
PUSH string "NOT_MIGRATING";
PAIR;
FAILWITH }
{ IF_LEFT { DUP;
     SENDER;
     COMPARE;
     EQ;
     IF {  }
        { UNIT;
          PUSH string "NOT_MIGRATION_TARGET";
          PAIR;
          FAILWITH };
     RIGHT address;
     RIGHT unit;
     DIP { DUP;
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
     PAIR }
   { PUSH string "MIGRATED";
     PAIR;
     FAILWITH } };
NIL operation;
PAIR } }
{ IF_LEFT { DIP { DUP };
SWAP;
CDR;
CDR;
CDR;
CDR;
SIZE;
PUSH nat 500;
COMPARE;
LE;
IF { UNIT;
PUSH string "MAX_PROPOSALS_REACHED";
PAIR;
FAILWITH }
{  };
DIP { DUP };
SWAP;
PUSH nat 0;
SENDER;
PAIR;
DIP { CAR;
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
DIP { DUP };
SWAP;
CAR;
COMPARE;
GT;
IF { UNIT;
PUSH string "PROPOSAL_INSUFFICIENT_BALANCE";
PAIR;
FAILWITH }
{  };
DUP;
CAR;
DIP { SWAP };
SENDER;
SWAP;
DIG 2;
DIP 2
{ DUP };
DIG 2;
DIP 2
{ DUP };
DIG 2;
PUSH nat 0;
PAIR;
DIP { SWAP };
SWAP;
DIP { SWAP };
DIP 6
{ DUP };
DIG 6;
DIP { PAIR;
PAIR };
SWAP;
EXEC;
DIP { PUSH nat 1;
PAIR;
SWAP };
DIP 5
{ DUP };
DIG 5;
DIP { PAIR;
PAIR };
SWAP;
EXEC;
SWAP;
DIP { DUP };
SWAP;
DIP { DUP };
SWAP;
SENDER;
SWAP;
PAIR;
PACK;
BLAKE2B;
SWAP;
CDR;
CDR;
CDR;
CDR;
ITER { DIP { DUP };
COMPARE;
EQ;
IF { UNIT;
PUSH string "PROPOSAL_NOT_UNIQUE";
PAIR;
FAILWITH }
{  } };
DROP;
NOW;
PUSH nat 0;
PAIR;
PUSH nat 0;
PAIR;
DIP { DUP;
CDR;
DIP { SENDER };
PAIR;
DIP { DUP;
CAR;
DIP { PUSH (list (pair address nat)) { } };
PAIR };
PAIR };
PAIR;
DIP { SWAP };
SOME;
DIP 2
{ DUP };
DIG 2;
SENDER;
SWAP;
PAIR;
PACK;
BLAKE2B;
DIP { DIP { DUP;
CDR;
CDR;
CDR;
CAR } };
UPDATE;
DIP { DUP;
DIP { CAR };
CDR;
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
SWAP;
PAIR;
DUP;
CDR;
CDR;
CDR;
CDR;
DIP 2
{ DUP };
DIG 2;
SENDER;
SWAP;
PAIR;
PACK;
BLAKE2B;
CONS;
DIP { DUP;
DIP { CAR };
CDR;
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
SWAP;
PAIR;
SWAP;
DROP;
NIL operation;
PAIR }
{ DIP { DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP }
{ IF_LEFT { DROP }
         { PUSH string "MIGRATED";
           PAIR;
           FAILWITH } } };
ITER { DIP { DUP };
SWAP;
DIP { DUP };
SWAP;
CAR;
DIP { CDR;
CDR;
CDR;
CAR };
GET;
IF_NONE { UNIT;
  PUSH string "PROPOSAL_NOT_EXIST";
  PAIR;
  FAILWITH }
{  };
DIP { DUP };
SWAP;
DIP { DUP };
SWAP;
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
IF { UNIT;
PUSH string "MAX_VOTES_REACHED";
PAIR;
FAILWITH }
{  };
DIP 2
{ DUP };
DIG 2;
SWAP;
CAR;
CDR;
CDR;
SWAP;
CDR;
CAR;
CDR;
CAR;
INT;
ADD;
NOW;
COMPARE;
GE;
IF { UNIT;
PUSH string "VOTING_PERIOD_OVER";
PAIR;
FAILWITH }
{  };
DIP { DUP };
SWAP;
PUSH nat 0;
SENDER;
PAIR;
DIP { CAR;
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
DIP { DUP };
SWAP;
CDR;
CDR;
COMPARE;
GT;
IF { UNIT;
PUSH string "VOTING_INSUFFICIENT_BALANCE";
PAIR;
FAILWITH }
{  };
DIP { DUP };
SWAP;
DIP { DUP };
SWAP;
CAR;
DIP { CDR;
CDR;
CDR;
CAR };
GET;
IF_NONE { UNIT;
  PUSH string "PROPOSAL_NOT_EXIST";
  PAIR;
  FAILWITH }
{  };
DIG 2;
DIP 2
{ DUP };
DIG 2;
CDR;
CDR;
SENDER;
SWAP;
DIG 2;
DIP 2
{ DUP };
DIG 2;
DIP 2
{ DUP };
DIG 2;
PUSH nat 0;
PAIR;
DIP { SWAP };
SWAP;
DIP { SWAP };
DIP 7
{ DUP };
DIG 7;
DIP { PAIR;
PAIR };
SWAP;
EXEC;
DIP { PUSH nat 1;
PAIR;
SWAP };
DIP 6
{ DUP };
DIG 6;
DIP { PAIR;
PAIR };
SWAP;
EXEC;
DIG 2;
DIG 2;
DIP { DUP };
SWAP;
CDR;
CAR;
IF { DIP { DUP };
SWAP;
CDR;
CDR;
DIP { DUP };
SWAP;
CAR;
CAR;
ADD }
{ DUP;
CAR;
CAR };
DIP { DIP { DUP };
SWAP;
CDR;
CAR;
IF { DUP;
   CAR;
   CDR;
   CAR }
 { DIP { DUP };
   SWAP;
   CDR;
   CDR;
   DIP { DUP };
   SWAP;
   CAR;
   CDR;
   CAR;
   ADD };
DIP { DUP;
    CAR;
    CDR;
    CDR };
PAIR };
PAIR;
DIP { DUP;
CDR;
CAR;
CAR;
DIP { DUP;
    CDR;
    CAR;
    CDR };
PAIR;
DIP { DUP;
    CDR;
    CDR;
    CAR;
    DIP { DIP { DUP };
          SWAP;
          CDR;
          CDR;
          SENDER;
          PAIR;
          DIP { DUP;
                CDR;
                CDR;
                CDR };
          CONS };
    PAIR };
PAIR };
PAIR;
SWAP;
DROP;
SOME;
SWAP;
CAR;
DIP { DIP { DUP;
    CDR;
    CDR;
    CDR;
    CAR } };
UPDATE;
DIP { DUP;
DIP { CAR };
CDR;
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
SWAP;
PAIR };
NIL operation;
PAIR } } } }
{ IF_LEFT { IF_LEFT { DIP { DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP }
{ IF_LEFT { DROP }
{ PUSH string "MIGRATED";
 PAIR;
 FAILWITH } };
DUP;
CAR;
CDR;
CDR;
CAR;
SENDER;
COMPARE;
EQ;
IF {  }
{ UNIT;
PUSH string "NOT_ADMIN";
PAIR;
FAILWITH } };
DUP;
PUSH nat 2592000;
COMPARE;
LT;
IF { UNIT;
PUSH string "OUT_OF_BOUND_VOTING_PERIOD";
PAIR;
FAILWITH }
{ DUP;
PUSH nat 1;
COMPARE;
GT;
IF { UNIT;
PUSH string "OUT_OF_BOUND_VOTING_PERIOD";
PAIR;
FAILWITH }
{ DIP { DUP;
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
NIL operation;
PAIR } } }
{ IF_LEFT { DIP { DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP }
{ IF_LEFT { DROP }
         { PUSH string "MIGRATED";
           PAIR;
           FAILWITH } };
DUP;
CAR;
CDR;
CDR;
CAR;
SENDER;
COMPARE;
EQ;
IF {  }
{ UNIT;
PUSH string "NOT_ADMIN";
PAIR;
FAILWITH } };
DUP;
PUSH nat 1000;
COMPARE;
LT;
IF { UNIT;
PUSH string "OUT_OF_BOUND_QUORUM_THRESHOLD";
PAIR;
FAILWITH }
{ DUP;
PUSH nat 1;
COMPARE;
GT;
IF { UNIT;
PUSH string "OUT_OF_BOUND_QUORUM_THRESHOLD";
PAIR;
FAILWITH }
{ DIP { DUP;
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
PAIR;
NIL operation;
PAIR } } }
{ DROP;
DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP }
{ IF_LEFT { DROP }
   { PUSH string "MIGRATED";
     PAIR;
     FAILWITH } };
DUP;
CAR;
CDR;
CDR;
CAR;
SENDER;
COMPARE;
EQ;
IF {  }
{ UNIT;
PUSH string "NOT_ADMIN";
PAIR;
FAILWITH };
DUP;
CDR;
CDR;
CDR;
CDR;
MAP
{ DIP { DUP };
SWAP;
DIP { DUP };
SWAP;
DIP { CDR;
CDR;
CDR;
CAR };
GET;
IF_NONE { UNIT;
 PUSH string "PROPOSAL_NOT_EXIST";
 PAIR;
 FAILWITH }
{  };
DUP;
DIP { SWAP;
DIP { SWAP } };
CAR;
CDR;
CDR;
DIP 2
{ DUP };
DIG 2;
CDR;
CAR;
CDR;
CAR;
INT;
ADD;
NOW;
COMPARE;
GE;
IF { PUSH bool True }
{ PUSH bool False };
DIP { DIP { SWAP } };
PAIR;
PAIR };
SWAP;
DUP;
DIP { CAR };
CDR;
DUP;
DIP { CAR };
CDR;
DUP;
DIP { CAR };
CDR;
DUP;
DIP { CAR };
CDR;
PUSH (list bytes) { };
SWAP;
DROP;
SWAP;
PAIR;
SWAP;
PAIR;
SWAP;
PAIR;
SWAP;
PAIR;
SWAP;
NIL operation;
SWAP;
DIP { SWAP };
ITER { DUP;
CAR;
DIP { CDR };
DUP;
CAR;
DIP { CDR };
IF { SWAP;
DIP { SWAP };
DUP;
CAR;
CAR;
DIP { DUP;
   CAR;
   CDR;
   CAR };
ADD;
DIP 2
 { DUP };
DIG 2;
CDR;
CAR;
CDR;
CDR;
COMPARE;
LE;
IF { DUP;
  CAR;
  CAR;
  DIP { DUP;
        CAR;
        CDR;
        CAR };
  COMPARE;
  GT;
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
       DIP { SWAP;
             DUP };
       SWAP;
       DIP { DUP };
       SWAP;
       PUSH nat 1;
       SWAP;
       PAIR;
       DIP { CAR;
             CAR;
             CAR };
       GET;
       IF_NONE { UNIT;
                 PUSH string "PROPOSER_NOT_EXIST_IN_LEDGER";
                 PAIR;
                 FAILWITH }
               {  };
       DIG 3;
       DIP { DUP };
       SWAP;
       DIP { DUP };
       SWAP;
       COMPARE;
       GT;
       IF { DROP }
          { SWAP;
            DROP };
       DIG 2;
       DIP 2
           { DUP };
       DIG 2;
       DIP 2
           { DUP };
       DIG 2;
       PUSH nat 1;
       PAIR;
       DIP { SWAP };
       SWAP;
       DIP { SWAP };
       DIP 8
           { DUP };
       DIG 8;
       DIP { PAIR;
             PAIR };
       SWAP;
       EXEC;
       DIP { PUSH nat 0;
             PAIR;
             SWAP };
       DIP 7
           { DUP };
       DIG 7;
       DIP { PAIR;
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
              DIP { CDR };
              SWAP;
              DIG 2;
              DIP 2
                  { DUP };
              DIG 2;
              DIP 2
                  { DUP };
              DIG 2;
              PUSH nat 1;
              PAIR;
              DIP { SWAP };
              SWAP;
              DIP { SWAP };
              DIP 8
                  { DUP };
              DIG 8;
              DIP { PAIR;
                    PAIR };
              SWAP;
              EXEC;
              DIP { PUSH nat 0;
                    PAIR;
                    SWAP };
              DIP 7
                  { DUP };
              DIG 7;
              DIP { PAIR;
                    PAIR };
              SWAP;
              EXEC };
       SWAP;
       DROP;
       NIL operation;
       DIG 3;
       ITER { CONS };
       SWAP;
       DIP { SWAP } }
     { DUP;
       CDR;
       CDR;
       CAR;
       DIP { DUP;
             CDR;
             CAR;
             CDR;
             DIP { SWAP } };
       DUP;
       PUSH nat 0;
       SWAP;
       DIP { DUP };
       SUB;
       ISNAT;
       IF_NONE { DIG 3;
                 DIP 2
                     { DUP };
                 DIG 2;
                 DIP 4
                     { DUP };
                 DIG 4 }
               { DROP;
                 DIG 3;
                 DIP { DUP };
                 SWAP;
                 DIP 4
                     { DUP };
                 DIG 4 };
       DIP { PUSH nat 1;
             PAIR };
       DIG 2;
       DIP 9
           { DUP };
       DIG 9;
       DIP { PAIR;
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
       DIP { SWAP;
             DUP };
       SWAP;
       DIP { DUP };
       SWAP;
       PUSH nat 1;
       SWAP;
       PAIR;
       DIP { CAR;
             CAR;
             CAR };
       GET;
       IF_NONE { UNIT;
                 PUSH string "PROPOSER_NOT_EXIST_IN_LEDGER";
                 PAIR;
                 FAILWITH }
               {  };
       DIG 3;
       DIP { DUP };
       SWAP;
       DIP { DUP };
       SWAP;
       COMPARE;
       GT;
       IF { DROP }
          { SWAP;
            DROP };
       DIG 2;
       DIP 2
           { DUP };
       DIG 2;
       DIP 2
           { DUP };
       DIG 2;
       PUSH nat 1;
       PAIR;
       DIP { SWAP };
       SWAP;
       DIP { SWAP };
       DIP 8
           { DUP };
       DIG 8;
       DIP { PAIR;
             PAIR };
       SWAP;
       EXEC;
       DIP { PUSH nat 0;
             PAIR;
             SWAP };
       DIP 7
           { DUP };
       DIG 7;
       DIP { PAIR;
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
              DIP { CDR };
              SWAP;
              DIG 2;
              DIP 2
                  { DUP };
              DIG 2;
              DIP 2
                  { DUP };
              DIG 2;
              PUSH nat 1;
              PAIR;
              DIP { SWAP };
              SWAP;
              DIP { SWAP };
              DIP 8
                  { DUP };
              DIG 8;
              DIP { PAIR;
                    PAIR };
              SWAP;
              EXEC;
              DIP { PUSH nat 0;
                    PAIR;
                    SWAP };
              DIP 7
                  { DUP };
              DIG 7;
              DIP { PAIR;
                    PAIR };
              SWAP;
              EXEC };
       SWAP;
       DROP } }
{ DUP;
  CDR;
  CDR;
  CAR;
  DIP { DUP;
        CDR;
        CAR;
        CDR;
        DIP { SWAP } };
  DUP;
  PUSH nat 0;
  SWAP;
  DIP { DUP };
  SUB;
  ISNAT;
  IF_NONE { DIG 3;
            DIP 2
                { DUP };
            DIG 2;
            DIP 4
                { DUP };
            DIG 4 }
          { DROP;
            DIG 3;
            DIP { DUP };
            SWAP;
            DIP 4
                { DUP };
            DIG 4 };
  DIP { PUSH nat 1;
        PAIR };
  DIG 2;
  DIP 9
      { DUP };
  DIG 9;
  DIP { PAIR;
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
  DIP { SWAP;
        DUP };
  SWAP;
  DIP { DUP };
  SWAP;
  PUSH nat 1;
  SWAP;
  PAIR;
  DIP { CAR;
        CAR;
        CAR };
  GET;
  IF_NONE { UNIT;
            PUSH string "PROPOSER_NOT_EXIST_IN_LEDGER";
            PAIR;
            FAILWITH }
          {  };
  DIG 3;
  DIP { DUP };
  SWAP;
  DIP { DUP };
  SWAP;
  COMPARE;
  GT;
  IF { DROP }
     { SWAP;
       DROP };
  DIG 2;
  DIP 2
      { DUP };
  DIG 2;
  DIP 2
      { DUP };
  DIG 2;
  PUSH nat 1;
  PAIR;
  DIP { SWAP };
  SWAP;
  DIP { SWAP };
  DIP 8
      { DUP };
  DIG 8;
  DIP { PAIR;
        PAIR };
  SWAP;
  EXEC;
  DIP { PUSH nat 0;
        PAIR;
        SWAP };
  DIP 7
      { DUP };
  DIG 7;
  DIP { PAIR;
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
         DIP { CDR };
         SWAP;
         DIG 2;
         DIP 2
             { DUP };
         DIG 2;
         DIP 2
             { DUP };
         DIG 2;
         PUSH nat 1;
         PAIR;
         DIP { SWAP };
         SWAP;
         DIP { SWAP };
         DIP 8
             { DUP };
         DIG 8;
         DIP { PAIR;
               PAIR };
         SWAP;
         EXEC;
         DIP { PUSH nat 0;
               PAIR;
               SWAP };
         DIP 7
             { DUP };
         DIG 7;
         DIP { PAIR;
               PAIR };
         SWAP;
         EXEC };
  SWAP;
  DROP };
SWAP;
DROP }
{ SWAP;
DROP;
DIP { DUP;
   CDR;
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
PAIR } };
SWAP;
PAIR } } }
{ IF_LEFT { IF_LEFT { DIP { DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP }
{ IF_LEFT { DROP }
         { PUSH string "MIGRATED";
           PAIR;
           FAILWITH } };
DUP;
CAR;
CDR;
CDR;
CAR;
SENDER;
COMPARE;
EQ;
IF {  }
{ UNIT;
PUSH string "NOT_ADMIN";
PAIR;
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
DIP 3
{ DUP };
DIG 3;
DIP { PAIR;
PAIR };
SWAP;
EXEC;
NIL operation;
PAIR }
{ DIP { DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP }
{ IF_LEFT { DROP }
         { PUSH string "MIGRATED";
           PAIR;
           FAILWITH } };
DUP;
CAR;
CDR;
CDR;
CAR;
SENDER;
COMPARE;
EQ;
IF {  }
{ UNIT;
PUSH string "NOT_ADMIN";
PAIR;
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
DIP 4
{ DUP };
DIG 4;
DIP { PAIR;
PAIR };
SWAP;
EXEC;
NIL operation;
PAIR } }
{ IF_LEFT { DIP { DUP;
CAR;
CDR;
CDR;
CAR;
SENDER;
COMPARE;
EQ;
IF {  }
{ UNIT;
PUSH string "NOT_ADMIN";
PAIR;
FAILWITH } };
DUP;
CDR;
DIP { CAR;
CONTRACT %transfer (list (pair address (list (pair address (pair nat nat)))));
IF_NONE { UNIT;
 PUSH string "FAIL_TRANSFER_CONTRACT_TOKENS";
 PAIR;
 FAILWITH }
{  };
PUSH mutez 0 };
TRANSFER_TOKENS;
NIL operation;
SWAP;
CONS;
PAIR }
{ DIP { DUP;
CDR;
CAR;
CAR;
IF_LEFT { DROP }
{ IF_LEFT { DROP }
         { PUSH string "MIGRATED";
           PAIR;
           FAILWITH } } };
PUSH mutez 0;
SELF;
ADDRESS;
TRANSFER_TOKENS;
NIL operation;
SWAP;
CONS;
PAIR } } } };
DIP { DROP 2 } };`;
