import styled from 'styled-components'

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    gap: 0.5rem;

    a {
      width: 3rem;
      height: 3rem;

      display: flex;
      justify-content: center;
      align-items: center;

      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;

      color: ${({ theme }) => theme['gray-100']};
      transition: border 0.2s ease-in-out;

      &:hover {
        border-bottom: 3px solid ${({ theme }) => theme['green-500']};
      }

      &.active {
        color: ${({ theme }) => theme['green-500']};
      }
    }
  }
`
