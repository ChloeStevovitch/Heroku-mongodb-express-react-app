import React, { Component } from 'react';
import './App.css';

class App extends Component {
  // Initialize state
  state = {users : []}

  // Fetch passwords after first mount
  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    // Get the passwords and store them in state
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({ users }))
  }

  render() {

    return (
      <div className="App">
        {/* Render the passwords if we have them */}
        {this.state.users.length ? (
          <div>
            <h1>Users : </h1>
            <ul className="users">
              {this.state.users.map((item) =>
                <li id={item._id}>
                  {item.username}
                </li>
              )}
            </ul>
            <button
              className="more"
              onClick={this.getUsers}>
              Get Users
            </button>
          </div>
        ) : (
          // Render a helpful message otherwise
          <div>
            <h1>No users :(</h1>
            <button
              className="more"
              onClick={this.getUsers}>
              Try Again?
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default App;