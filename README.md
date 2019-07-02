Quick way to build and deploy a complete react app with a backend and a mlab mongoDb database connected
on Windows

create a new project : 

```
mkdir newproject
cd newproject
npm init -y
npm add express
type nul > index.js
```

Edit index.js : 
```
const express = require('express');
const path = require('path');
const app = express();
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('properties.ini');
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
var MongoClient = require('mongodb').MongoClient;
let collection = []
var url = properties.get('mongo.url');


const dbName='test'

MongoClient.connect(url, function(err, client) {
    console.log("Connected correctly to server");
    if (err){console.log(err);}
    collection = client.db(dbName);

})

app.get('/api/users', (req, res) => {
  collection.find().toArray(function(err, docs) {
    res.json(docs)
  })
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
```



Edit package.json at the root to add : 
```
"scripts": {
    "start": "node index.js",
    "heroku-postbuild": "cd client && npm install && npm run build"
  }
```

Create the react app : 
`create-react-app client`

Edit package.json in the client app :
`"proxy": "http://localhost:5000"`

Edit the app.js of the client app : 
```
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  // Initialize state
  state = {users : []}

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
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
```

Create a git folder et commit : 
```
git init
echo node_modules > .gitignore
git add .
git commit -m "Initial commit"
```


Deploy on heroku

```
heroku create
git push heroku master
```
visit the url given from the bash (it shouldnt work), then connect to your account heroku and the page attributed to this new project (the name of the project is the same as the one given in the url, it is generated automatically)


In heroku, Add an add-on (mLab mongodb). Create a collection called 'test' and inside simple elements :
 
```
[
 {"_id":"5ce5815efb6fc01bf23a75e7","username":"toto"},
 {"_id":"5ce70d8ffb6fc01bf23b5bc1","username":"titi"}
]
```

In your project create at the root a properties.ini file and add the url of your database inside (could be found in heroku in the last tab in the var revealed): 
```
mongo.url = <url de votre base de données>
```
No quote should be used, just plain text

Commit and push 
```
git add .
git commit -m "second commit"
git push heroku master
```

## Go further 
If you want to post request to add an object (data) to your database (you can have a look of you database in heroku, by clicking on the mLab plugin of your project) 

 - server side : 

```
app.post('/api/create',(req, res) => {
  collection.insert(req.body)
  res.send('successfully added to your database');
})

```
- client side :

```
  async add(data){
    const headers = new Headers()
    headers.append('Content-Type','application/json')
    headers.append('Access-Control-Allow-Origin','*')
    headers.append('Access-Control-Allow-Method','*')
    headers.append('Access-Control-Allow-Headers','*')
    headers.append('Accept','application/json')
    const options = {
      method : 'POST',
      headers,
      body: JSON.stringify(data),
    }
   
    const request = new Request ('http://localhost:5000/api/create',options)
    fetch(request)
      .then(res=> console.log(res.body))
  }

```

Make sure you have this line in your server-side file to be able to parse json, otherwise your req.body will be considered as empty

```
app.use(bodyParser.json())

```

For any modification in your server side file, reload the server in your cmd (exit the program and launch again npm start) if you want your modifications to be effective
