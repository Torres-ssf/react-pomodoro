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
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycle/actions'
import { cycleReducer, ICycleState } from '../reducers/cycle/reducer'

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
  createNewCycle: (data: INewCycleFormData) => void
  interruptCurrentCycle: () => void
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
      const storedStateJson = localStorage.getItem(
        '@react-pomodoro:cycle-state-1.0.0'
      )

      if (storedStateJson) {
        return JSON.parse(storedStateJson)
      }

      return initialState
    }
  )

  const { cycles, activeCycleId } = state

  const activeCycle = state.cycles.find(cycle => cycle.id === activeCycleId)

  const [amountPassedInSec, setAmountPassedInSec] = useState<number>(() => {
    if (activeCycle) {
      const diffInSec = differenceInSeconds(Date.now(), activeCycle.startDate)

      return diffInSec
    }

    return 0
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

    if (activeCycle) {
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
      document.title = `${formattedTime.minutes}:${formattedTime.seconds}`
    } else {
      document.title = 'Pomodoro'
    }
  }, [formattedTime.minutes, formattedTime.seconds, activeCycle])

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
    setAmountPassedInSec(0)
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

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        createNewCycle,
        interruptCurrentCycle,
        formattedTime,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
