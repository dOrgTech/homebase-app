export const roundNumber = ({
                              number,
                              decimals,
                            }: {
  number: number;
  decimals: number;
}) => Math.round(number * 10 ** decimals) / 10 ** decimals;