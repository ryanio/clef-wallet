import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import web3 from '../lib/web3';
import AccountList from './AccountList';
import { addAccounts } from '../store/app/actions';

const styles = {
  paper: { padding: 25 }
};

class Dashboard extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
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

  render() {
    const { classes, accounts } = this.props;
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
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Tokens</Typography>
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
  return { accounts: state.app.accounts };
}

export default connect(mapStateToProps)(withStyles(styles)(Dashboard));
