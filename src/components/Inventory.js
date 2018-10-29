import React from 'react';
import PropTypes from "prop-types";
import AddFishForm from './AddFishForm';
import EditFishForm from './EditFishForm';
import Login from './Login'
import base, { firebaseApp } from "../base";
import firebase from 'firebase';

class Inventory extends React.Component {
  static propTypes = {
    fishes: PropTypes.object,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    loadSampleFishes: PropTypes.func
  };

  state = {
    uid:null,
    owner:null
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.authHandler({ user });
      }
    })
  }

  authHandler = async (authData)=> {
    // 1. get current store info from firebase
    const store = await base.fetch(this.props.storeId, { context:this} );
    // 2. claim it if no owner
    if(!store.owner){
      // save as our own
      await base.post (`${this.props.storeId}/owner`,{
        data: authData.user.uid
      }) 
    }
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid
    })
  }

  authenticate = provider => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler)
  };

  logout = async() => {
    console.log('Logging Out');
    await firebase.auth().signOut();
    this.setState({uid: null} )
  }

  render() {
    const logout = <button onClick={this.logout}>Log Out</button>

    // check if logged in
    if (!this.state.uid){
      return <Login authenticate={this.authenticate } />;
    }

    // check if current user is not owner of the store
     if (this.state.uid !== this.state.owner){
       return( 
          <div>
         <p>Sorry you are not the owner</p>
         { logout }
          </div>)
       
     }
  
    return (
      <div className="inventory">
        <h2>Inventory</h2>

        {logout}

        {Object.keys(this.props.fishes).map(key => (
          <EditFishForm
            key={key}
            index={key}
            fish={this.props.fishes[key]}
            updateFish={this.props.updateFish}
            deleteFish={this.props.deleteFish}
          />
        ))}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSampleFishes}>
          Load Sample Fishes
        </button>
      </div>
    );
  }
}

export default Inventory;