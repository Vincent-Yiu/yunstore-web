import React from 'react';
import './App.css';
import './config';
import BasicRoute from './router/router';

class App extends React.Component
{
  // constructor(props)
  // {
  //   super(props);
  // }

  render()
  {
    
    return (
        <div id ="App" className='App'>
          <BasicRoute></BasicRoute>
        </div>
    );
  }
}

export default App;
