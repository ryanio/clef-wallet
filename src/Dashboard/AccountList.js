import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Identicon } from 'ethereum-react-components';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import web3 from '../lib/web3';

function Balance({ address }) {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const balanceEther = web3.utils.fromWei(data.block.account.balance, 'ether');
  return `${balanceEther} ether`;
}

const styles = {};

class AccountList extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired
  };

  render() {
    const { accounts } = this.props;

    if (accounts.length === 0) {
      return (
        <p>
          <em>No accounts.</em>
        </p>
      );
    }

    return (
      <List>
        {accounts.map(address => {
          return (
            <ListItem key={address}>
              <ListItemAvatar>
                <Avatar>
                  <Identicon
                    address={address}
                    size="small"
                    style={{ verticalAlign: 'middle', marginRight: 5 }}
                  />{' '}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={address}
                secondary={<Balance address={address} />}
              />
            </ListItem>
          );
        })}
      </List>
    );
  }
}

export default withStyles(styles)(AccountList);
