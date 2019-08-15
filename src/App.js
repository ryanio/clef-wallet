import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import configureStore from './store/configureStore';
import Dashboard from './Dashboard';
import Account from './Account';
import Settings from './Settings';
import StatusLine from './components/StatusLine';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

const { store, persistor } = configureStore();

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
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <div className="App">
            <Router>
              <header className="App-header">
                <Container>
                  <Link to="/">
                    <h1>clef wallet</h1>
                  </Link>
                  <Link to="/settings">
                    <IconButton aria-label="settings">
                      <SettingsIcon classes={{ root: classes.headerIcon }} />
                    </IconButton>
                  </Link>
                </Container>
              </header>
              <main>
                <Container>
                  <StatusLine />
                  <Route exact path="/" component={Dashboard} />
                  <Route path={`/accounts/:address`} component={Account} />
                  <Route path="/settings" component={Settings} />
                </Container>
              </main>
              <ToastContainer />
            </Router>
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default withStyles(styles)(App);
