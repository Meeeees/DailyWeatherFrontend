import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Components/Main.jsx'
import styles from './styles/main.module.css';
import BackgroundImage from './assets/background.jpg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }
  render() {
    return (
      <div className={styles.main} style={{ backgroundImage: `url(${BackgroundImage})` }}>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/success" element={<>
              <h1>Success</h1>
              <p>An email has been send to the email you entered, please verify your email by clicking on the link. </p>
            </>} />
          </Routes>
        </Router>
      </div>




    );
  }

}

export default App;
