import { ChainId, TokenAmount } from '@pangolindex/sdk'
import { Button } from '@pangolindex/components'
import React, { useState, useRef } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'react-feather'
import styled from 'styled-components'
import Logo from '../../assets/svg/icon.svg'
import LogoDark from '../../assets/svg/icon.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances, useAggregatePngBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { CountUp } from 'use-count-up'
import { TYPE, ExternalLink } from '../../theme'
import { RedCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'
import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import Modal from '../Modal'
import PngBalanceContent from './PngBalanceContent'
import usePrevious from '../../hooks/usePrevious'
import { ANALYTICS_PAGE } from '../../constants'
import LanguageSelection from '../LanguageSelection'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { MenuFlyout, MenuNavItem } from '../StyledMenu'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { BETA_MENU_LINK } from 'src/constants'
import { Hidden } from 'src/theme'
import { useChainId } from 'src/hooks'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`

const PNGAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #1a3647 0%, #1e3c47 100%), #edeef2;
`

const PNGWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 0.9;
  }
`

const NetworkCard = styled(RedCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const PngIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const StyledLink = styled.div<{ isActive: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, isActive }) => (isActive ? theme.text1 : theme.text2)};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 500)};
  font-weight: 500;
  line-height: 24px;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`

const NarrowMenuFlyout = styled(MenuFlyout)`
  min-width: 8.125rem;
  left: 15rem;
  right: auto !important;
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'Fuji',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.WAGMI]: 'Wagmi'
}

const NETWORK_CURRENCY: { [chainId in ChainId]?: string } = {
  [ChainId.FUJI]: 'AVAX',
  [ChainId.AVALANCHE]: 'AVAX',
  [ChainId.WAGMI]: 'WGM'
}

export default function Header() {
  const addDaddyToWallet = async () => {
    const tokenAddress = '0x36A850f4A0aFE7461FeC0380fcc0f6458e20D551'
    const tokenSymbol = 'DADDY'
    const tokenDecimals = 18
    const tokenImage =
      'https://raw.githubusercontent.com/dexdaddy/tokens/main/assets/0x36A850f4A0aFE7461FeC0380fcc0f6458e20D551/logo.png'

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage // A string url of the token logo
          }
        }
      })

      if (wasAdded) {
        console.log('Thanks for your interest!')
      } else {
        console.log('Your loss!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const { t } = useTranslation()

  const location: any = useLocation()

  const userEthBalance = useETHBalances(chainId, account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()

  const aggregateBalance: TokenAmount | undefined = useAggregatePngBalance()

  const [showPngBalanceModal, setShowPngBalanceModal] = useState(false)

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.FARM)
  const toggle = useToggleModal(ApplicationModal.FARM)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <HeaderFrame>
      <Modal isOpen={showPngBalanceModal} onDismiss={() => setShowPngBalanceModal(false)}>
        <PngBalanceContent setShowPngBalanceModal={setShowPngBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href=".">
          <PngIcon>
            <img width={'24px'} src={isDark ? LogoDark : Logo} alt="logo" />
          </PngIcon>
        </Title>
        <HeaderLinks>
          {/* <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            {t('header.swap')}
          </StyledNavLink>
          <StyledNavLink id={`swap-nav-link`} to={'/buy'}>
            {t('header.buy')}
          </StyledNavLink> */}
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            {t('header.pool')}
          </StyledNavLink>
          {/*

          <StyledLink
            id={`png-nav-link`}
            onClick={toggle}
            isActive={location?.pathname?.startsWith('/png')}
            ref={node as any}
          >
            {t('header.farm')} <ChevronDown size={24} />
            {open && (
              <NarrowMenuFlyout>
                <MenuNavItem id="link" to={'/png/1'}>
                  {t('header.version1')}
                </MenuNavItem>
                <MenuNavItem id="link" to={'/png/2'}>
                  {t('header.version2')}
                </MenuNavItem>
              </NarrowMenuFlyout>
            )}
          </StyledLink>

          <StyledNavLink
            id={`stake-nav-link`}
            to={'/stake/0'}
            isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/stake')}
          >
            {t('header.stake')}
          </StyledNavLink> */}
          <StyledExternalLink id={`vote-nav-link`} href={''}>
            Mint
          </StyledExternalLink>
          <StyledExternalLink id={`info-nav-link`} href={``}>
            Marketplace
          </StyledExternalLink>
          <StyledExternalLink id={`info-nav-link`} href={``}>
            Launchpad
          </StyledExternalLink>
          <StyledExternalLink id={`info-nav-link`} href={``}>
            Dex
          </StyledExternalLink>
          <StyledExternalLink id={`info-nav-link`} href={``}>
            Farm
          </StyledExternalLink>
          <StyledExternalLink id={`info-nav-link`} href={``}>
            Sale Events
          </StyledExternalLink>
          <StyledExternalLink id={`info-nav-link`} href={``}>
            Metaverse
          </StyledExternalLink>
          <StyledExternalLink id={`info-nav-link`} href={``}>
            Games
          </StyledExternalLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          {/* <Hidden upToSmall={true}>
            <Button
              variant="primary"
              height={36}
              padding="4px 6px"
              href={`#${BETA_MENU_LINK.dashboard}`}
              backgroundColor={'#f05629'}
              as="a"
              target=""
            >
              <span style={{ whiteSpace: 'nowrap' }}>{t('header.switchToNewUI')}</span>
            </Button>
          </Hidden> */}
          <Hidden upToSmall={true}>
            {NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </Hidden>
          {aggregateBalance && (
            <PNGWrapper onClick={() => addDaddyToWallet()}>
              <PNGAmount active={!!account} style={{ pointerEvents: 'auto' }}>
                <img
                  height="20px"
                  width="20px"
                  src={
                    'https://raw.githubusercontent.com/dexdaddy/tokens/main/assets/0x36A850f4A0aFE7461FeC0380fcc0f6458e20D551/logo.png'
                  }
                />{' '}
                <span className="addMetamask">Add to </span>{' '}
                <img height="20px" width="20px" src={'https://www.dexdaddy.com/wallet.png'} />
              </PNGAmount>
              <CardNoise />
            </PNGWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} {NETWORK_CURRENCY[chainId]}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          {/* <Settings />
          <LanguageSelection /> */}
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
