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
      const checksumAddress = web3.utils.toChecksumAddress(address);
      // Only add new unique addresses to accounts.
      if (
        existingAccounts.filter(account => account.address === checksumAddress)
          .length === 0
      ) {
        const account = accountInterface(checksumAddress);
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

export const updateAccountName = (name, address) => {
  return {
    type: 'ACCOUNTS:UPDATE_NAME',
    payload: { name, address }
  };
};
