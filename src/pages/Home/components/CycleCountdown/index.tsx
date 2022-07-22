import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CycleContext } from '../../../../contexts/CycleContext'
import { CountdownContainer, Separator } from './styles'

export function CycleCountdown() {
  const {
    activeCycle,
    markCurrentCycleAsFinished,
    amountPassedInSec,
    setAmountPassed,
  } = useContext(CycleContext)

  const totalSeconds = activeCycle ? activeCycle.minutes * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountPassedInSec : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const diffInSec = differenceInSeconds(Date.now(), activeCycle.startDate)

        if (diffInSec >= totalSeconds) {
          markCurrentCycleAsFinished()
          clearInterval(interval)
        } else {
          setAmountPassed(diffInSec)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, markCurrentCycleAsFinished])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    } else {
      document.title = 'Pomodoro'
    }
  }, [minutes, seconds, activeCycle])

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
