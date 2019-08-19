import web3 from './web3';
import { addTokens } from '../store/app/actions';
import { GET_TOKEN_BALANCE } from '../queries/TokenBalance';

const checkTokenBalance = (apolloClient, token, account) => {
  return new Promise(async (resolve, reject) => {
    const callData =
      '0x70a08231000000000000000000000000' + account.address.substring(2); // balanceOf(address)

    let result;
    try {
      const { data } = await apolloClient.query({
        query: GET_TOKEN_BALANCE,
        variables: { tokenAddress: token.address, callData }
      });
      result = data.block.call.data;
    } catch (error) {
      reject(error);
    }

    if (!result) {
      throw new Error('No result');
    }

    console.log('result: ', result);
    const tokenAmt = web3.utils.toBN(result);
    console.log('tokenAmt: ', tokenAmt);
    let tokenAmtDecimal = tokenAmt;
    if (web3.utils.toBN(token.decimals).gt(web3.utils.toBN(0))) {
      tokenAmtDecimal = tokenAmt.div(token.decimals);
    }
    console.log('tokenAmtDecimal: ', tokenAmtDecimal);
    resolve(tokenAmtDecimal);
  });
};

export const scanTokens = (newStatus, apolloClient) => {
  return async (dispatch, getState) => {
    newStatus('Downloading token list...');
    const tokenListUrl =
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/eth/tokens-eth.json';
    const accounts = getState().app.accounts;
    const tokensToAdd = [];
    let balancesChecked = 0;
    const alreadyStored = getState().app.tokens.map(token => token.address);

    let tokens = [];
    try {
      const response = await fetch(tokenListUrl);
      tokens = await response.json();
    } catch (error) {
      newStatus(error.toString());
    }

    const numberOfBalancesToCheck = tokens.length * accounts.length;
    const status = `Checking ${tokens.length.toLocaleString()} tokens across ${
      accounts.length
    } accounts: ${numberOfBalancesToCheck.toLocaleString()} balances to check...`;
    newStatus(status);
    console.log(status);

    tokens.forEach(token => {
      if (!web3.utils.isAddress(token.address)) {
        console.log(`Token address invalid: ${token.address}`);
        return;
      }

      if (alreadyStored.includes(token.address)) {
        console.log(`Already subscribed to ${token.name}`);
        return;
      }

      accounts.forEach(async account => {
        let balance = 0;
        try {
          balance = await checkTokenBalance(apolloClient, token, account);
        } catch (error) {
          console.error(error);
        }
        balancesChecked++;
        console.log(balance);
        const balanceBN = web3.utils.toBN(balance);
        console.log(balance.toString());
        if (balanceBN.gt(web3.utils.toBN(0))) {
          console.log(
            `${token.name} balance for ${account.name}: ${balance} ${token.symbol}`
          );
          tokensToAdd.push(token);
        }
        // Update status
        const balancesLeft =
          numberOfBalancesToCheck - balancesChecked - alreadyStored.length;
        let thisStatus = `Checking ${balancesLeft.toLocaleString()} balances left...`;
        if (tokensToAdd.length > 0) {
          thisStatus = `Found ${tokensToAdd.length} tokens. ${thisStatus}`;
        }
        newStatus(thisStatus);
      });

      //   Promise.all(balancePromises)
      //     .then(() => {
      //       console.log('Token Scan finished: ', tokensToAdd);
      //       newStatus(
      //         `Token Scan Finished. ${tokensToAdd.length} new tokens found.`
      //       );
      //       dispatch(addTokens(tokensToAdd));
      //     })
      //     .catch(error => {
      //       console.error(error);
      //       newStatus(error);
      //     });
    });
  };
};
