import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { INewCycleFormData } from '../pages/Home/components/CycleForm'
import {
  addNewCycleAction,
  deleteCyclesHistoryAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
  userIsAwareCycleFinishedAction,
} from '../reducers/cycle/actions'
import { cycleReducer, ICycleState } from '../reducers/cycle/reducer'

import alarmSong from '../assets/alarm.mp3'

export interface ICycle {
  id: string
  task: string
  minutes: number
  startDate: number
  interruptedDate?: number
  finishedDate?: number
}

export interface ICycleContextProps {
  cycles: ICycle[]
  activeCycle: ICycle | undefined
  formattedTime: { minutes: string; seconds: string }
  userIsAwareOfCycleFinished: () => void
  createNewCycle: (data: INewCycleFormData) => void
  interruptCurrentCycle: () => void
  deleteCyclesHistory: () => void
}

export const CycleContext = createContext<ICycleContextProps>({} as any)

interface ICycleContextProviderProps {
  children: ReactNode
}

export function CycleContextProvider({ children }: ICycleContextProviderProps) {
  const [state, dispatch] = useReducer<typeof cycleReducer, ICycleState>(
    cycleReducer,
    {
      cycles: [],
      activeCycleId: undefined,
    },
    (initialState: ICycleState) => {
      const stateJson = localStorage.getItem(
        '@react-pomodoro:cycle-state-1.0.0'
      )

      if (stateJson) {
        return JSON.parse(stateJson)
      }

      return initialState
    }
  )

  const { cycles, activeCycleId } = state

  const activeCycle = state.cycles.find(cycle => cycle.id === activeCycleId)

  const [amountPassedInSec, setAmountPassedInSec] = useState<number>(() => {
    if (activeCycle && !activeCycle.finishedDate) {
      const diffInSec = differenceInSeconds(Date.now(), activeCycle.startDate)

      return diffInSec
    }

    return 0
  })

  const [alarmSound] = useState(() => {
    const audio = new Audio(alarmSong)
    audio.loop = true
    return audio
  })

  const formattedTime = {
    minutes: '00',
    seconds: '00',
  }

  const totalSeconds = activeCycle ? activeCycle.minutes * 60 : 0

  if (activeCycle) {
    const totalSeconds = activeCycle ? activeCycle.minutes * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amountPassedInSec : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    formattedTime.minutes = String(minutesAmount).padStart(2, '0')
    formattedTime.seconds = String(secondsAmount).padStart(2, '0')
  }

  useEffect(() => {
    const stateJson = JSON.stringify(state)

    localStorage.setItem('@react-pomodoro:cycle-state-1.0.0', stateJson)
  }, [state])

  useEffect(() => {
    let interval: number

    if (activeCycle && !activeCycle.finishedDate) {
      interval = setInterval(() => {
        const diffInSec = differenceInSeconds(Date.now(), activeCycle.startDate)

        if (diffInSec >= totalSeconds) {
          markCurrentCycleAsFinished()
          clearInterval(interval)
        } else {
          setAmountPassedInSec(diffInSec)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, markCurrentCycleAsFinished])

  useEffect(() => {
    if (activeCycle) {
      if (activeCycle.finishedDate) {
        document.title = `Pomodoro finished!`
      } else {
        document.title = `${formattedTime.minutes}:${formattedTime.seconds}`
      }
    } else {
      document.title = 'Pomodoro'
    }
  }, [formattedTime.minutes, formattedTime.seconds, activeCycle])

  function userIsAwareOfCycleFinished() {
    dispatch(userIsAwareCycleFinishedAction())
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
    setAmountPassedInSec(0)

    alarmSound.play()

    const timeout = setTimeout(() => {
      alarmSound.pause()
      clearTimeout(timeout)
    }, 1000 * 60)
  }

  function createNewCycle(data: INewCycleFormData) {
    const newCycle: ICycle = {
      id: Date.now().toString(),
      task: data.task,
      minutes: data.minutes,
      startDate: Date.now(),
    }

    dispatch(addNewCycleAction(newCycle))
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
    setAmountPassedInSec(0)
  }

  function deleteCyclesHistory() {
    dispatch(deleteCyclesHistoryAction())
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        userIsAwareOfCycleFinished,
        createNewCycle,
        interruptCurrentCycle,
        deleteCyclesHistory,
        formattedTime,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
