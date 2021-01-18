export const toShortAddress = (address: string, limit = 4): string => {
  return address
    .slice(0, limit)
    .concat("...")
    .concat(address.slice(address.length - limit, address.length));
};
