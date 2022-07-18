import { Play, Stop } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  StartCountdownButton,
  CountdownContainer,
  HomeContainer,
  FormHeader,
  Separator,
  TaskInput,
  MinutesAmountInput,
  StopCountdownButton,
} from './styles'

import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

export interface ICycle {
  id: string
  task: string
  minutes: number
  startDate: number
}

export interface INewCycleFormData {
  task: string
  minutes: number
}

const newCycleValiadationSchema = zod.object({
  task: zod.string().min(1).max(255),
  minutes: zod.number().min(5).max(60),
})

export function Home() {
  const [cycles, setCycles] = useState<ICycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | undefined>()
  const [amountPassedInSec, setAmountPassedInSec] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleValiadationSchema),
    defaultValues: {
      task: '',
      minutes: 5,
    },
  })

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountPassedInSec(
          differenceInSeconds(Date.now(), activeCycle.startDate)
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  const totalSeconds = activeCycle ? activeCycle.minutes * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountPassedInSec : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    } else {
      document.title = 'Pomodoro'
    }
  }, [minutes, seconds, activeCycle])

  const taskValue = watch('task')
  const minutesValue = watch('minutes')

  const isStartButtonDisabled = !taskValue.length || !minutesValue

  function handleCreateNewCycle(data: INewCycleFormData) {
    const cycle: ICycle = {
      id: Date.now().toString(),
      task: data.task,
      minutes: data.minutes,
      startDate: Date.now(),
    }

    setCycles(oldState => [...oldState, cycle])
    setActiveCycleId(cycle.id)
    setAmountPassedInSec(0)

    reset()
  }

  function handleInterruptCycle() {
    setActiveCycleId(undefined)
    setAmountPassedInSec(0)
  }

  return (
    <HomeContainer>
      <form action="submit" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormHeader>
          <label htmlFor="task">I&apos;m going to work on</label>
          <TaskInput
            id="task"
            type="text"
            placeholder="give a name to your task"
            list="task-suggestions"
            disabled={!!activeCycle}
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="minutesAmount">For</label>
          <MinutesAmountInput
            id="minutesAmount"
            step={5}
            min={5}
            max={60}
            placeholder="45"
            type="number"
            disabled={!!activeCycle}
            {...register('minutes', { valueAsNumber: true })}
          />
          <span>minutes.</span>
        </FormHeader>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <Stop size={24} />
            Stop
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isStartButtonDisabled}>
            <Play size={24} />
            Start
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
