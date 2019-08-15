import web3 from '../../lib/web3';

export const accountInterface = address => {
  const checksumAddress = web3.utils.toChecksumAddress(address);
  const addressWithout0x =
    checksumAddress.substring(0, 2) === '0x'
      ? checksumAddress.substring(2)
      : checksumAddress;
  const firstChars = addressWithout0x.substring(0, 3);
  const lastChars = addressWithout0x.substring(addressWithout0x.length - 3);
  return {
    address: checksumAddress,
    name: `Account 0x${firstChars}...${lastChars}`
  };
};

export const addAccounts = addresses => {
  return (dispatch, getState) => {
    const { accounts: existingAccounts } = getState().app;
    const newAccounts = [];
    addresses.forEach(address => {
      // Only add unique addresses to the store.
      if (
        existingAccounts.filter(account => account.address === address)
          .length === 0
      ) {
        const account = accountInterface(address);
        console.log(account);
        newAccounts.push(account);
      }
    });
    dispatch({
      type: 'ACCOUNTS:ADD',
      payload: { accounts: newAccounts }
    });
  };
};

export const removeAccount = address => {
  return {
    type: 'ACCOUNTS:REMOVE',
    payload: { address }
  };
};
