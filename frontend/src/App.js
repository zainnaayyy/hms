import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomeLayout from './layout/HomeLayout';
import CustomerDashboard from './layout/CustomerDashboard';
import HotelDashboard from './layout/HotelDashboard';
import { ThemeProvider } from '@material-ui/core/styles';
import { io } from "socket.io-client";

import Topbar from './components/Topbar';
import Footer from './components/Footer';
import UserSigninScreen from './screens/UserSigninScreen';
import CustomerSignupScreen from './screens/CustomerSignupScreen';
import HotelSignupScreen from './screens/HotelSignupScreen';
import HotelProfileScreen from './screens/HotelProfileScreen';
import HotelMoreInfoScreen from './screens/HotelMoreInfoScreen';
import Messenger from './screens/Messenger';
import Room from './screens/Room';

import theme from './theme/theme';
import ResultsLayout from './layout/ResultsLayout';
import ScheduleReservationScreen from './screens/ScheduleReservationScreen';
import { useEffect, useState } from 'react';

function App() {
  const user = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  const [socket, setSocket] = useState(false);

  useEffect(() => {
    if (user)
      setSocket(io("ws://localhost:8900"));
  }, []);

  useEffect(() => {
    if (user && socket)
      socket?.emit("addUser", user._id);
  }, [user, socket]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Topbar sticky responsive socket={socket} />
            <HomeLayout />
            < Footer />
          </Route>
          <Route path="/signin">
            <Topbar />
            <UserSigninScreen />
            < Footer />
          </Route>
          <Route path="/customers/signup">
            <Topbar sticky />
            <CustomerSignupScreen />
            < Footer />
          </Route>
          <Route path="/hotels/signup">
            <Topbar sticky />
            <HotelSignupScreen />
            < Footer />
          </Route>
          <Route path="/hotels/profile">
            <Topbar sticky socket={socket} />
            <HotelProfileScreen />
            < Footer />
          </Route>
          <Route path="/hotels/moreinfo">
            <Topbar />
            <HotelMoreInfoScreen />
            < Footer />
          </Route>
          <Route path="/hotels/dashboard">
            <HotelDashboard socket={socket} />
            <Footer crop />
          </Route>
          <Route path="/customers/dashboard">
            <CustomerDashboard socket={socket} />
            <Footer crop />
          </Route>
          <Route path="/messenger">
            <Topbar sticky responsive color="#00b0ff" />
            <Messenger />
          </Route>
          <Route path="/results">
            <Topbar sticky responsive socket={socket} />
            <ResultsLayout />
            <Footer />
          </Route>
          <Route path="/schedule">
            <Topbar sticky responsive socket={socket} />
            <ScheduleReservationScreen />
            <Footer />
          </Route>
          <Route path="/room">
            <Room />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
