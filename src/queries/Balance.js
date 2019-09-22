import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import web3 from '../lib/web3';

export default function Balance({ address }) {
  const { loading, error, data } = useQuery(
    gql`
      query Balance($address: Address!) {
        block {
          account(address: $address) {
            balance
          }
        }
      }
    `,
    {
      variables: { address }
    }
  );

  if (loading) return 'Loading balance';
  if (error) return error.toString();

  const balanceEther = web3.utils.fromWei(data.block.account.balance, 'ether');
  return `${balanceEther} ether`;
}
