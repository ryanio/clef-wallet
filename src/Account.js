import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Identicon } from 'ethereum-react-components';
import { toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import web3 from './lib/web3';
import { accountInterface, removeAccount } from './store/app/actions';

const styles = {
  paper: { padding: 25 },
  removeAccount: {
    marginTop: 30,
    color: 'red'
  }
};

class Account extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    account: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  removeAccount(account, history) {
    const { dispatch } = this.props;
    if (window.confirm('Are you sure you want to remove this account?')) {
      dispatch(removeAccount(account.address));
      toast.info(`Account deleted: ${account.name}`);
      history.push('/');
    }
  }
  render() {
    const { classes, account } = this.props;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container spacing={24}>
              <Grid item>
                <Identicon
                  address={account.address}
                  size="large"
                  style={{ verticalAlign: 'middle', marginRight: 15 }}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6">{account.name}</Typography>
                <Typography variant="subtitle1">{account.address}</Typography>
              </Grid>
            </Grid>
            <div>
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
            </div>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { address } = ownProps.match.params;
  let account = state.app.accounts.find(account => account.address === address);
  if (!account) {
    account = accountInterface(address);
  }
  return {
    account
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Account));
