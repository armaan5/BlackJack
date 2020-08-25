import React, { Component } from 'react';
import './Card.css'
class Card extends Component {
    constructor(props) {
        super(props);
        
    }
    render() { 
        return ( 
            <img className = "playing-card"
                src = {this.props.image}
                alt = {this.props.name}
                key = {this.props.id}
            /> 
        );
    }
}
 
export default Card;