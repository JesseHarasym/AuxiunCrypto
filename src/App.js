import React from "react";
import "./App.css";
import NavBar from "./components/navbar/navbar";
import Content from "./components/Content/content";

function App() {
  const [loggedIn, setLoginStatus] = React.useState(false);
  const [user, setUser] = React.useState([]);
  const [home, setHome] = React.useState(true);

  const handleNewUser = (userInfo) => {
    setUser(userInfo.response.data);
    setLoginStatus(true);
  };

  const handleUpdateBalance = (newBalance) => {
    console.log("newBalance", newBalance);
    const updatedUser = {
      user: {
        authKey: user.authKey,
        success: user.success,
        user: {
          _id: user.user._id,
          coinbalance: newBalance,
          createdAt: user.user.createdAt,
          firstname: user.user.firstname,
          lastname: user.user.lastname,
          password: user.user.password,
          updatedAt: user.user.updatedAt,
          username: user.user.username
        }
      }
    };
    setUser(updatedUser.user);
  };

  //toggles between Home and Marketplace
  const handleSetHome = () => {
    setHome(true);
  };

  const handleSetMarketplace = () => {
    setHome(false);
  };

  return (
    <div className="App">
      <NavBar
        user={user}
        loggedIn={loggedIn}
        handleSetHome={() => handleSetHome()}
        handleSetMarketplace={() => handleSetMarketplace()}
      ></NavBar>
      <br />
      <Content
        handleNewUser={(userInfo) => handleNewUser(userInfo)}
        handleUpdateBalance={(newBalance) => handleUpdateBalance(newBalance)}
        user={user}
        loggedIn={loggedIn}
        home={home}
        handleSetHome={() => handleSetHome}
      />
    </div>
  );
}

export default App;
