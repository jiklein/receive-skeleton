import React, {Component} from 'react';
import './App.css';

class Application extends Component {

  // Define state
  state = {
    display: "",
    uid: "",
    receipts: "",
    index: ""
  };

  constructor(props) {
    super(props);
    this.redirectCustomerSignUp = this.redirectCustomerSignUp.bind(this);
    this.redirectStoreSignUp = this.redirectStoreSignUp.bind(this);
    this.redirectLogIn = this.redirectLogIn.bind(this);
    this.redirectCustomerHome = this.redirectCustomerHome.bind(this);
    this.redirectStoreHome = this.redirectStoreHome.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleViewAll = this.handleViewAll.bind(this);
    this.handleViewOne = this.handleViewOne.bind(this);
    this.handleCustomerSignUp = this.handleCustomerSignUp.bind(this);
    this.handleStoreSignUp = this.handleStoreSignUp.bind(this);
    this.handleAddReceipt = this.handleAddReceipt.bind(this);
    this.redirectAllReceipts = this.redirectAllReceipts.bind(this);
  }

  /**
   * Sets initial page.
   */
  componentDidMount() {
    this.redirectLogIn();
  }

  /**
   * Verifies that the username and password are correct.
   */
  handleLogIn(event) {
    event.preventDefault();
    const { email, password } = event.target.elements;
    fetch(`http://receive-server.herokuapp.com/getuid?username=${email.value}&password=${password.value}`)
      .then(response => response.json())
      .then(response => {
        this.setState({
          uid: response.data
        });
        if (this.state.uid.charAt(0) == 'C') {
          this.redirectCustomerHome();
        } else if (this.state.uid.charAt(0) == 'S') {
          this.redirectStoreHome();
        } else {
          alert("Incorrect username or password");
        }
      })
      .catch(err => alert(err));
  }

  /**
   * Adds a customer to the database.
   */
  handleCustomerSignUp(event) {
    event.preventDefault();
    const { email, password } = event.target.elements;
    fetch(`http://receive-server.herokuapp.com/addcustomer?username=${email.value}&password=${password.value}`)
      .then(response => response.json())
      .then(response => {
        alert(response.data);
      })
      .catch(err => console.error(err))
  }

  /**
   * Adds a store to the database.
   */
  handleStoreSignUp(event) {
    event.preventDefault();
    const { username, password, bid, name, address } = event.target.elements;
    var storeInfo = {
      username: username.value,
      password: password.value,
      address: address.value,
      name: name.value,
      bid: bid.value
    }
    fetch(`http://receive-server.herokuapp.com/addstore?info=${JSON.stringify(storeInfo)}`)
      .then(response => response.json())
      .then(response => {
        alert(response.data);
      })
      .catch(err => console.error(err))
  }

  /**
   * Adds a store to the database.
   */
  handleAddReceipt(event) {
    event.preventDefault();
    const { cid, ite, price } = event.target.elements;
    var items1 = [];
    var prices = [];

    items1.push(ite.value);
    prices.push(price.value);

    alert(items1);
    var receiptInfo = {
      cid: cid.value,
      sid: this.state.uid,
      items: items1,
      prices: prices,
    }

    fetch(`http://receive-server.herokuapp.com/addreceipt?info=${JSON.stringify(receiptInfo)}`)
      .then(response => response.json())
      .then(response => {
        alert(response.data);
      })
      .catch(err => console.error(err))
  }

  /**
   * Gets all receipts from database.
   */
  handleViewAll(event) {
    event.preventDefault();
    fetch(`http://receive-server.herokuapp.com/getallreceipts?cid=${this.state.uid}`)
      .then(response => response.json())
      .then(response => {
        this.setState({
          receipts: response.data
        });
        this.redirectAllReceipts();
      })
      .catch(err => alert(err));
  }

  /**
   * Gets a single receipt from database.
   */
  handleViewOne(event) {
    event.preventDefault();
  }

  /************************* DISPLAY FUNCTIONS ********************************/

  /**
   * This function redirects to the login page.
   */
  redirectAllReceipts(event) {

    var objects = this.state.receipts;

    this.setState({
      display:

      <div className="centered">
      <div>
      {objects.map(function(object, i){
        return <div><button id={i}>{object.business + " " +
          object.date}</button><br /></div>;
      })}
      </div>
      </div>
    });
  }

  /**
   * This function redirects to the login page.
   */
  redirectCustomerHome(event) {
    this.setState({
      display:

      <div className="centered"><div>{this.state.uid}<br />
      <button onClick={this.handleViewAll}>View Receipts</button></div>
      </div>
    });
  }

  /**
   * This function redirects to the login page.
   */
  redirectStoreHome(event) {
    this.setState({
      display:

      <div className="centered"><br />
      <div>
      <h1>Log Receipt</h1>
      <form onSubmit={this.handleAddReceipt}>
      <label>
      CID
      <input name="cid" placeholder="Ex. C12345678" />
      </label><br/>
      <label>
      Item
      <input name="ite" placeholder="Ex. Burrito" />
      </label><br/>
      <label>
      Price
      <input name="price" placeholder="Ex. 7.00" />
      </label><br/>
      <button type="submit">Submit</button>
      </form>
      <button onClick={this.redirectLogIn}>Log In</button>
      </div>
      </div>
    });
  }
  /**
   * This function redirects to the login page.
   */
  redirectLogIn(event) {
    this.setState({
      display:

      <div className="centered">
      <div className="row">
      <h1>Log In</h1>
      <form onSubmit={this.handleLogIn} >
      <label>
      Email
      <input name="email" placeholder="Email" />
      </label><br />
      <label>
      Password
      <input name="password" type="password" placeholder="Password" />
      </label><br />
      <button type="submit">Log In</button><br />
      <button onClick={this.redirectCustomerSignUp}>Customer Sign UP</button><br />
      <button onClick={this.redirectStoreSignUp}>Store Sign UP</button>
      </form>
      </div>
      </div>
    });
  }

  /**
   * This function redirects to the login page.
   */
  redirectCustomerSignUp(event) {
    this.setState({
      display:

      <div className="centered">
      <h1>Sign Up</h1>
      <form onSubmit={this.handleCustomerSignUp}>
      <label>
      Email
      <input name="email" placeholder="Email" />
      </label>
      <label>
      Password
      <input name="password" type="password" placeholder="Password" />
      </label>
      <button type="submit">Sign Up</button>
      </form>
      <button onClick={this.redirectLogIn}>Log In</button>
      </div>
    });
  }

  /**
   * This function redirects to the login page.
   */
  redirectStoreSignUp(event) {
    this.setState({
      display:

      <div className="centered">
      <div>
      <h1>Sign Up</h1>
      <form onSubmit={this.handleStoreSignUp}>
      <label>
      Username
      <input name="username" placeholder="Username" />
      </label><br/>
      <label>
      Password
      <input name="password" type="password" placeholder="Password" />
      </label><br/>
      <label>
      BID
      <input name="bid" placeholder="Ex. B12345678" />
      </label><br/>
      <label>
      Name
      <input name="name" placeholder="Ex. Chipotle" />
      </label><br/>
      <label>
      Location
      <input name="address" placeholder="Ex. 123 Villa La Jolla Dr, La Jolla, CA, 92037" />
      </label><br/>
      <button type="submit">Sign Up</button>
      </form>
      <button onClick={this.redirectLogIn}>Log In</button>
      </div>
      </div>
    });
  }

  /**
   * Render method.
   */
  render(){
    return(<div>{this.state.display}</div>);
  }
}

export default Application;
