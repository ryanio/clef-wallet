// Network<>chainId Helpers
const networks = {
  1: 'main',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan',
  1337: 'private'
};
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
export const chainIdToNetwork = chainId => {
  return networks[chainId];
};
export const networkToChainId = network => {
  return Number(getKeyByValue(networks, network));
};
