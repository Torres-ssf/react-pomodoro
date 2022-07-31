import styled from 'styled-components'
import { defaultTheme } from '../../styles/themes/default'

export const HistoryContainer = styled.div`
  flex: 1;
  padding: 3.5rem;

  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const HistoryContainerHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 1.5rem;
    color: ${({ theme }) => theme['gray-100']};
  }
`

export const DeleteCyclesHistoryButton = styled.button`
  border: none;
  padding: 1.2rem;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  font-weight: bold;

  color: ${({ theme }) => theme['gray-100']};
  transition: background 0.2s ease-in-out;

  cursor: pointer;

  background: ${({ theme }) => theme['red-500']};

  &:enabled:hover {
    background: ${({ theme }) => theme['red-700']};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

export const HistoryList = styled.div`
  flex: 1;
  overflow: auto;
  margin-top: 2rem;

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;

    th {
      background-color: ${({ theme }) => theme['gray-600']};
      padding: 1rem;
      text-align: left;
      color: ${({ theme }) => theme['gray-100']};
      font-size: 0.875rem;
      line-height: 1.6;

      &:first-child {
        border-top-left-radius: 8px;
        padding-left: 1.5rem;
      }

      &:last-child {
        border-top-right-radius: 8px;
        padding-right: 1.5rem;
      }
    }

    td {
      background-color: ${({ theme }) => theme['gray-700']};
      border-top: 4px solid ${({ theme }) => theme['gray-800']};
      padding: 1rem;
      font-size: 0.875rem;
      line-height: 1.6;

      &:first-child {
        width: 50%;
        padding-left: 1.5rem;
      }

      &:last-child {
        padding-right: 1.5rem;
      }
    }
  }

  @media (max-width: 980px) {
    table {
      td {
        padding: 0.5rem;

        &:first-child {
          width: 45%;
        }
      }
    }
  }
`

export interface IStatusProps {
  statusColor: 'yellow' | 'green' | 'red'
}

const STATUS_COLOR_MAP: Record<
  IStatusProps['statusColor'],
  keyof typeof defaultTheme
> = {
  yellow: 'yellow-500',
  green: 'green-500',
  red: 'red-500',
}

export const Status = styled.span<IStatusProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background-color: ${({ theme, statusColor }) =>
      theme[STATUS_COLOR_MAP[statusColor]]};
  }
`

export const DeleteCycleButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  background: transparent;

  cursor: pointer;
  transition: opacity 0.2s ease-in-out;

  &:enabled:hover {
    opacity: 0.7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`
