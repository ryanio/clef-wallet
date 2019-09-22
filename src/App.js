import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import configureStore from './store/configureStore';
import Home from './components/Home';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from './theme';

const { store, persistor } = configureStore();

const styles = {
  headerLogoContainer: {
    float: 'right'
  },
  headerLogo: {
    height: 50,
    width: 'auto',
    margin: 10
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
          <MuiThemeProvider theme={theme}>
            <div className="app">
              <Router>
                <header className="app-header">
                  <Container>
                    <Link to="/">
                      <h1>IPFS Pin Market</h1>
                    </Link>
                    <div className={classes.headerLogoContainer}>
                      <img
                        className={classes.headerLogo}
                        src="/logos/ethereum.png"
                      />
                      <img
                        className={classes.headerLogo}
                        src="/logos/ipfs.svg"
                      />
                      <img
                        className={classes.headerLogo}
                        src="/logos/ipfs.svg"
                      />
                      <img
                        className={classes.headerLogo}
                        src="/logos/ipfs.svg"
                      />
                    </div>
                    {/* <Link to="/settings">
                    <IconButton aria-label="settings">
                      <SettingsIcon classes={{ root: classes.headerIcon }} />
                    </IconButton>
                  </Link> */}
                  </Container>
                </header>
                <main>
                  <Container>
                    <Route exact path="/" component={Home} />
                  </Container>
                </main>
                <ToastContainer />
                <footer className="app-footer" />
              </Router>
            </div>
          </MuiThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default withStyles(styles)(App);
