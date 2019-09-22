import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { ApolloConsumer } from '@apollo/react-common';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import web3 from '../lib/web3';
import AccountList from './AccountList';
import TokenList from './TokenList';
import { addAccounts } from '../store/app/actions';
import { scanTokens } from '../lib/scanTokens';

const styles = {
  paper: { padding: 25 },
  newAccount: {
    marginLeft: 10,
    opacity: 0.3,
    transition: 'opacity 0.1s',
    '&:hover': {
      opacity: 1
    }
  },
  addToken: {
    marginLeft: 10,
    opacity: 0.3,
    transition: 'opacity 0.1s',
    '&:hover': {
      opacity: 1
    }
  }
};

class Dashboard extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    tokens: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  state = {
    tokenScanStatus: null
  };

  async getAccounts() {
    const { dispatch } = this.props;
    let accounts = [];
    try {
      accounts = await web3.eth.getAccounts();
    } catch (error) {
      console.error(error);
    }
    dispatch(addAccounts(accounts));
  }

  async newAccount() {
    // const { dispatch } = this.props;
    // TODO: Send to Clef
    // {
    //   "id": 0,
    //   "jsonrpc": "2.0",
    //   "method": "account_new",
    //   "params": []
    // }
    // const result = await sendClef('account_new')
    // const address = result.params[0]
    // if (address) {
    // dispatch(addAccounts([address]));
    // toast.success(`New: ${address}`);
    // TODO: history.push(`/address/${address}`);
    // }
  }

  async scanTokens(apolloClient) {
    const { dispatch } = this.props;
    const newStatus = status => {
      this.setState({ tokenScanStatus: status });
    };
    dispatch(scanTokens(newStatus.bind(this), apolloClient));
  }

  render() {
    const { classes, accounts, tokens } = this.props;
    const { tokenScanStatus } = this.state;
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Accounts</Typography>
            <AccountList accounts={accounts} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.getAccounts()}
            >
              Get Accounts
            </Button>
            <Button
              className={classes.newAccount}
              variant="outlined"
              onClick={() => this.newAccount()}
            >
              New Account
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Tokens</Typography>
            <TokenList tokens={tokens} />
            <ApolloConsumer>
              {client => (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.scanTokens(client)}
                >
                  Scan for Tokens
                </Button>
              )}
            </ApolloConsumer>
            <Button
              className={classes.addToken}
              variant="outlined"
              onClick={() => {}}
            >
              Add Token
            </Button>
            {tokenScanStatus && (
              <div style={{ marginTop: 20 }}>{tokenScanStatus}</div>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6">History</Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return { accounts: state.app.accounts, tokens: state.app.tokens };
}

export default connect(mapStateToProps)(withStyles(styles)(Dashboard));
