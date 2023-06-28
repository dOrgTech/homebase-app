export default `{ parameter
  (or (or (or (or %admin (bool %pause) (address %set_admin))
              (or %assets
                 (or (pair %balance_of
                        (list %requests (pair (address %owner) (nat %token_id)))
                        (contract %callback
                           (list (pair (pair %request (address %owner) (nat %token_id)) (nat %balance)))))
                     (list %transfer
                        (pair (address %from_) (list %txs (pair (address %to_) (nat %token_id) (nat %amount))))))
                 (list %update_operators
                    (or (pair %add_operator (address %owner) (address %operator) (nat %token_id))
                        (pair %remove_operator (address %owner) (address %operator) (nat %token_id))))))
          (or (option %set_delegate address) (address %set_minter)))
      (or %tokens
         (list %burn_tokens (pair (address %owner) (nat %amount)))
         (list %mint_tokens (pair (address %owner) (nat %amount))))) ;
storage
  (pair (pair (pair %admin (address %admin) (bool %paused))
              (pair %assets
                 (pair (pair (big_map %delegates address address) (big_map %ledger address nat))
                       (address %minter)
                       (big_map %operators (pair address address nat) unit))
                 (pair (big_map %token_metadata nat (pair (nat %token_id) (map %token_info string bytes)))
                       (nat %total_supply))
                 (big_map %voting_power_history
                    (pair address nat)
                    (pair (nat %amount) (nat %from_block)))
                 (big_map %voting_power_history_sizes address nat)))
        (big_map %metadata string bytes)) ;
code { PUSH string "FA2_TOKEN_UNDEFINED" ;
       PUSH string "FA2_INSUFFICIENT_BALANCE" ;
       LAMBDA
         int
         nat
         { ISNAT ; IF_NONE { PUSH string "NOT_A_NAT" ; FAILWITH } {} } ;
       LAMBDA
         (pair (lambda int nat)
               (pair (pair address int)
                     (pair (pair (big_map address address) (big_map address nat))
                           address
                           (big_map (pair address address nat) unit))
                     (pair (big_map nat (pair nat (map string bytes))) nat)
                     (big_map (pair address nat) (pair nat nat))
                     (big_map address nat)))
         (pair (pair (pair (big_map address address) (big_map address nat))
                     address
                     (big_map (pair address address nat) unit))
               (pair (big_map nat (pair nat (map string bytes))) nat)
               (big_map (pair address nat) (pair nat nat))
               (big_map address nat))
         { UNPAIR ;
           SWAP ;
           UNPAIR ;
           UNPAIR ;
           DUP 3 ;
           CDR ;
           CDR ;
           CDR ;
           DUP 2 ;
           GET ;
           IF_NONE
             { SWAP ; DIG 3 ; SWAP ; EXEC ; PUSH nat 0 }
             { DUP 4 ;
               CDR ;
               CDR ;
               CAR ;
               PUSH int 1 ;
               DUP 3 ;
               SUB ;
               DUP 7 ;
               SWAP ;
               EXEC ;
               DUP 4 ;
               PAIR ;
               GET ;
               IF_NONE { PUSH string "option is None" ; FAILWITH } {} ;
               DIG 3 ;
               DUP 2 ;
               CAR ;
               ADD ;
               DUP 6 ;
               SWAP ;
               EXEC ;
               LEVEL ;
               DIG 2 ;
               CDR ;
               COMPARE ;
               EQ ;
               IF { PUSH int 1 ; DIG 2 ; SUB ; DIG 4 ; SWAP ; EXEC }
                  { DIG 4 ; DROP ; SWAP } } ;
           LEVEL ;
           DIG 2 ;
           PAIR ;
           DUP 4 ;
           CDR ;
           CDR ;
           CDR ;
           PUSH nat 1 ;
           DUP 4 ;
           ADD ;
           SOME ;
           DUP 5 ;
           UPDATE ;
           DUP 5 ;
           CDR ;
           CDR ;
           CAR ;
           PAIR ;
           DUP 5 ;
           CDR ;
           CAR ;
           PAIR ;
           DUP 5 ;
           CAR ;
           PAIR ;
           DUP ;
           CDR ;
           CDR ;
           CDR ;
           DIG 5 ;
           CDR ;
           CDR ;
           CAR ;
           DIG 3 ;
           SOME ;
           DIG 4 ;
           DIG 5 ;
           PAIR ;
           UPDATE ;
           PAIR ;
           DUP 2 ;
           CDR ;
           CAR ;
           PAIR ;
           SWAP ;
           CAR ;
           PAIR } ;
       DUP 2 ;
       APPLY ;
       SWAP ;
       DROP ;
       LAMBDA
         (pair address (big_map address nat))
         nat
         { UNPAIR ; GET ; IF_NONE { PUSH nat 0 } {} } ;
       LAMBDA
         (pair (pair (lambda (pair address (big_map address nat)) nat)
                     (lambda
                        (pair (pair address int)
                              (pair (pair (big_map address address) (big_map address nat))
                                    address
                                    (big_map (pair address address nat) unit))
                              (pair (big_map nat (pair nat (map string bytes))) nat)
                              (big_map (pair address nat) (pair nat nat))
                              (big_map address nat))
                        (pair (pair (pair (big_map address address) (big_map address nat))
                                    address
                                    (big_map (pair address address nat) unit))
                              (pair (big_map nat (pair nat (map string bytes))) nat)
                              (big_map (pair address nat) (pair nat nat))
                              (big_map address nat)))
                     string)
               (pair (pair address int)
                     (pair (pair (big_map address address) (big_map address nat))
                           address
                           (big_map (pair address address nat) unit))
                     (pair (big_map nat (pair nat (map string bytes))) nat)
                     (big_map (pair address nat) (pair nat nat))
                     (big_map address nat)))
         (pair (pair (pair (big_map address address) (big_map address nat))
                     address
                     (big_map (pair address address nat) unit))
               (pair (big_map nat (pair nat (map string bytes))) nat)
               (big_map (pair address nat) (pair nat nat))
               (big_map address nat))
         { UNPAIR ;
           UNPAIR 3 ;
           DIG 3 ;
           UNPAIR ;
           UNPAIR ;
           DUP 3 ;
           CAR ;
           CAR ;
           CDR ;
           DUP 2 ;
           PAIR ;
           DIG 4 ;
           SWAP ;
           EXEC ;
           DUP 3 ;
           ADD ;
           ISNAT ;
           IF_NONE
             { DIG 4 ; FAILWITH }
             { DIG 5 ;
               DROP ;
               PUSH nat 0 ;
               DUP 2 ;
               COMPARE ;
               EQ ;
               IF { DROP ; DUP 3 ; CAR ; CAR ; CDR ; DUP 2 ; NONE nat ; SWAP ; UPDATE }
                  { DUP 4 ; CAR ; CAR ; CDR ; SWAP ; SOME ; DUP 3 ; UPDATE } } ;
           PUSH int 0 ;
           DUP 4 ;
           COMPARE ;
           EQ ;
           IF { SWAP ; DIG 2 ; DIG 4 ; DROP 3 ; SWAP }
              { DUP 4 ;
                DIG 3 ;
                DIG 4 ;
                CAR ;
                CAR ;
                CAR ;
                DUP 5 ;
                GET ;
                IF_NONE { DIG 3 } { DIG 4 ; DROP } ;
                PAIR ;
                PAIR ;
                DIG 2 ;
                SWAP ;
                EXEC } ;
           DUP ;
           CDR ;
           DUP 2 ;
           CAR ;
           CDR ;
           DIG 3 ;
           DIG 3 ;
           CAR ;
           CAR ;
           CAR ;
           PAIR ;
           PAIR ;
           PAIR } ;
       DUP 4 ;
       DUP 4 ;
       DUP 4 ;
       PAIR 3 ;
       APPLY ;
       LAMBDA
         (pair (pair (lambda
                        (pair (pair address int)
                              (pair (pair (big_map address address) (big_map address nat))
                                    address
                                    (big_map (pair address address nat) unit))
                              (pair (big_map nat (pair nat (map string bytes))) nat)
                              (big_map (pair address nat) (pair nat nat))
                              (big_map address nat))
                        (pair (pair (pair (big_map address address) (big_map address nat))
                                    address
                                    (big_map (pair address address nat) unit))
                              (pair (big_map nat (pair nat (map string bytes))) nat)
                              (big_map (pair address nat) (pair nat nat))
                              (big_map address nat)))
                     string)
               (pair (pair (list (pair (option address) (list (pair (option address) nat nat))))
                           (lambda (pair (pair address address) nat (big_map (pair address address nat) unit)) unit))
                     (pair (pair (big_map address address) (big_map address nat))
                           address
                           (big_map (pair address address nat) unit))
                     (pair (big_map nat (pair nat (map string bytes))) nat)
                     (big_map (pair address nat) (pair nat nat))
                     (big_map address nat)))
         (pair (list operation)
               (pair (pair (big_map address address) (big_map address nat))
                     address
                     (big_map (pair address address nat) unit))
               (pair (big_map nat (pair nat (map string bytes))) nat)
               (big_map (pair address nat) (pair nat nat))
               (big_map address nat))
         { UNPAIR ;
           UNPAIR ;
           DIG 2 ;
           UNPAIR ;
           UNPAIR ;
           DIG 2 ;
           SWAP ;
           ITER { SWAP ;
                  SENDER ;
                  SWAP ;
                  DUP 3 ;
                  CDR ;
                  ITER { SWAP ;
                         PUSH nat 0 ;
                         DUP 3 ;
                         GET 3 ;
                         COMPARE ;
                         NEQ ;
                         IF { DROP 2 ; DUP 5 ; FAILWITH }
                            { DUP 4 ;
                              CAR ;
                              IF_NONE
                                {}
                                { DUP 2 ;
                                  CAR ;
                                  CDR ;
                                  CDR ;
                                  DUP 4 ;
                                  GET 3 ;
                                  PAIR ;
                                  DUP 5 ;
                                  DUP 3 ;
                                  PAIR ;
                                  PAIR ;
                                  DUP 7 ;
                                  SWAP ;
                                  EXEC ;
                                  DROP ;
                                  SWAP ;
                                  DUP 3 ;
                                  GET 4 ;
                                  NEG ;
                                  DIG 2 ;
                                  PAIR ;
                                  PAIR ;
                                  DUP 6 ;
                                  SWAP ;
                                  EXEC } ;
                              DUP 2 ;
                              CAR ;
                              IF_NONE
                                { SWAP ; DROP }
                                { SWAP ; DIG 2 ; GET 4 ; INT ; DIG 2 ; PAIR ; PAIR ; DUP 5 ; SWAP ; EXEC } } } ;
                  SWAP ;
                  DIG 2 ;
                  DROP 2 } ;
           SWAP ;
           DIG 2 ;
           DIG 3 ;
           DROP 3 ;
           NIL operation ;
           PAIR } ;
       DUP 6 ;
       DUP 3 ;
       PAIR ;
       APPLY ;
       SWAP ;
       DROP ;
       LAMBDA
         (list (pair address nat))
         nat
         { PUSH nat 0 ; SWAP ; ITER { CDR ; ADD } } ;
       LAMBDA
         (pair address bool)
         unit
         { CAR ;
           SENDER ;
           COMPARE ;
           NEQ ;
           IF { PUSH string "NOT_AN_ADMIN" ; FAILWITH } { UNIT } } ;
       LAMBDA
         (pair address bool)
         unit
         { CDR ; IF { PUSH string "PAUSED" ; FAILWITH } { UNIT } } ;
       DIG 8 ;
       UNPAIR ;
       PUSH mutez 0 ;
       AMOUNT ;
       COMPARE ;
       GT ;
       IF { PUSH string "AMOUNT_NOT_ZERO" ; FAILWITH } {} ;
       IF_LEFT
         { DIG 4 ;
           DIG 8 ;
           DROP 2 ;
           IF_LEFT
             { DIG 6 ;
               DROP ;
               IF_LEFT
                 { DIG 2 ;
                   DIG 4 ;
                   DIG 5 ;
                   DIG 6 ;
                   DROP 4 ;
                   DUP 2 ;
                   CAR ;
                   CAR ;
                   DIG 3 ;
                   SWAP ;
                   EXEC ;
                   DROP ;
                   DUP 2 ;
                   CAR ;
                   CAR ;
                   SWAP ;
                   IF_LEFT { SWAP ; CAR } { SWAP ; CDR ; SWAP } ;
                   PAIR ;
                   NIL operation ;
                   DUP 3 ;
                   CDR ;
                   DIG 3 ;
                   CAR ;
                   CDR ;
                   DIG 3 }
                 { DIG 3 ;
                   DROP ;
                   DUP 2 ;
                   CAR ;
                   CAR ;
                   DIG 3 ;
                   SWAP ;
                   EXEC ;
                   DROP ;
                   DUP 2 ;
                   CAR ;
                   CDR ;
                   SWAP ;
                   IF_LEFT
                     { IF_LEFT
                         { DIG 3 ;
                           DROP ;
                           DUP ;
                           CAR ;
                           MAP { PUSH nat 0 ;
                                 DUP 2 ;
                                 CDR ;
                                 COMPARE ;
                                 NEQ ;
                                 IF { DROP ; DUP 5 ; FAILWITH }
                                    { DUP 3 ;
                                      CAR ;
                                      CAR ;
                                      CDR ;
                                      DUP 2 ;
                                      CAR ;
                                      PAIR ;
                                      DUP 6 ;
                                      SWAP ;
                                      EXEC ;
                                      SWAP ;
                                      PAIR } } ;
                           DIG 4 ;
                           DIG 5 ;
                           DROP 2 ;
                           SWAP ;
                           CDR ;
                           PUSH mutez 0 ;
                           DIG 2 ;
                           TRANSFER_TOKENS ;
                           SWAP ;
                           NIL operation ;
                           DIG 2 ;
                           CONS ;
                           PAIR }
                         { DIG 4 ;
                           DIG 5 ;
                           DROP 2 ;
                           MAP { DUP ;
                                 CDR ;
                                 MAP { DUP ; GET 4 ; DUP 2 ; GET 3 ; DIG 2 ; CAR ; SOME ; PAIR 3 } ;
                                 SWAP ;
                                 CAR ;
                                 SOME ;
                                 PAIR } ;
                           SWAP ;
                           LAMBDA
                             (pair (pair address address) nat (big_map (pair address address nat) unit))
                             unit
                             { UNPAIR ;
                               UNPAIR ;
                               DIG 2 ;
                               UNPAIR ;
                               DUP 4 ;
                               DUP 4 ;
                               COMPARE ;
                               EQ ;
                               IF { DROP 4 ; UNIT }
                                  { DIG 3 ;
                                    PAIR ;
                                    DIG 2 ;
                                    PAIR ;
                                    MEM ;
                                    IF { UNIT } { PUSH string "FA2_NOT_OPERATOR" ; FAILWITH } } } ;
                           DIG 2 ;
                           PAIR ;
                           PAIR ;
                           DIG 2 ;
                           SWAP ;
                           EXEC } }
                     { DIG 3 ;
                       DIG 4 ;
                       DIG 5 ;
                       DROP 3 ;
                       SENDER ;
                       DUP 3 ;
                       CAR ;
                       CDR ;
                       CDR ;
                       DIG 2 ;
                       ITER { SWAP ;
                              DUP 3 ;
                              DUP 3 ;
                              IF_LEFT {} {} ;
                              CAR ;
                              COMPARE ;
                              EQ ;
                              IF {} { PUSH string "FA2_NOT_OWNER" ; FAILWITH } ;
                              SWAP ;
                              IF_LEFT
                                { SWAP ;
                                  UNIT ;
                                  SOME ;
                                  DUP 3 ;
                                  GET 4 ;
                                  DUP 4 ;
                                  GET 3 ;
                                  PAIR ;
                                  DIG 3 ;
                                  CAR ;
                                  PAIR ;
                                  UPDATE }
                                { SWAP ;
                                  DUP 2 ;
                                  GET 4 ;
                                  DUP 3 ;
                                  GET 3 ;
                                  PAIR ;
                                  DIG 2 ;
                                  CAR ;
                                  PAIR ;
                                  NONE unit ;
                                  SWAP ;
                                  UPDATE } } ;
                       SWAP ;
                       DROP ;
                       DUP 2 ;
                       CDR ;
                       SWAP ;
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
                       NIL operation ;
                       PAIR } ;
                   UNPAIR ;
                   DUP 3 ;
                   CDR ;
                   DIG 2 ;
                   DIG 3 ;
                   CAR ;
                   CAR } ;
               PAIR ;
               PAIR ;
               SWAP }
             { DIG 4 ;
               DIG 7 ;
               DROP 2 ;
               IF_LEFT
                 { DIG 3 ;
                   DROP ;
                   DUP 2 ;
                   CAR ;
                   CAR ;
                   DIG 3 ;
                   SWAP ;
                   EXEC ;
                   DROP ;
                   DUP 2 ;
                   CAR ;
                   CDR ;
                   DUP ;
                   CAR ;
                   CAR ;
                   CDR ;
                   SENDER ;
                   PAIR ;
                   DIG 4 ;
                   SWAP ;
                   EXEC ;
                   DUP 3 ;
                   IF_NONE { SENDER } {} ;
                   DUP 3 ;
                   CAR ;
                   CAR ;
                   CAR ;
                   SENDER ;
                   GET ;
                   IF_NONE { SENDER } {} ;
                   PUSH nat 0 ;
                   DUP 4 ;
                   COMPARE ;
                   EQ ;
                   DUP 2 ;
                   DUP 4 ;
                   COMPARE ;
                   EQ ;
                   OR ;
                   IF { SWAP ; DIG 2 ; DIG 6 ; DROP 4 ; DUP }
                      { DUP 4 ;
                        DUP 4 ;
                        NEG ;
                        DIG 2 ;
                        PAIR ;
                        PAIR ;
                        DUP 7 ;
                        SWAP ;
                        EXEC ;
                        DIG 2 ;
                        INT ;
                        DIG 2 ;
                        PAIR ;
                        PAIR ;
                        DIG 4 ;
                        SWAP ;
                        EXEC } ;
                   DUP ;
                   CDR ;
                   DUP 2 ;
                   CAR ;
                   CDR ;
                   DIG 2 ;
                   CAR ;
                   CAR ;
                   CDR ;
                   DIG 3 ;
                   CAR ;
                   CAR ;
                   CAR ;
                   DIG 4 ;
                   SENDER ;
                   UPDATE ;
                   PAIR ;
                   PAIR ;
                   PAIR ;
                   DUP 2 ;
                   CDR ;
                   SWAP ;
                   DIG 2 ;
                   CAR ;
                   CAR }
                 { DIG 2 ;
                   DIG 4 ;
                   DIG 5 ;
                   DROP 3 ;
                   DUP 2 ;
                   CAR ;
                   CAR ;
                   DIG 3 ;
                   SWAP ;
                   EXEC ;
                   DROP ;
                   DUP 2 ;
                   CDR ;
                   DUP 3 ;
                   CAR ;
                   CDR ;
                   DUP ;
                   CDR ;
                   DUP 2 ;
                   CAR ;
                   CDR ;
                   CDR ;
                   DIG 4 ;
                   PAIR ;
                   DIG 2 ;
                   CAR ;
                   CAR ;
                   PAIR ;
                   PAIR ;
                   DIG 2 ;
                   CAR ;
                   CAR } ;
               PAIR ;
               PAIR ;
               NIL operation } }
         { DIG 3 ;
           DIG 6 ;
           DIG 7 ;
           DIG 9 ;
           DROP 4 ;
           DUP 2 ;
           CAR ;
           CAR ;
           DIG 3 ;
           SWAP ;
           EXEC ;
           DROP ;
           DUP 2 ;
           CAR ;
           CDR ;
           CAR ;
           CDR ;
           CAR ;
           SENDER ;
           COMPARE ;
           NEQ ;
           IF { PUSH string "NOT_MINTER" ; FAILWITH } {} ;
           DUP 2 ;
           CAR ;
           CDR ;
           SWAP ;
           IF_LEFT
             { DUP ;
               MAP { NIL (pair (option address) nat nat) ;
                     DUP 2 ;
                     CDR ;
                     PUSH nat 0 ;
                     NONE address ;
                     PAIR 3 ;
                     CONS ;
                     SWAP ;
                     CAR ;
                     SOME ;
                     PAIR } ;
               DUP 3 ;
               LAMBDA
                 (pair (pair address address) nat (big_map (pair address address nat) unit))
                 unit
                 { DROP ; UNIT } ;
               DIG 2 ;
               PAIR ;
               PAIR ;
               DIG 5 ;
               SWAP ;
               EXEC ;
               UNPAIR ;
               DIG 2 ;
               DIG 5 ;
               SWAP ;
               EXEC ;
               DIG 3 ;
               CDR ;
               CAR ;
               CDR ;
               SUB ;
               ISNAT ;
               IF_NONE { DIG 3 ; FAILWITH } { DIG 4 ; DROP } ;
               DUP 3 ;
               CDR ;
               CDR ;
               SWAP ;
               DUP 4 ;
               CDR ;
               CAR ;
               CAR ;
               PAIR ;
               PAIR ;
               DIG 2 ;
               CAR }
             { DIG 5 ;
               DROP ;
               DUP ;
               MAP { DUP ; CDR ; PUSH nat 0 ; DIG 2 ; CAR ; SOME ; PAIR 3 } ;
               DUP 3 ;
               LAMBDA
                 (pair (pair address address) nat (big_map (pair address address nat) unit))
                 unit
                 { DROP ; UNIT } ;
               NIL (pair (option address) (list (pair (option address) nat nat))) ;
               DIG 3 ;
               NONE address ;
               PAIR ;
               CONS ;
               PAIR ;
               PAIR ;
               DIG 5 ;
               SWAP ;
               EXEC ;
               UNPAIR ;
               DIG 2 ;
               DIG 5 ;
               SWAP ;
               EXEC ;
               DUP 3 ;
               CDR ;
               CDR ;
               SWAP ;
               DIG 4 ;
               CDR ;
               CAR ;
               CDR ;
               ADD ;
               DUP 4 ;
               CDR ;
               CAR ;
               CAR ;
               PAIR ;
               PAIR ;
               DIG 2 ;
               CAR } ;
           PAIR ;
           SWAP ;
           DUP 3 ;
           CDR ;
           DIG 2 ;
           DIG 3 ;
           CAR ;
           CAR ;
           PAIR ;
           PAIR ;
           SWAP } ;
       PAIR } ;
view "voting_power"
     (pair (address %addr) (nat %block_level))
     nat
     { LAMBDA
         int
         nat
         { ISNAT ; IF_NONE { PUSH string "NOT_A_NAT" ; FAILWITH } {} } ;
       SWAP ;
       UNPAIR ;
       SWAP ;
       CAR ;
       CDR ;
       SWAP ;
       UNPAIR ;
       DUP 3 ;
       CDR ;
       CDR ;
       CDR ;
       DUP 2 ;
       GET ;
       IF_NONE { PUSH nat 0 } {} ;
       PUSH nat 0 ;
       DUP 2 ;
       COMPARE ;
       EQ ;
       IF { DROP 5 ; PUSH nat 0 }
          { DUP 4 ;
            PUSH int 1 ;
            DUP 3 ;
            SUB ;
            DUP 7 ;
            SWAP ;
            EXEC ;
            DUP 4 ;
            DIG 2 ;
            CDR ;
            CDR ;
            CAR ;
            DUG 2 ;
            PAIR ;
            GET ;
            IF_NONE { PUSH string "option is None" ; FAILWITH } {} ;
            DUP 4 ;
            DUP 2 ;
            CDR ;
            COMPARE ;
            LE ;
            IF { SWAP ; DIG 2 ; DIG 3 ; DIG 4 ; DIG 5 ; DROP 5 ; CAR }
               { DROP ;
                 DUP 4 ;
                 CDR ;
                 CDR ;
                 CAR ;
                 PUSH nat 0 ;
                 DUP 4 ;
                 PAIR ;
                 GET ;
                 IF_NONE { PUSH string "option is None" ; FAILWITH } {} ;
                 DUP 4 ;
                 SWAP ;
                 CDR ;
                 COMPARE ;
                 GT ;
                 IF { DROP 5 ; PUSH nat 0 }
                    { PUSH int 1 ;
                      SWAP ;
                      SUB ;
                      DUP 5 ;
                      SWAP ;
                      EXEC ;
                      PUSH nat 0 ;
                      PAIR ;
                      LEFT nat ;
                      LOOP_LEFT
                        { UNPAIR ;
                          DUP 2 ;
                          DUP 2 ;
                          COMPARE ;
                          EQ ;
                          IF { SWAP ;
                               DROP ;
                               DUP 4 ;
                               CDR ;
                               CDR ;
                               CAR ;
                               SWAP ;
                               DUP 3 ;
                               PAIR ;
                               GET ;
                               IF_NONE { PUSH string "option is None" ; FAILWITH } {} ;
                               CAR ;
                               RIGHT (pair nat nat) }
                             { PUSH int 2 ;
                               DUP 2 ;
                               DUP 4 ;
                               SUB ;
                               DUP 8 ;
                               SWAP ;
                               EXEC ;
                               EDIV ;
                               IF_NONE { PUSH string "DIV by 0" ; FAILWITH } {} ;
                               CAR ;
                               DUP 3 ;
                               SUB ;
                               DUP 7 ;
                               SWAP ;
                               EXEC ;
                               DUP 6 ;
                               CDR ;
                               CDR ;
                               CAR ;
                               DUP 2 ;
                               DUP 6 ;
                               PAIR ;
                               GET ;
                               IF_NONE { PUSH string "option is None" ; FAILWITH } {} ;
                               DUP 6 ;
                               DUP 2 ;
                               CDR ;
                               COMPARE ;
                               EQ ;
                               IF { SWAP ; DIG 2 ; DIG 3 ; DROP 3 ; CAR ; RIGHT (pair nat nat) }
                                  { DUP 6 ;
                                    SWAP ;
                                    CDR ;
                                    COMPARE ;
                                    GT ;
                                    IF { DIG 2 ; DROP ; PUSH int 1 ; SWAP ; SUB ; DUP 6 ; SWAP ; EXEC }
                                       { SWAP ; DROP ; SWAP } ;
                                    SWAP ;
                                    PAIR ;
                                    LEFT nat } } } ;
                      SWAP ;
                      DIG 2 ;
                      DIG 3 ;
                      DIG 4 ;
                      DROP 4 } } } } ;
view "total_supply" unit nat { CDR ; CAR ; CDR ; CDR ; CAR ; CDR } }

`
