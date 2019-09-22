export const initialState = {
  accounts: [],
  tokens: []
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
      const accounts = state.accounts.map(account => {
        if (account.address !== address) {
          // This isn't the item we care about - keep it as-is
          return account;
        }
        // Otherwise, this is the one we want - return updated name
        return {
          ...account,
          name
        };
      });
      return {
        ...state,
        accounts
      };
    }
    case 'TOKENS:ADD': {
      const { tokens } = action.payload;
      return {
        ...state,
        tokens: [...state.tokens, ...tokens]
      };
    }
    case 'TOKENS:REMOVE': {
      const { address } = action.payload;
      return {
        ...state,
        tokens: [...state.tokens.filter(token => token.address !== address)]
      };
    }
    default:
      return state;
  }
};

export default app;
