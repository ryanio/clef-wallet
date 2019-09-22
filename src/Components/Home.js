import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import web3 from '../lib/web3';
import NewOffer from './NewOffer';

const styles = {
  paper: { padding: 25 }
};

class Home extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  state = {};

  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Welcome</Typography>
            <p>
              IPFS Pin Market is an Ethereum smart contract where you can pay
              Dai to host your files on IPFS.{' '}
              <a
                href="https://medium.com/@ryanghods/introducing-ipfs-pin-market-abc5ad84bc2e"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontStyle: 'italic' }}
              >
                Learn more.
              </a>
            </p>

            <p></p>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Recent Activity</Typography>
            {/* <OfferList /> */}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Upload</Typography>
            <NewOffer />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(withStyles(styles)(Home));
