import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import Dashboard from './Dashboard';
import StatusLine from './Components/StatusLine';
import './App.css';

const styles = {
  headerIcon: {
    color: '#ccc'
  },
  statusBox: {
    marginBottom: 10
  },
  layersIcon: {
    fontSize: 16,
    marginLeft: 4,
    marginRight: 4,
    verticalAlign: 'middle'
  },
  statusIcon: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: 'green',
    display: 'inline-block',
    marginRight: 7
  }
};

class App extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <Container>
            <h1>clef wallet</h1>
            <IconButton aria-label="settings">
              <SettingsIcon classes={{ root: classes.headerIcon }} />
            </IconButton>
          </Container>
        </header>
        <main>
          <Container>
            <StatusLine />
            <Dashboard />
          </Container>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);
