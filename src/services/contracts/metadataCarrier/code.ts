export const code = `parameter unit;
storage (pair (big_map %metadata string
                                 bytes)
              (unit %dummy));
code { CAR;
       UNIT;
       PUSH string "EmptySupplied";
       PAIR;
       FAILWITH };`
