import React, { Component } from 'react';

class Card extends Component {
    constructor(props) {
        super(props);
    }
    render() { 
        return ( 
            <img
                src = {this.props.image}
                alt = {this.props.name}
                key = {this.props.id}
            /> 
        );
    }
}
 
export default Card;