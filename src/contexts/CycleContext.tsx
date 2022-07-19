import { createContext, ReactNode, useState } from 'react'
import { INewCycleFormData } from '../pages/Home/components/CycleForm'

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
  activeCycleId: string | undefined
  amountPassedInSec: number
  setAmountPassed: (amount: number) => void
  createNewCycle: (data: INewCycleFormData) => void
  markCurrentCycleAsFinished: () => void
  interruptCurrentCycle: () => void
}

export const CycleContext = createContext<ICycleContextProps>({} as any)

interface ICycleContextProviderProps {
  children: ReactNode
}

export function CycleContextProvider({ children }: ICycleContextProviderProps) {
  const [cycles, setCycles] = useState<ICycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | undefined>()
  const [amountPassedInSec, setAmountPassedInSec] = useState<number>(0)

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  function setAmountPassed(amount: number) {
    setAmountPassedInSec(amount)
  }

  function markCurrentCycleAsFinished() {
    setCycles(oldState =>
      oldState.map(cycle => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: Date.now() }
        }

        return cycle
      })
    )
    setActiveCycleId(undefined)
  }

  function createNewCycle(data: INewCycleFormData) {
    const cycle: ICycle = {
      id: Date.now().toString(),
      task: data.task,
      minutes: data.minutes,
      startDate: Date.now(),
    }

    setCycles(oldState => [...oldState, cycle])
    setActiveCycleId(cycle.id)
    setAmountPassedInSec(0)
  }

  function interruptCurrentCycle() {
    setActiveCycleId(undefined)

    setCycles(oldState =>
      oldState.map(cycle => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptedDate: Date.now(),
          }
        }

        return cycle
      })
    )

    setAmountPassedInSec(0)
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        createNewCycle,
        interruptCurrentCycle,
        amountPassedInSec,
        setAmountPassed,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
