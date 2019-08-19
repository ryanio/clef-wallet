import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Identicon } from 'ethereum-react-components';
import { toast } from 'react-toastify';
import { RIEInput } from 'riek';
import QRCode from 'qrcode.react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Balance from '../queries/Balance';
import {
  accountInterface,
  addAccounts,
  removeAccount,
  updateAccountName
} from '../store/app/actions';
import Notification from '../components/Notification';
import web3 from '../lib/web3';

const styles = {
  paper: { padding: 25 },
  removeAccount: {
    color: 'red',
    opacity: 0.3,
    transition: 'opacity 0.1s',
    '&:hover': {
      opacity: 1
    }
  },
  addAccount: {
    opacity: 0.3,
    transition: 'opacity 0.1s',
    '&:hover': {
      opacity: 1
    }
  }
};

class Account extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  handleChangeName({ name }) {
    const { account, dispatch } = this.props;
    dispatch(updateAccountName(name, account.address));
  }

  addAccount(account) {
    const { dispatch } = this.props;
    dispatch(addAccounts([account.address]));
    toast.info(`Added: ${account.name}`);
  }

  removeAccount(account, history) {
    const { dispatch } = this.props;
    if (window.confirm('Are you sure you want to remove this account?')) {
      dispatch(removeAccount(account.address));
      toast.info(`Removed: ${account.name}`);
      history.push('/');
    }
  }

  renderRemoveAccountButton() {
    const { account, classes } = this.props;
    return (
      <Route
        render={({ history }) => (
          <Button
            className={classes.removeAccount}
            onClick={() => this.removeAccount(account, history)}
          >
            Remove Account
          </Button>
        )}
      />
    );
  }

  renderAddAccountButton() {
    const { account, classes } = this.props;
    return (
      <Button
        className={classes.addAccount}
        onClick={() => this.addAccount(account)}
      >
        Add Account
      </Button>
    );
  }

  render() {
    const { classes, account, ownAccount } = this.props;
    const showAddAccountButton = !ownAccount && !account.checksumInvalid;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {account.checksumInvalid && (
              <Grid item xs={12} style={{ marginBottom: 30 }}>
                <Notification
                  type="error"
                  message="Warning: Invalid Checksum. The checksum for this address is invalid. It might not be a real address."
                />
              </Grid>
            )}
            <Grid container justify="space-between">
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Identicon
                      address={account.address}
                      size="large"
                      style={{ verticalAlign: 'middle', marginRight: 15 }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">
                      {!ownAccount && <span>{account.name}</span>}
                      {ownAccount && (
                        <RIEInput
                          value={account.name}
                          change={this.handleChangeName.bind(this)}
                          propName="name"
                          validate={value => {
                            return value !== '';
                          }}
                          editProps={{ style: { fontSize: 20 } }}
                        />
                      )}
                    </Typography>
                    <Typography variant="subtitle1">
                      {account.address}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <QRCode value={account.address} size={90} />
              </Grid>
              <Grid item xs={12}>
                <strong>Balance:</strong> <Balance address={account.address} />
              </Grid>
              <Grid item xs={12} style={{ marginTop: 80 }}>
                {showAddAccountButton && this.renderAddAccountButton()}
                {ownAccount && this.renderRemoveAccountButton()}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { address } = ownProps.match.params;
  const checksumAddress = web3.utils.toChecksumAddress(address);
  let account = state.app.accounts.find(
    account => account.address === checksumAddress
  );
  let ownAccount = true;
  if (!account) {
    ownAccount = false;
    account = accountInterface(address);
  }
  const checksumResult = web3.utils.checkAddressChecksum(address);
  if (!checksumResult) {
    account = { ...account, checksumInvalid: true };
  }
  return {
    account,
    ownAccount
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Account));
