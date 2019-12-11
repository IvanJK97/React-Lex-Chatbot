import React, { Component } from 'react';

import { Interactions } from 'aws-amplify';
import { ChatFeed, Message } from 'react-chat-ui'

class App extends Component {
  state = {
    input: '',
    messages: [
      new Message({
        id: 1,
        message: "Hello, how can I help you today?",
      })
    ]
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitMessage()
    }
  }
  onChange(e) {
    const input = e.target.value
    this.setState({
      input
    })
  }

  async submitMessage() {
    const { input } = this.state
    if (input === '') return
    const message = new Message({
      id: 0,
      message: input,
    })
    let messages = [...this.state.messages, message];

    // Hard coded case to not get a response and just render "Ask me another question" and bypass the chatbot 
    let affirmativeResponse = ["Yes", "Yea", "Yup", "That helped", "yes", "yea", "yup", "that helped", "That answered my question", "that answered my question"];
    if (affirmativeResponse.includes(input)) {
      const responseMessage = new Message({
        id: 1,
        message: "I'm glad that helped. Ask me another question.",
      });
      messages.push(responseMessage);
    } else {
      const response = await Interactions.send("PeopleJoy", input);
  
      try {
        const responsesArray = JSON.parse(response.message).messages;
        const followUpMessage = new Message({
          id: 1,
          message: responsesArray[1].value,
        });
        const responseMessage = new Message({
          id: 1,
          message: responsesArray[0].value,
        });
        messages.push(responseMessage);
        messages.push(followUpMessage);
      } catch {
        const responseMessage = new Message({
          id: 1,
          message: response.message,
        });
        messages.push(responseMessage);
      }
    }

    this.setState({
      messages,
      input: ''
    });

  }
  render() {
    return (
      <div className="App">
        <header style={styles.header}>
          <p style={styles.headerTitle}>Welcome to the PeopleJoy Chat Bot!</p>
        </header>
        <div style={styles.messagesContainer}>
          <ChatFeed
            style={styles.chatFeed}
            messages={this.state.messages}
            hasInputField={false}
            bubbleStyles={styles.bubbleStyles}
          />

          <input
            onKeyPress={this.handleKeyPress}
            onChange={this.onChange.bind(this)}
            style={styles.input}
            value={this.state.input}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  bubbleStyles: {
    text: {
      fontSize: 20,
      color: 'black'
    },
    chatbubble: {
      borderRadius: 30,
      padding: 10,
      overflowWrap: 'break-word'
    }
  },
  headerTitle: {
    color: 'white',
    fontSize: 22
  },
  header: {
    backgroundColor: 'rgb(0, 132, 255)',
    padding: 20,
    borderTop: '12px solid rgb(204, 204, 204)'
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    padding: 10,
    outline: 'none',
    width: 500,
    border: 'none',
    borderBottom: '2px solid rgb(0, 132, 255)'
  }
}

export default App