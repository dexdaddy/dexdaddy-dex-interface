import React, { useRef } from 'react'
import {
  Send,
  Info,
  Twitter,
  Book,
  MessageSquare,
  Lock,
  Edit2,
  Copy,
  Facebook,
  Instagram,
  Youtube
} from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { LANDING_PAGE } from '../../constants'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

import { StyledMenu, StyledMenuButton, MenuFlyout, MenuItem, MenuNavItem } from '../StyledMenu'

import { useTranslation } from 'react-i18next'

const TutorialPage = `${LANDING_PAGE}/tutorials`

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const NarrowMenuFlyout = styled(MenuFlyout)`
  min-width: 8.125rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -17.25rem;
  `};
`

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  const { t } = useTranslation()
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <NarrowMenuFlyout>
          <MenuItem style={{ fontSize: 14 }} id="link" href="https://www.dexdaddy.com/dexdaddy/about">
            <Info size={14} />
            About
          </MenuItem>
          <MenuItem style={{ fontSize: 14 }} id="link" href="https://www.dexdaddy.com/dexdaddy/disclaimer">
            <Edit2 size={14} />
            Disclaimer
          </MenuItem>
          <MenuItem style={{ fontSize: 14 }} id="link" href="https://www.dexdaddy.com/dexdaddy/terms">
            <Book size={14} />
            Terms of Use
          </MenuItem>
          <MenuItem style={{ fontSize: 14 }} id="link" href="https://www.certik.com/projects/dexdaddy">
            <Lock size={14} />
            Audit
          </MenuItem>
          <MenuItem
            style={{ fontSize: 14 }}
            id="link"
            href="https://snowtrace.io/token/0x36a850f4a0afe7461fec0380fcc0f6458e20d551"
          >
            <MessageSquare size={14} />
            Contract
          </MenuItem>
          <MenuItem
            style={{ fontSize: 14 }}
            id="link"
            href="https://dexdaddypublicdocuments.s3.ap-south-1.amazonaws.com/dexDaddyWP.pdf"
          >
            <Copy size={14} />
            Whitepaper
          </MenuItem>
          <MenuItem style={{ fontSize: 14 }} id="link" href="https://twitter.com/DexDaddyDeFi">
            <Twitter size={14} />
            Twitter
          </MenuItem>
          <MenuItem style={{ fontSize: 14 }} id="link" href="https://t.me/DexDaddyOfficialGroup">
            <Send size={14} />
            Telegram
          </MenuItem>
          <MenuItem style={{ fontSize: 14 }} id="link" href="https://www.facebook.com/DexDaddyOfficial">
            <Facebook size={14} />
            Facebook
          </MenuItem>{' '}
          <MenuItem style={{ fontSize: 14 }} id="link" href="https://www.instagram.com/dexdaddyofficial/">
            <Instagram size={14} />
            Instagram
          </MenuItem>{' '}
          <MenuItem style={{ fontSize: 14 }} id="link" href="https://www.youtube.com/channel/UCOtk9Ke9QYZn6tw9gVF3eVQ">
            <Youtube size={14} />
            Youtube
          </MenuItem>
        </NarrowMenuFlyout>
      )}
    </StyledMenu>
  )
}
