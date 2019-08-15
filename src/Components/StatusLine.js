import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import TimeAgo from 'react-timeago';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LayersIcon from '@material-ui/icons/Layers';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import web3 from '../lib/web3';

function LatestBlock(props) {
  const { classes } = props;
  const { loading, error, data } = useQuery(
    gql`
      {
        block {
          number
          timestamp
        }
      }
    `,
    { pollInterval: 3000 }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.toString()}</p>;

  const blockNumber = Number(
    web3.utils.hexToNumberString(data.block.number)
  ).toLocaleString();
  const timestamp = Number(web3.utils.hexToNumberString(data.block.timestamp));

  let timestampColor = 'green';
  const nowTimestamp = new Date().getTime() / 1000;
  if (nowTimestamp - timestamp >= 180) {
    timestampColor = 'red';
  } else if (nowTimestamp - timestamp >= 60) {
    timestampColor = 'orange';
  }

  return (
    <span>
      <Box
        className={classes.statusIcon}
        style={{ backgroundColor: timestampColor }}
      />
      {timestampColor === 'green' ? (
        <span>Connected to latest blocks</span>
      ) : (
        <span>Not connected to latest blocks</span>
      )}
      <LayersIcon className={classes.icon} />
      {blockNumber}
      <span
        className={classes.timeAgo}
        style={{ color: timestampColor === 'green' ? 'black' : timestampColor }}
      >
        <AvTimerIcon className={classes.icon} />
        {timestampColor !== 'green' && <span>Last block registered </span>}
        <TimeAgo date={new Date(timestamp) * 1000} />
      </span>
    </span>
  );
}

const styles = {
  icon: {
    fontSize: 16,
    marginLeft: 4,
    marginRight: 4,
    verticalAlign: 'middle'
  },
  statusIcon: {
    width: 12,
    height: 12,
    borderRadius: 999,
    display: 'inline-block',
    marginRight: 7
  },
  timeAgo: {
    opacity: 0,
    transition: 'opacity 0.3s'
  },
  statusBox: {
    marginBottom: 10,
    '&:hover $timeAgo': {
      opacity: 1
    }
  }
};

class StatusLine extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    timestampColor: 'green'
  };

  render() {
    const { classes } = this.props;
    const { timestampColor } = this.state;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box className={classes.statusBox}>
            <LatestBlock classes={classes} timestampColor={timestampColor} />
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(StatusLine);
