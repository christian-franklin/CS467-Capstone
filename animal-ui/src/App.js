import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AnimalProfile from './components/AnimalProfile';
import AnimalList from './components/AnimalList';


const App = () => (
  <Router>
    <div>

      {/* Other routes */}
      
      <Route path='/' exact component={AnimalList} />
      <Route path='/animals/:id' component={AnimalProfile} />

    </div>
  </Router>
);

export default App;
