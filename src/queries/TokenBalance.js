import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import web3 from '../lib/web3';

export const GET_TOKEN_BALANCE = gql`
  query TokenBalance($tokenAddress: Address!, $callData: Bytes!) {
    block {
      call(data: { to: $tokenAddress, data: $callData }) {
        data
      }
    }
  }
`;

export default function TokenBalance({ forAddress, token }) {
  const callData =
    '0x70a08231000000000000000000000000' + forAddress.substring(2); // balanceOf(address)

  const { loading, error, data } = useQuery(GET_TOKEN_BALANCE, {
    variables: { tokenAddress: token.address, callData }
  });

  if (loading) return 'Loading balance';
  if (error) return error.toString();

  console.log(data.block);
  const balance = web3.utils.toBN(data.block.call.data);
  let balanceDecimal = balance;
  if (token.decimal) {
    balanceDecimal = balance.div(token.decimal);
  }
  return `${balanceDecimal.toLocaleString()} ${token.symbol}`;
}
