import React, { Component } from 'react';
import axios from "axios";
import Card from './Card';
const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

class Hand extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            deck: null, 
            hand: [],
            handValue: 0,
            dealer: [],
            dealerValue: 0
        }
        this.drawCard = this.drawCard.bind(this);
        this.computeHandValue = this.computeHandValue.bind(this);
    }

    computeHandValue(hand) {
        let cardValue = 0;
        for(let i = 0; i < hand.length; i++){
            if( !hand[i].value.localeCompare("ACE") )
                if((this.state.handValue + 11) < 21)
                    cardValue += 11;
                else
                    cardValue += 1;
            else if( !hand[i].value.localeCompare("QUEEN") || !hand[i].value.localeCompare("KING") || !hand[i].value.localeCompare("JACK"))
                cardValue += 10;
            else {
                cardValue += parseInt(hand[i].value); 
            }
        }
        return cardValue;
    }

    async componentDidMount() {
        let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
        let id = deck.data.deck_id;
        let cardURL = `${API_BASE_URL}/${id}/draw/?count=2`;
        let cardRes = await axios.get(cardURL);

        console.log(cardRes.data);

        let firstHand = cardRes.data.cards.map(c => ({
            id: c.code,
            value: c.value,
            image: c.image,
            name: `${c.value} of ${c.suit}`        
        }
        ));
        cardRes = await axios.get(cardURL);
        let dealerHand = cardRes.data.cards.map(c => ({
            id: c.code,
            value: c.value,
            image: c.image,
            name: `${c.value} of ${c.suit}`        
        }
        ));
        this.setState({
            deck: deck.data,
            hand: firstHand,
            handValue: this.computeHandValue(firstHand),
            dealer: dealerHand,
            dealerValue: this.computeHandValue(dealerHand)
        });
    }


    async drawCard() {
        let id = this.state.deck.deck_id;
        let cardURL = `${API_BASE_URL}/${id}/draw`;
        let cardRes = await axios.get(cardURL);
        let card = cardRes.data.cards[0];
        console.log(card);
    }
    render() { 
        const player = this.state.hand.map(c => (
            <Card
                image = {c.image}
                name = {c.name}
                key = {c.id}
            />
        )); 
        const dealer = this.state.dealer.map(c => (
            <Card
                image = {c.image}
                name = {c.name}
                key = {c.id}
            />
        ));
        return ( 
            <div>
                <h1>BlackJack!</h1>
                <button onClick = {this.drawCard}>Hit Me</button>
                {player}
                {dealer}
            </div>
         );
    }
}
 
export default Hand;