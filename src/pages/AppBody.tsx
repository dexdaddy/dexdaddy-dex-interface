import React from 'react'
import styled from 'styled-components'
export const BodyWrapper = styled.div`
  max-width: 420px;
  width: 100%;
  background-image: linear-gradient(
    to right,
    rgba(110, 217, 240, 0.2726),
    rgba(110, 191, 244, 0.1299),
    rgba(70, 144, 212, 0)
  );
  box-shadow: 0px 0px 72px #27ae604a, 1px 6px 16px #2172e533, 0px 16px 87px #5399ff33, 0px 24px 32px #1966d429;
  border-radius: 30px;
  border: 1px solid #0cebff;
  padding: 1rem;
  background-size: 478px 405px;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
