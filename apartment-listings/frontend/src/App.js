import React, { Component } from 'react';
import { Container } from './components/Container';
import { Navbar } from './components/Navbar';
import { Card } from './components/Card';

class App extends Component {
  render() {
    return (
      <Container>
        <Navbar />
        <Card>
          <h1>FUCKY</h1>
          <h2>FUCK</h2>
        </Card>
      </Container>
    );
  }
}

export default App;
