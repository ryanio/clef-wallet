import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import web3 from '../lib/web3';
import AccountList from './AccountList';

const styles = {
  paper: { padding: 25 }
};

class Dashboard extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      accounts: []
    };
  }

  async getAccounts() {
    let accounts = [];
    try {
      accounts = await web3.eth.getAccounts();
    } catch (error) {
      console.error(error);
    }
    this.setState({ accounts });
    return accounts;
  }

  render() {
    const { classes } = this.props;
    const { accounts } = this.state;
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

export default withStyles(styles)(Dashboard);
