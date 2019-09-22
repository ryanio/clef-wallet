import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Slider from '@material-ui/core/Slider';
import web3 from '../lib/web3';
import Dropzone from './Dropzone';
import CircularProgress from '@material-ui/core/CircularProgress';
import ipfsClient from 'ipfs-http-client';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { addMonths } from 'date-fns';
import Notification from './Notification';

const styles = {
  dropzone: {
    margin: '20px 0'
  },
  cidInput: {
    width: 500
  },
  slider: {
    marginTop: 45,
    maxWidth: 400
  },
  notificationContainer: {
    margin: '20px 0 30px 0',
    maxWidth: 500
  },
  stepHeader: {
    marginTop: 25
  },
  totalDai: {
    color: '#000'
  }
};

class NewOffer extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
      cid: '',
      name: '',
      size: 0,
      uploading: false,
      selectedDate: addMonths(new Date(), 1),
      price: '0.00000001',
      replications: 3,
      step: 'cid'
    };

    this.ipfs = ipfsClient({
      host: 'ipfs.infura.io',
      port: '5001',
      protocol: 'https'
    });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleDateChange = date => {
    if (date <= Date.now()) {
      toast.error('Please choose a date in the future.');
      return;
    }
    this.setState({ selectedDate: date });
  };

  hasMoreThanOneFileAtRoot(files) {
    let filesAtRoot = 0;
    let firstDir;
    files.forEach(file => {
      if (!file.path.includes('/')) {
        filesAtRoot++;
      }
      const parts = file.path.split('/');
      if (!firstDir) {
        firstDir = parts[1];
      } else {
        if (filesAtRoot > 0) {
          return true;
        }
        if (firstDir !== parts[1]) {
          return true;
        }
      }
    });
    if (filesAtRoot > 1 || (filesAtRoot == 1 && firstDir)) {
      return true;
    }
    return false;
  }

  getCid = async () => {
    const { cid } = this.state;
    this.setState({ uploading: true });
    let size;
    try {
      const stat = await this.ipfs.object.stat(cid, { timeout: '30s' });
      // Pin to Infura for good measure
      this.ipfs.pin.add(cid);
      size = stat.CumulativeSize;
      console.log(stat);
    } catch (error) {
      let errorMessage;
      if (error.toString().includes('context deadline exceeded')) {
        errorMessage = 'File could not found within 30 seconds.';
      } else {
        errorMessage = error.toString();
      }
      toast.error(errorMessage);
      console.error(errorMessage);
      this.setState({ cid: '' });
    }
    if (size) {
      this.setState({ size, name: 'this file' });
    }
    this.setState({ uploading: false, step: 'date' });
  };

  upload = async files => {
    this.setState({ uploading: true });
    const progressHandler = progress => {
      console.log('Upload progress: ', progress);
    };
    const options = {
      progress: progressHandler,
      wrapWithDirectory: false
    };
    if (this.hasMoreThanOneFileAtRoot(files)) {
      console.log(
        'More than one file found at root. Will wrap uploaded files with directory.'
      );
      options.wrapWithDirectory = true;
    }
    let response;
    console.log([...files]);
    try {
      response = await this.ipfs.add([...files], options);
    } catch (error) {
      console.error(error);
    }
    if (!response) {
      console.error('No response data from upload.');
      this.setState({ uploading: false });
      return;
    }
    const parent = response[response.length - 1];
    const { path: name, hash: cid } = parent;
    const size = response.map(item => item.size).reduce((a, b) => a + b);
    this.setState({ name, cid, size, uploading: false, step: 'date' });
    // Refresh selectedDate
    this.setState({ selectedDate: addMonths(new Date(), 1) });
  };

  onDrop = async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length) {
      console.error('Rejected files: ', rejectedFiles);
    }
    if (!acceptedFiles) {
      console.error('No files accepted');
      return;
    }
    console.log('Accepted files: ', acceptedFiles);
    this.upload(acceptedFiles);
  };

  renderStep1() {
    const { classes } = this.props;
    const { showForm, uploading, step } = this.state;
    return (
      <React.Fragment>
        {uploading && (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress style={{ margin: '30px' }} />
          </div>
        )}
        {!uploading && (
          <React.Fragment>
            <div className={classes.dropzone}>
              <Dropzone onDrop={this.onDrop} />
            </div>
            <div>
              or...{' '}
              <Button
                color="primary"
                className={classes.button}
                onClick={() => this.setState({ showForm: !showForm })}
              >
                Use an existing Content Identifier
              </Button>
            </div>
            {showForm && (
              <div>
                <TextField
                  id="outlined-name"
                  label="IPFS Content Identifier (CID)"
                  onChange={this.handleChange('cid')}
                  className={classes.cidInput}
                  margin="normal"
                  variant="outlined"
                  onKeyPress={event => {
                    if (event.key === 'Enter') {
                      this.getCid();
                    }
                  }}
                />
                <div style={{ marginTop: 15 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      this.getCid();
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  blocksDuration = () => {
    const { selectedDate } = this.state;
    return parseInt((selectedDate - Date.now()) / 12.5);
  };

  offerDaiAmount = () => {
    const { price, size } = this.state;
    const amount = Number(price) * size * this.blocksDuration();
    return amount;
  };

  handleSliderChange = (event, newValue) => {
    this.setState({ replications: newValue });
  };

  renderStep2() {
    const {
      name,
      selectedDate,
      price,
      size,
      replications,
      cid,
      step
    } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <TextField
          label="IPFS Content Identifier (CID)"
          value={cid}
          margin="normal"
          className={classes.cidInput}
          style={{}}
          disabled
        />
        <Grid container>
          {step === 'date' && (
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.stepHeader}>
                When would you like to host {name || 'this directory'} until?
              </Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker"
                  label="Date"
                  format="MM/dd/yyyy"
                  value={selectedDate}
                  onChange={this.handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                  style={{ marginRight: 20 }}
                />
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="Time"
                  value={selectedDate}
                  onChange={this.handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time'
                  }}
                />
              </MuiPickersUtilsProvider>
              <p style={{ marginTop: 30 }}>{selectedDate.toString()}</p>
              <p style={{ marginTop: 30 }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    this.setState({ step: 'price' });
                  }}
                  style={{ marginRight: 15 }}
                >
                  Next: Set Price
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ step: 'cid' });
                  }}
                >
                  Previous: Set File
                </Button>
              </p>
            </Grid>
          )}
          {step === 'price' && (
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.stepHeader}>
                How much would you like to pay?
              </Typography>
              <div>
                <TextField
                  label="Price"
                  value={price}
                  onChange={this.handleChange('price')}
                  margin="normal"
                  helperText="Dai per byte per block"
                  style={{ width: 200, marginRight: 20 }}
                />
                <TextField
                  label="Size"
                  value={size}
                  margin="normal"
                  disabled
                  helperText="bytes"
                  style={{ width: 200 }}
                />
              </div>
              <div>
                <TextField
                  label="Duration (Blocks)"
                  helperText="Chosen in previous step"
                  value={this.blocksDuration()}
                  margin="normal"
                  disabled
                  style={{ width: 200, marginRight: 20 }}
                />
                <TextField
                  label="Total Dai Per Replication"
                  style={{ width: 200 }}
                  value={price * size * this.blocksDuration()}
                  margin="normal"
                  disabled
                />
              </div>
              {Number(price) < 0.00000001 && (
                <div className={classes.notificationContainer}>
                  <Notification
                    type="warning"
                    message="We recommend setting your price to at least 0.00000001 dai per byte per
            block, otherwise it may not be accepted by anyone in the market."
                  />
                </div>
              )}
              <p style={{ marginTop: 30 }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    this.setState({ step: 'replications' });
                  }}
                  style={{ marginRight: 15 }}
                >
                  Next: Set Replications
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ step: 'date' });
                  }}
                >
                  Previous: Set Date
                </Button>
              </p>
            </Grid>
          )}
          {step === 'replications' && (
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.stepHeader}>
                How many replications would you like?
              </Typography>
              <div>
                <Slider
                  value={replications}
                  onChange={this.handleSliderChange}
                  className={classes.slider}
                  max={10}
                  min={1}
                  marks={true}
                  valueLabelDisplay="on"
                  aria-labelledby="price-slider"
                />
              </div>
              {replications < 3 && (
                <div className={classes.notificationContainer}>
                  <Notification
                    type="warning"
                    message="We recommend at least 3 replications for high availability."
                  />
                </div>
              )}
              <p style={{ marginTop: 30 }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    this.setState({ step: 'create' });
                  }}
                  style={{ marginRight: 15 }}
                >
                  Next: Create Offer
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ step: 'price' });
                  }}
                >
                  Previous: Set Price
                </Button>
              </p>
            </Grid>
          )}
        </Grid>
        {step === 'create' && (
          <div>
            <TextField
              label="Total Dai"
              value={this.offerDaiAmount() * replications}
              className={classes.totalDai}
              margin="normal"
              helperText={`For ${replications} replications`}
              disabled
            />
            <p style={{ marginTop: 30 }}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {}}
                style={{ marginRight: 15 }}
              >
                Create Offer
              </Button>
              <Button
                onClick={() => {
                  this.setState({ step: 'replications' });
                }}
              >
                Previous: Set Replications
              </Button>
            </p>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { step } = this.state;
    return (
      <React.Fragment>
        {step === 'cid' && this.renderStep1()}
        {step !== 'cid' && this.renderStep2()}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(withStyles(styles)(NewOffer));
