import React from 'react';
import PropTypes from 'prop-types';
import { Identicon } from 'ethereum-react-components';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Balance from '../queries/Balance';

const styles = {
  listItem: {
    textDecoration: 'none'
  },
  list: {
    a: {
      color: 'black'
    }
  }
};

class AccountList extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired
  };

  render() {
    const { classes, accounts } = this.props;

    if (accounts.length === 0) {
      return (
        <p>
          <em>No accounts.</em>
        </p>
      );
    }

    return (
      <List className={classes.list}>
        {accounts.map(account => {
          const { name, address } = account;
          return (
            <Link to={`/accounts/${address}`} key={address}>
              <ListItem className={classes.listItem} button>
                <ListItemAvatar style={{ textAlign: 'center' }}>
                  <Identicon
                    address={address}
                    size="small"
                    style={{ verticalAlign: 'middle', marginRight: 5 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={name || address}
                  secondary={<Balance address={address} />}
                />
              </ListItem>
            </Link>
          );
        })}
      </List>
    );
  }
}

export default withStyles(styles)(AccountList);
