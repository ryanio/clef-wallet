import React from 'react';
import PropTypes from 'prop-types';
import { Identicon } from 'ethereum-react-components';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import TokenBalance from '../queries/TokenBalance';

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

class TokenList extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    tokens: PropTypes.array.isRequired
  };

  render() {
    const { classes, tokens } = this.props;

    if (tokens.length === 0) {
      return (
        <p>
          <em>No tokens.</em>
        </p>
      );
    }

    return (
      <List className={classes.list}>
        {tokens.map(token => {
          const { name, address } = token;
          return (
            <Link to={`/address/${address}`} key={address}>
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
                  secondary={
                    <TokenBalance forAddress={address} token={token} />
                  }
                />
              </ListItem>
            </Link>
          );
        })}
      </List>
    );
  }
}

export default withStyles(styles)(TokenList);
