import React, { Component } from 'react';
import axios from "axios";
import Card from './Card';
import "./Hand.css"
import cardBack from "./images/cardBack.png"
const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

class Hand extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            deck: null, 
            hand: [],
            handValue: 0,
            dealer: [],
            dealerValue: 0,
            gameOver: false,
            win: null,
            hiddenCard: null
        }
        this.drawCard = this.drawCard.bind(this);
        this.computeHandValue = this.computeHandValue.bind(this);
        this.showHands = this.showHands.bind(this);
        this.revealCard = this.revealCard.bind(this);
    }

    computeHandValue(hand) {
        let cardValue = 0;
        for(let i = 0; i < hand.length; i++){
            if( !hand[i].value.localeCompare("QUEEN") || !hand[i].value.localeCompare("KING") || !hand[i].value.localeCompare("JACK"))
                cardValue += 10;
            else if( hand[i].value.localeCompare("ACE") ){
                cardValue += parseInt(hand[i].value); 
            }
        }
        for(let i = 0; i < hand.length; i++){               //add ace values
            if( !hand[i].value.localeCompare("ACE") ){
                if( (cardValue + 11) > 21)
                    cardValue += 1;
                else
                    cardValue += 11;
            }
        }
        return cardValue;
    }

    revealCard() {
        let copy = [...this.state.dealer];
        copy[0].image = this.state.hiddenCard;
        this.setState({ dealer: copy });
    }

    async componentDidMount() {
        let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
        let id = deck.data.deck_id;
        let cardURL = `${API_BASE_URL}/${id}/draw/?count=2`;
        let cardRes = await axios.get(cardURL);
        console.log(cardRes);
        let firstHand = cardRes.data.cards.map(c => ({
            id: c.code,
            value: c.value,
            image: c.image,
            name: `${c.value} of ${c.suit}`        
        }
        ));

        cardRes = await axios.get(cardURL);   //draw 2 for dealer
        let dealerHand = cardRes.data.cards.map(c => ({
            id: c.code,
            value: c.value,
            image: c.image,
            name: `${c.value} of ${c.suit}`        
        }
        ));
        this.setState({ hiddenCard: dealerHand[0].image })
        dealerHand[0].image = cardBack;   //hide the dealer's first card
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
        let cardURL = `${API_BASE_URL}/${id}/draw/?count=2`;
        let cardRes = await axios.get(cardURL);
        let card = cardRes.data.cards[0];
        let dealerCard = cardRes.data.cards[1];
        this.setState(st => ({
            hand: [
                ...st.hand,
                {
                    id: card.code,
                    value: card.value,
                    image: card.image,
                    name: `${card.value} of ${card.suit}`   
                }
            ],
        }));
        this.setState({ handValue: this.computeHandValue(this.state.hand) });        
        if(this.state.handValue === 21){
            this.setState({ 
                gameOver: true,
                win: true,
            });
            this.revealCard();
            return;
        }
        if(this.state.handValue > 21){
            this.setState({ 
                gameOver: true,
                win: false 
            });
            this.revealCard();
            return;            
        }


        if(this.state.dealerValue < 17){

            this.setState(st => ({
                dealer: [
                    ...st.dealer,
                    {
                        id: dealerCard.code,
                        value: dealerCard.value,
                        image: dealerCard.image,
                        name: `${dealerCard.value} of ${dealerCard.suit}`   
                    }
                ],
            }));
            this.setState({ dealerValue: this.computeHandValue(this.state.dealer) });
        }

        if(this.state.dealerValue > 21){
            this.setState({ 
                gameOver: true,
                win: true 
            });
            this.revealCard();
        }
        if(this.state.dealerValue === 21){
            this.setState({ 
                gameOver: true,
                win: false 
            });
            this.revealCard();
        }
    }

        
    showHands(){
        if(this.state.handValue > this.state.dealerValue){
            this.setState({ 
                gameOver: true,
                win: true 
            });
            this.revealCard();
        }
        else{
            this.setState({ 
                gameOver: true,
                win: false
            });
            this.revealCard();
        }
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
            <div className = "App">
                <h1 className = "Title">BlackJack!</h1>
                <h2>Dealer</h2>
                <div className = "Dealer">
                    {dealer}
                </div>
                <h2>Player</h2>
                <div className = "Player">
                    {player}
                </div>
                
                {!this.state.gameOver 
                ?
                    <div>
                        <button onClick = {this.drawCard} className = "Hand-btn">Hit Me</button>
                        <button onClick = {this.showHands} className = "Hand-btn">Stand</button>
                    </div>
                :
                    <div>
                        <h2>{this.state.win ? "You win!" : "You lose"}</h2>
                        <button onClick = {() => window.location.reload(false)} className = "Hand-btn">Play Again?</button>
                    </div>
                }
            </div>
         );
    }
}
 
export default Hand;