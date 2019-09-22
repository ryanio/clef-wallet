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
import { chainIdToNetwork } from '../lib/utils';

function LatestBlock(props) {
  const { classes, network } = props;
  const { loading, error, data } = useQuery(
    gql`
      {
        block {
          number
          timestamp
        }
        syncing {
          highestBlock
          currentBlock
        }
      }
    `,
    { pollInterval: 3000 }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;

  const blockNumber = Number(
    web3.utils.hexToNumberString(data.block.number)
  ).toLocaleString();
  const timestamp = Number(web3.utils.hexToNumberString(data.block.timestamp));

  // Status Color
  let statusColor = 'green';
  const nowTimestamp = new Date().getTime() / 1000;
  if (nowTimestamp - timestamp >= 180) {
    statusColor = 'red';
  } else if (nowTimestamp - timestamp >= 60) {
    statusColor = 'orange';
  }

  // Syncing
  let syncing;
  if (data.syncing) {
    const { highestBlock, currentBlock } = data.syncing;
    const blocksLeft = highestBlock - currentBlock;
    syncing = <span>Syncing {blocksLeft.toLocaleString()} blocks left...</span>;
  } else {
    syncing = null;
  }

  return (
    <span>
      <Box
        className={classes.statusDot}
        style={{ backgroundColor: statusColor }}
      />{' '}
      {syncing ? (
        syncing
      ) : (
        <span>
          {statusColor === 'green' ? (
            <span>Connected to latest blocks</span>
          ) : (
            <span>Not connected to latest blocks</span>
          )}
          <span>
            {' '}
            on <span style={{ textTransform: 'capitalize' }}>{network}</span>
          </span>
          <LayersIcon className={classes.icon} />
          {blockNumber}
          <span
            className={classes.timeAgo}
            style={{
              color: statusColor === 'green' ? 'black' : statusColor
            }}
          >
            <AvTimerIcon className={classes.icon} />
            Last block registered <TimeAgo date={new Date(timestamp) * 1000} />
          </span>
        </span>
      )}
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
  statusDot: {
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

  constructor(props) {
    super(props);
    this.state = {
      network: null
    };
    this.setNetwork();
  }

  async setNetwork() {
    const chainId = await web3.eth.net.getId();
    const network = chainIdToNetwork(chainId);
    this.setState({ network });
  }

  render() {
    const { classes } = this.props;
    const { network } = this.state;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box className={classes.statusBox}>
            <LatestBlock classes={classes} network={network} />
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(StatusLine);
