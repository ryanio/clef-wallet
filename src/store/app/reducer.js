export const initialState = {
  accounts: []
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'ACCOUNTS:ADD': {
      const { accounts } = action.payload;
      return {
        ...state,
        accounts: [...state.accounts, ...accounts]
      };
    }
    case 'ACCOUNTS:REMOVE': {
      const { address } = action.payload;
      return {
        ...state,
        accounts: [
          ...state.accounts.filter(account => account.address !== address)
        ]
      };
    }
    case 'ACCOUNTS:UPDATE_NAME': {
      const { name, address } = action.payload;
      const accounts = [
        ...state.accounts.map(account => {
          if (account.address === address) account.name = name;
          return account;
        })
      ];
      return {
        ...state,
        accounts
      };
    }
    default:
      return state;
  }
};

export default app;
