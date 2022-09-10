import React, { useRef, useState } from 'react'
import './App.css'
import classNames from 'classnames'

type Status = 'done' | 'inProgress' | 'todo'

type Card = {
  id?: number
  status?: Status
  text?: string
}

function App() {
  const [cardList, setCardList] = useState<Card[]>([
    { id: 1, status: 'done', text: 'КАРТОЧКА 1' },
    { id: 2, status: 'inProgress', text: 'КАРТОЧКА 2' },
    { id: 3, status: 'todo', text: 'КАРТОЧКА 3' },
    { id: 4, status: 'done', text: 'КАРТОЧКА 4' }
  ])

  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [enteringColumn, setEnteringColumn] = useState<Status | null>(null)

  const onDragStart = (draggingCard: Card) => {
    setCurrentCard(draggingCard)
  }

  const onDragLeave = () => {}

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>, column: Status) => {
    setEnteringColumn(column)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, column: Status) => {
    e.preventDefault()
    if (currentCard?.status === column) {
      return
    }
    const newTasks = cardList.filter((task) => task.id !== currentCard?.id)
    newTasks.unshift({ ...currentCard, status: column })

    setCardList(newTasks)
    setCurrentCard(null)
    setEnteringColumn(null)
  }

  const onDragEnd = () => {
    setEnteringColumn(null)
  }

  const doneTasks = cardList.filter((task) => task.status === 'done')
  const todoTasks = cardList.filter((task) => task.status === 'todo')
  const inProgressTasks = cardList.filter(
    (task) => task.status === 'inProgress'
  )

  return (
    <div className="app">
      <div className="container">
        <div
          className={classNames('column', {
            entered: enteringColumn === 'todo' && currentCard?.status !== 'todo'
          })}
          onDragEnter={(e) => onDragEnter(e, 'todo')}
          onDrop={(e) => onDrop(e, 'todo')}
          onDragLeave={() => onDragLeave()}
          onDragOver={(e) => onDragOver(e)}
        >
          {todoTasks.map((task) => (
            <div
              draggable
              className="card"
              onDragStart={() => onDragStart(task)}
              onDragEnd={() => onDragEnd()}
              key={task.id}
            >
              {task.text}
            </div>
          ))}
        </div>
        <div
          className={classNames('column', {
            entered:
              enteringColumn === 'inProgress' &&
              currentCard?.status !== 'inProgress'
          })}
          onDragLeave={() => onDragLeave()}
          onDragEnter={(e) => onDragEnter(e, 'inProgress')}
          onDrop={(e) => onDrop(e, 'inProgress')}
          onDragOver={(e) => onDragOver(e)}
        >
          {inProgressTasks.map((task) => (
            <div
              draggable
              className="card"
              onDragStart={() => onDragStart(task)}
              onDragEnd={() => onDragEnd()}
              key={task.id}
            >
              {task.text}
            </div>
          ))}
        </div>
        <div
          className={classNames('column', {
            entered: enteringColumn === 'done' && currentCard?.status !== 'done'
          })}
          onDragEnter={(e) => onDragEnter(e, 'done')}
          onDrop={(e) => onDrop(e, 'done')}
          onDragLeave={() => onDragLeave()}
          onDragOver={(e) => onDragOver(e)}
        >
          {doneTasks.map((task) => (
            <div
              draggable
              className="card"
              onDragStart={() => onDragStart(task)}
              onDragEnd={() => onDragEnd()}
              key={task.id}
            >
              {task.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
