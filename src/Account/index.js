import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Identicon } from 'ethereum-react-components';
import { toast } from 'react-toastify';
import ContentEditable from 'react-contenteditable';
import QRCode from 'qrcode.react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Balance from '../queries/Balance';
import {
  accountInterface,
  removeAccount,
  updateAccountName
} from '../store/app/actions';

const styles = {
  paper: { padding: 25 },
  removeAccount: {
    marginTop: 30,
    color: 'red',
    transition: 'opacity 0.1s',
    opacity: 0.3,
    '&:hover': {
      opacity: 1
    }
  }
};

class Account extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    account: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  handleChangeName(event) {
    const { account, dispatch } = this.props;
    const newName = event.target.value;
    dispatch(updateAccountName(newName, account.address));
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

  render() {
    const { classes, account } = this.props;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
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
                      <ContentEditable
                        html={account.name}
                        onChange={this.handleChangeName.bind(this)}
                      />
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
              <Grid item xs={12}>
                <div style={{ marginTop: 40 }}>
                  {this.renderRemoveAccountButton()}
                </div>
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
  let account = state.app.accounts.find(account => account.address === address);
  if (!account) {
    account = accountInterface(address);
  }
  return {
    account
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Account));
