import React from 'react';
import PropTypes from "prop-types";

import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component{
  state = {
    fishes: {},
    order: {}
  };

  static propTypes = {
    match: PropTypes.object
  }

  componentDidMount(){
    const { params } = this.props.match;
    // first reinstate localstorage
    const localStorageRef = localStorage.getItem(params.storeId);
    if(localStorageRef){
      this.setState({ order: JSON.parse(localStorageRef) })
    }
    this.ref= base.syncState(`${params.storeId}/fishes`,
    {context:this,
    state:'fishes'})
  }

  componentDidUpdate(){
    localStorage.setItem(this.props.match.params.storeId,JSON.stringify(this.state.order));
  }

  componentWillUnmount(){
    base.removeBinding(this.ref);
  }

  addFish = fish => {
    // Take a copy of existing state
    const fishes = { ...this.state.fishes };
    // add the new fish to fishes variable
    fishes[`fish${Date.now()}`] = fish;
    // set new fishes object
    this.setState({
      fishes: fishes
    });
  };

  updateFish = (key,updatedFish) => {
    // take a copy of current state
    const fishes = { ...this.state.fishes };
    // update the state
    fishes[key] = updatedFish;
    // set to state
    this.setState({ fishes });
  }

  deleteFish = (key) => {
    // take a copy of current state
    const fishes = { ...this.state.fishes };
    // update the state need to use null because sync to Firebase
    fishes[key] = null
    // set new state
    this.setState({ fishes })
  }


  loadSampleFishes = () => {
    this.setState({ fishes: sampleFishes})
  };

  addToOrder = (key) =>{
    // take a copy of current state
    const order = { ...this.state.order };
    // either add to order or update the number in the order
    order[key] = order[key] + 1 || 1;
    // call setState to update order
    this.setState({order});
  };

  removeFromOrder = (key) => {
    // taking a copy of order state
    const order = { ...this.state.order }
    // remove from order state can you delete because localStorage
    delete order[key];
    // update order state
    this.setState({order}) 
  }

  render(){
    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key=>
            <Fish 
            key={key} 
            index={key}
            details = {this.state.fishes[key]} 
            addToOrder = {this.addToOrder}
            />)}
          </ul>
        </div>
          <Order 
              fishes={this.state.fishes}
              order={this.state.order}
              removeFromOrder = {this.removeFromOrder}
          />
          <Inventory 
          addFish={this.addFish} 
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes = {this.loadSampleFishes}
          fishes = {this.state.fishes}
           />
        
      
      </div>
    )
  }
}

export default App;