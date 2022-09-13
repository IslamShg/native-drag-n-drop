import classNames from 'classnames'
import React, { useState } from 'react'
import './App.css'

type Card = {
  id?: number
  column: string
  text?: string
}

type Column = {
  id?: number
  name?: string
  tasks: Card[]
  value: string
}

const initialData = [
  {
    id: 1,
    name: 'Список задач',
    tasks: [
      { id: 1, column: 'todo', text: 'Задача 1' },
      { id: 2, column: 'todo', text: 'Задача 2' }
    ],
    value: 'todo'
  },
  {
    id: 2,
    name: 'В работе',
    tasks: [
      { id: 3, column: 'inProgress', text: 'В прогрессе 1' },
      { id: 4, column: 'inProgress', text: 'В прогрессе 2' }
    ],
    value: 'inProgress'
  },
  {
    id: 3,
    name: 'Сделано',
    tasks: [
      { id: 5, column: 'done', text: 'Сделано 1' },
      { id: 6, column: 'done', text: 'Сделано 3' }
    ],
    value: 'done'
  }
]

function App() {
  const [columnList, setColumnList] = useState<Column[]>(initialData)
  const [currentColumn, setCurrentColumn] = useState<Column | null>(null)
  const [enteredColumn, setEnteredColumn] = useState<string | null>(null)

  const [draggingCard, setDraggingCard] = useState<Card | null>(null)
  const [enteredCard, setEnteredCard] = useState<Card | null>(null)

  const onDragStart = (card: Card, column: Column) => {
    setDraggingCard(card)
    setCurrentColumn(column)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()
  const onCardDragEnter = (card: Card) => setEnteredCard(card)
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>, column: string) => {
    setEnteredColumn(column)
  }

  const onDragLeave = () => {}
  const onDragEnd = () => {}

  const onAnyDrop = () => {
    setEnteredColumn(null)
    setDraggingCard(null)
  }

  const onCardDrop = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
    if (draggingCard?.column !== card.column || draggingCard.id === card.id) {
      return
    }

    const rearrangedTasks = currentColumn?.tasks.map((task) =>
      task.id === draggingCard.id
        ? card
        : task.id === card.id
        ? draggingCard
        : task
    )
    const newColumn = {
      ...currentColumn,
      tasks: rearrangedTasks
    } as Column

    setColumnList((prev) =>
      prev.map((column) => (column.id === newColumn.id ? newColumn : column))
    )
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, column: Column) => {
    if (!draggingCard || draggingCard?.column === column.value) {
      return
    }

    const tasks = currentColumn?.tasks.filter(
      (task) => task.id !== draggingCard?.id
    )
    const prevColumn = { ...currentColumn, tasks } as Column
    const newColumn = column
    draggingCard.column = column.value
    newColumn.tasks.unshift(draggingCard as Card)

    setColumnList((prev) =>
      prev.map((column) => (column.id === prevColumn.id ? prevColumn : column))
    )
  }

  return (
    <div className="app">
      <div className="container">
        {columnList.map((column) => (
          <div
            className={classNames('column', {
              entered:
                enteredColumn === column.value &&
                draggingCard?.column !== column.value
            })}
            onDragEnter={(e) => onDragEnter(e, column.value)}
            onDrop={(e) => {
              onDrop(e, column)
              onAnyDrop()
            }}
            onDragLeave={() => onDragLeave()}
            onDragOver={(e) => onDragOver(e)}
          >
            <p>{column.name}</p>
            {column.tasks.map((task) => (
              <div
                onDrop={(e) => {
                  onCardDrop(e, task)
                  onAnyDrop()
                }}
                draggable
                onDragEnter={() => onCardDragEnter(task)}
                onDragOver={onDragOver}
                className={classNames('card', {
                  entered:
                    enteredCard?.id === task.id &&
                    enteredCard?.id !== draggingCard?.id &&
                    draggingCard?.column === task.column
                })}
                onDragStart={() => onDragStart(task, column)}
                onDragEnd={() => onDragEnd()}
                key={task.id}
              >
                {task.text}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
