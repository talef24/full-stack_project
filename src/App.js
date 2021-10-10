import './App.css';
import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import ApplicationBar from "./components/general/ApplicationBar";
import AccountScreen from "./components/screens/AccountScreen";
import AdminScreen from "./components/screens/AdminScreen";
import BuildPackageScreen from "./components/screens/BuildPackageScreen";
import CartScreen from "./components/screens/CartScreen";
import CheckOutScreen from "./components/screens/CheckOutScreen";
import FilterPackagesScreen from "./components/screens/FilterPackagesScreen";
import LoginScreen from "./components/screens/LoginScreen";
import MainScreen from "./components/screens/MainScreen";
import MakeItPersonalScreen from "./components/screens/MakeItPersonalScreen";
import PageNotFound from "./components/screens/informative_screens/PageNotFound";
import RegistrationScreen from "./components/screens/RegistrationScreen";
import SelectedPackagesScreen from "./components/screens/SelectedPackagesScreen";
import SessionExpired from "./components/screens/informative_screens/ActivityExpiredPage";
import ServiceUnavailable from "./components/screens/informative_screens/ServiceUnavailablePage";
import sendReqToServer from "./siteGlobalActions/sendReqToServer";

class App extends React.Component{
    constructor(props) {
        super(props);
        this.onUserLoggedIn = this.onUserLoggedIn.bind(this);
        this.onUserLoggedOut = this.onUserLoggedOut.bind(this);
        this.initializeState = this.initializeState.bind(this);
        this.state={
            isLoggedIn: false,
            isAdmin: false,
            isStateInit: false
        }
        this.initializeState();
    }

    async initializeState() {
        await this.setState({isStateInit: false});
        const fetchResult = await sendReqToServer("/getLogin", "GET");
        if(fetchResult.ok) {
            await this.setState({isLoggedIn: fetchResult.data.isLoggedIn});
            await this.setState({isAdmin: fetchResult.data.isAdmin});
            await this.setState({isStateInit: true});
        }
    }

    onUserLoggedIn(isAdmin) {
        this.setState({isLoggedIn: true});
        this.setState({isAdmin: isAdmin});
    }

    async onUserLoggedOut(props) {
        await this.setState({isStateInit: false});
        const fetchResult = await sendReqToServer("/logout", "POST");
        if(fetchResult.ok) {
            await this.initializeState();
        }
    }

    routerNotLoggedIn() {
        const regexPageNotFound = /\/\b(?!(login|register|serviceUnavailable)\b)\w+/; //Works also for "/"
        return (
            <Router>
                <Route
                    exact path='/'
                    render={() =>
                        <LoginScreen {...this.props} onLoggedIn={(isAdmin) => this.onUserLoggedIn(isAdmin)}/>
                    }
                />
                {/* Path='/login' for redirect from pageNotFound */}
                <Route
                    path='/login'
                    render={() =>
                        <LoginScreen {...this.props} onLoggedIn={(isAdmin) => this.onUserLoggedIn(isAdmin)}/>
                    }
                />
                <Route path='/register' component={RegistrationScreen} />
                <Route
                    path='/serviceUnavailable'
                    render={() =>
                        <ServiceUnavailable {...this.props} refreshSiteRouter={this.initializeState}/>
                    }
                />
                {/* For each other path - page not found */}
                <Route path={regexPageNotFound} component={PageNotFound} />
            </Router>
        )
    }

    routerLoggedIn() {
        return (
            <Router>
                <ApplicationBar
                    isAdmin={this.state.isAdmin}
                    onLogout={(props) => this.onUserLoggedOut(props)}
                />
                <Switch>
                    <Route exact path='/' component={MainScreen} />
                    <Route path={'/mainScreen'} component={MainScreen} />
                    <Route path={'/searchPackage/:input'} component={MainScreen} />
                    <Route path='/cartScreen' component={CartScreen} />
                    <Route path={'/makeItPersonal/:id'} component={MakeItPersonalScreen} />
                    <Route path={'/filterPackage'} component={FilterPackagesScreen} />
                    <Route path={'/SelectedPackagesScreen'} component={SelectedPackagesScreen} />
                    <Route path={'/buildPackage'} component={BuildPackageScreen} />
                    <Route path='/accountScreen' component={AccountScreen} />
                    <Route path='/payment' component={CheckOutScreen} />
                    <Route path='/admin' component={this.state.isAdmin ? AdminScreen : PageNotFound} />
                    <Route path='/logout' component={LoginScreen} />
                    <Route
                        path='/activityExpired'
                        render={() =>
                            <SessionExpired {...this.props} onActivityExpired={this.initializeState}/>
                        }
                    />
                    <Route
                        path='/serviceUnavailable'
                        render={() =>
                            <ServiceUnavailable {...this.props} refreshSiteRouter={this.initializeState}/>
                        }
                    />
                    {/* HAS TO BE LAST - For each other path - page not found */}
                    <Route
                        render={(props) => <PageNotFound {...props}/>}
                    />
                    {/* HAS TO BE LAST */}
                </Switch>
            </Router>
        )
    }

    render() {
        if(this.state.isStateInit) {
            if(this.state.isLoggedIn === false) {
                return this.routerNotLoggedIn();
            } else {
                return this.routerLoggedIn();
            }
        } else {
            return (
                <Router>
                    <Route
                        exact
                        path='/'
                        render={() =>
                            <ServiceUnavailable {...this.props} refreshSiteRouter={this.initializeState}/>
                        }
                    />
                    <Route
                        path='/serviceUnavailable'
                        render={() =>
                            <ServiceUnavailable {...this.props} refreshSiteRouter={this.initializeState}/>
                        }
                    />
                </Router>
            )
        }
    }
}

export default App;
