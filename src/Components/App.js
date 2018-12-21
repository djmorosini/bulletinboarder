import React, { Component } from 'react';
import Board from './Board'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.boardNumber = 0
    this.state = {
      boards: [],
      currentBoard: null
    }
  }

  componentDidMount() {
    if (localStorage.getItem('boards')) {
      let boards = JSON.parse(localStorage.getItem('boards'))
      let lastBoardId = boards[boards.length - 1].boardId.slice(6)
      this.boardNumber = parseInt(lastBoardId) + 1
      this.setState({ boards: boards })
    }
  }

  createBoard = (name) => {
    let boards = this.state.boards
    boards.push({ boardId: `board-${this.boardNumber}`, boardName: name })
    this.setState({ boards: boards })
    this.boardNumber++
  }

  saveBoard = (id) => {
    let boards = this.state.boards
    const result = boards.find(board => board.boardId === id);

    let savedBoards
    if (localStorage.getItem('boards')) {
      savedBoards = JSON.parse(localStorage.getItem('boards'))
    } else {
      savedBoards = []
    }
    savedBoards.push(result)
    localStorage.setItem('boards', JSON.stringify(savedBoards))
  }

  loadBoard = (id) => {
    let boards = this.state.boards
    const result = boards.find(board => board.boardId === id);
    this.setState({ currentBoard: result })
  }

  closeBoard = () => {
    this.setState({ currentBoard: null })
  }

  render() {
    if (this.state.currentBoard) {
      let board = this.state.currentBoard
      return (
        <Board closeBoard={this.closeBoard} saveBoard={this.saveBoard} boardInfo={board} />
      )
    } else {
      let boards = this.state.boards.map((board) => {
        return (
          <div key={board.boardId} className='board-names' onClick={() => this.loadBoard(`${board.boardId}`)}>{board.boardName}</div>
        )
      })
      return (
        <div id='app'>
          <h1>List-Maker</h1>
          <div>
            <h3>Boards</h3>
            <div id='board-dropdown'>
              {boards ? boards.map(board => board) : 'No boards'}
            </div>
          </div>
          <div>
            <button onClick={() => this.createBoard(`board ${this.boardNumber}`)}>Create board</button>
          </div>
        </div>
      )
    }
  }
}