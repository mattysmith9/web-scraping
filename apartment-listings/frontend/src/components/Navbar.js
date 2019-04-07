import React from 'react';
import styled from 'styled-components';
import { Container } from './Container';

const Wrapper = styled.div`
  padding: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 2.5rem;
    color: green;
  }
  p {
    font-size: 1.2rem;
    color: black;
  }
`;

export const Navbar = () => (
  <Wrapper as={Container}>
    <h1>Vermont Apartment Data</h1>
    <p>Updated Daily</p>
  </Wrapper>
);
