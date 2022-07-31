import {
  CycleCompletedMessage,
  FormContainer,
  FormHeader,
  MinutesAmountInput,
  OKButton,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles'
import { FormEvent, useContext, useState } from 'react'
import { CycleContext } from '../../../../contexts/CycleContext'
import { Stop, Play, Alarm } from 'phosphor-react'
import { CycleCountdown } from '../CycleCountdown'

export interface INewCycleFormData {
  task: string
  minutes: number
}

export function CycleForm() {
  const {
    activeCycle,
    interruptCurrentCycle,
    createNewCycle,
    userIsAwareOfCycleFinished,
  } = useContext(CycleContext)

  const [task, setTask] = useState(activeCycle?.task || '')
  const [minutes, setMinutes] = useState(activeCycle?.minutes || 15)

  const isStartButtonDisabled = !task.length || !minutes

  const isCycleCompleted = !!activeCycle?.finishedDate

  function resetInputFields() {
    setTask('')
    setMinutes(15)
  }

  function handleUserIsAwareOfCycleFinished() {
    userIsAwareOfCycleFinished()
    resetInputFields()
  }

  function handleInterruptCycle() {
    interruptCurrentCycle()
    resetInputFields()
  }

  function handleCreateNewCycle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const data: INewCycleFormData = {
      task,
      minutes,
    }

    createNewCycle(data)
  }

  return (
    <FormContainer action="submit" onSubmit={handleCreateNewCycle}>
      <FormHeader>
        <label htmlFor="task">I&apos;m going to work on</label>
        <TaskInput
          id="task"
          type="text"
          placeholder="give a name to your task"
          list="task-suggestions"
          autoComplete="off"
          value={task}
          onChange={e => setTask(e.target.value)}
          disabled={!!activeCycle}
        />

        <label htmlFor="minutesAmount">For</label>
        <MinutesAmountInput
          id="minutesAmount"
          min={5}
          max={60}
          step={5}
          type="number"
          onChange={e => setMinutes(Number(e.target.value))}
          value={minutes}
          disabled={!!activeCycle}
        />
        <span>minutes.</span>
      </FormHeader>

      <CycleCountdown formMinutesData={minutes} />

      {activeCycle && activeCycle.finishedDate && (
        <OKButton type="button" onClick={handleUserIsAwareOfCycleFinished}>
          <Alarm size={24} weight="bold" />
          OK
        </OKButton>
      )}

      {!activeCycle && (
        <StartCountdownButton type="submit" disabled={isStartButtonDisabled}>
          <Play size={24} weight="bold" />
          Start
        </StartCountdownButton>
      )}

      {activeCycle && !activeCycle.finishedDate && (
        <StopCountdownButton type="button" onClick={handleInterruptCycle}>
          <Stop size={24} weight="bold" />
          Stop
        </StopCountdownButton>
      )}
      <CycleCompletedMessage isCompleted={isCycleCompleted}>
        Cycle has ended
      </CycleCompletedMessage>
    </FormContainer>
  )
}
