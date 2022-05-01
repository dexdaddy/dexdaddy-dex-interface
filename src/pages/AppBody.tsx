import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  background: #081e28;
  box-shadow: 0px 0px 72px #27ae604a, 1px 6px 16px #2172e533, 0px 16px 87px #5399ff33, 0px 24px 32px #1966d429;
  border-radius: 30px;
  border: 0.7px solid #128693b0;
  padding: 1rem;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
