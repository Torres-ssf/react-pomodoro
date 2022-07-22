import { differenceInHours, format } from 'date-fns'
import { useContext } from 'react'
import { CycleContext } from '../../../../contexts/CycleContext'
import { CountdownContainer, Separator } from './styles'

export interface ICycleCountdownProps {
  formMinutesData: number
}

export function CycleCountdown(props: ICycleCountdownProps) {
  const { formattedTime, activeCycle } = useContext(CycleContext)

  const { formMinutesData } = props

  let minutes: string
  let seconds: string

  if (activeCycle) {
    ;({ minutes, seconds } = formattedTime)
  } else {
    const miliSeconds = formMinutesData * 60 * 1000

    const splitTimeRegex = /[0-9]{2,}/g

    const timeString = differenceInHours(0, miliSeconds)
      ? '60:00'
      : format(miliSeconds, 'mm:ss')

    ;[minutes, seconds] = timeString.match(splitTimeRegex)!
  }

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
