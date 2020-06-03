import React, { Fragment } from 'react'
import Head from 'next/head'
import App from 'next/app';
import Sidebar from '../components/sidebar';
import Router from 'next/router';
import Navbar from '../components/navbar';
import { Content, Body } from '../components/Utils';
import { AUTH } from '../services/auth';
import { getAuth, authsActionsTypes } from '../storage/actions/authsActions';
import { app } from '../env.json';

// config redux
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import initsStore from '../storage/store';
import Show from '../components/show';

// config router
Router.onRouteChangeStart = () => {
  let pageChange = document.getElementById('page_change');
  pageChange.className = 'page_loading';
};

Router.onRouteChangeComplete = () => {
  let pageChange = document.getElementById('page_change');
  pageChange.className = 'page_end';
};

Router.onRouteChangeError = () => {
  let pageChange = document.getElementById('page_change');
  pageChange.className = 'page_end';
};


class MyApp extends App {

  static getInitialProps = async ({ Component, ctx, store }) => {
    let pageProps = {};
    // obtener auth
    let isLoggin = await AUTH(ctx) ? await AUTH(ctx) : "";
    // ejecutar initial de los children
    if (await Component.getInitialProps) {
      if (isLoggin) {
        await ctx.store.dispatch(getAuth(ctx));
      } else {
        await ctx.store.dispatch({ type: authsActionsTypes.LOGOUT });
      }
      // props
     try {
        pageProps = await Component.getInitialProps(ctx)
        let { user } = await ctx.store.getState().auth
        pageProps.auth = user;
        pageProps.isLoggin = isLoggin;
        // page
        return { pageProps, store, isLoggin };
     } catch (error) {
        if (ctx && ctx.res) {
          ctx.res.writeHead(301, { location: '/404' });
          ctx.res.end();
          ctx.finished = true;
        }
     }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      screenY: 0,
      screenX: 0
    }
  }

  componentDidMount = () => {
    this.handleScreen();
    window.addEventListener('resize', this.handleScreen);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleScreen);
  }

  componentDidCatch = (error, info) => {
    // Router.push({ pathname: "/error", query: { error: error }});
  }

  handleScreen = () => {
    this.setState({ screenX: window.innerWidth, screenY: window.innerHeight });
  }

  handleToggle = async () => {
    await this.setState(state => ({ toggle: !state.toggle }));
  }

  capitalize(word) {
    if (word)  return "- " + word[0].toUpperCase() + word.slice(1);
    return null;
  }
  
  render() {
    const { Component, pageProps, store, isLoggin } = this.props

    let paths = typeof location == 'object' ? location.pathname.split('/') : [];
    let titulo = paths[paths.length == 0 ? 0 : paths.length - 1];

    return  <Fragment>
      <Provider store={store}>
        <Head>
          <meta charSet="utf-8"></meta>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>
          {/* <meta http-equiv="Content-Security-Policy" content="default-src 'self' *:*; style-src https://* http://*;"></meta> */}
          <title>{app.name} {this.capitalize(titulo)}</title>
          <link rel="shortcut icon" href="/img/logo-unu.png"></link>
          <meta name="theme-color" content="#3063A0"></meta>
          <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,600,700,900" rel="stylesheet" type="text/css" />
          <link rel="stylesheet" href="/css/open-iconic-bootstrap.min.css" />
          <link rel="stylesheet" href="/css/all.css" />
          <link rel="stylesheet" href="/css/buttons.bootstrap4.min.css"></link>
          <link rel="stylesheet" href="/css/flatpickr.min.css" />
          <link rel="stylesheet" href="/css/theme.min.css" data-skin="default" />
          <link rel="stylesheet" href="/css/theme-dark.min.css" data-skin="dark" disabled={true} />
          <link rel="stylesheet" href="/css/custom.css" />
          <link rel="stylesheet" href="/css/skull.css" />

          <script src="/js/jquery.min.js"></script>
          <script src="/js/popper.min.js"></script>
          <script src="/js/bootstrap.min.js"></script>
          {/* production */}
          <Show condicion={app.env == 'production'}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css" />
          </Show>
          {/* develoment */}
          <Show condicion={app.env == 'local'}>
            <link rel="stylesheet" href="/css/semantic-ui.css" />
          </Show>
          <link rel="stylesheet" href="/css/page_loading.css" />

          {/* WPA */}
          <link rel="manifest" href="/manifest.json" />
          <link href='/favicon-16x16.png' rel='icon' type='image/png' sizes='16x16' />
          <link href='/favicon-32x32.png' rel='icon' type='image/png' sizes='32x32' />
          <link rel="apple-touch-icon" href="/apple-icon.png"></link>
          <meta name="theme-color" content="#346cb0"/>

          {/* {auth_token ? <script src="/js/pace.min.js"></script> : ''} */}

          <script src="/js/stacked-menu.min.js"></script>
          {/* <script src="/js/perfect-scrollbar.min.js"></script> */}
          {/* <script src="/js/flatpickr.min.js"></script> */}
          {/* <script src="/js/jquery.easypiechart.min.js"></script> */}
          {/* <script src="/js/Chart.min.js"></script> */}
          <script src="/js/theme.min.js"></script>

          <script data-ad-client="ca-pub-6166160936934803" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        </Head>

        <div id="page_change"></div>

        {
          isLoggin ?
            <Fragment>
              <div className="full-layout" id="main">
                <div className="gx-app-layout ant-layout ant-layout-has-sider">
                  <div className="ant-layout">
                    <Navbar onToggle={this.handleToggle} toggle={this.state.toggle}/>
                    <div className="gx-layout-content ant-layout-content">
                      <div className="gx-main-content-wrapper">
                      <Sidebar onToggle={this.handleToggle} toggle={this.state.toggle}/>
                        <Content>
                            <Component {...pageProps} {...this.state}/>
                        </Content>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`aside-backdrop ${this.state.toggle ? 'show' : ''}`}
                onClick={this.handleToggle}
              />
            </Fragment>
          : <Component {...pageProps}/>
        }
      
      </Provider>

    </Fragment>
  }
}

export default withRedux(initsStore)(MyApp);