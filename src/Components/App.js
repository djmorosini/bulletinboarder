import React, { Component } from 'react';
import Board from './Board'

const setCaretPosition = (elemId, caretPos) => {
  let elem = document.getElementById(elemId);
  if (elem.createTextRange) {
    let range = elem.createTextRange();
    range.move('character', caretPos);
    range.select();
  } else {
    elem.focus();
    if (elem.selectionStart !== undefined) {
      elem.setSelectionRange(caretPos, caretPos);
    }
  }
}

const listenForEnterKey = (selector, callback) => {
  document.querySelector(selector).addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      let callbackValue = document.querySelector(selector).value
      callback(callbackValue);
    }
  });
}

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
    if (JSON.parse(localStorage.getItem('boards')) && JSON.parse(localStorage.getItem('boards')).length > 0) {
      let boards = JSON.parse(localStorage.getItem('boards'))
      let lastBoardId = boards[boards.length - 1].boardId.slice(6)
      this.boardNumber = parseInt(lastBoardId) + 1
      this.setState({ boards: boards })
    }
  }

  createBoard = (name) => {
    this.switchBoardPopup('none')
    let boards = this.state.boards
    let newBoard = { boardId: `board-${this.boardNumber}`, boardName: name, lists: null }
    boards.push(newBoard)
    this.setState({ boards: boards, currentBoard: newBoard })
    this.boardNumber++
  }

  saveBoard = (id, lists) => {
    let boards = this.state.boards
    const result = boards.find(board => board.boardId === id);
    result.lists = lists

    let savedBoards
    if (JSON.parse(localStorage.getItem('boards')) && JSON.parse(localStorage.getItem('boards')).length > 0) {
      savedBoards = JSON.parse(localStorage.getItem('boards'))
      for (let board of savedBoards) {
        if (board.boardId === id) {
          board = result
        }
      }
    } else {
      savedBoards = this.state.boards.map((board) => board.boardId === id ? result : board)
    }
    
    this.setState({ boards: savedBoards })
    localStorage.setItem('boards', JSON.stringify(savedBoards))
  }

  loadBoard = (id) => {
    let boards = this.state.boards
    const result = boards.find(board => board.boardId === id);
    this.setState({ currentBoard: result })
  }

  closeBoard = (id, lists) => {
    let boards = this.state.boards
    const result = boards.find(board => board.boardId === id);
    result.lists = lists
    this.setState({ boards: this.state.boards.map((board) => board.boardId === id ? result : board) })
    this.setState({ currentBoard: null })
  }

  deleteBoard = (id) => {
    let boards = this.state.boards
    const result = boards.filter(board => board.boardId !== id)
    console.log(result)
    this.setState({ boards: result })
    localStorage.setItem('boards', JSON.stringify(result))
  }

  switchBoardPopup = (display) => {
    let boardPopup = document.getElementById('board-pop-up')
    let boardNameInput = document.getElementById('board-name-input')
    if (display === 'none') {
      boardPopup.style = 'display: none;'
      boardNameInput.value = ''
    } else {
      listenForEnterKey("#board-name-input", this.createBoard);
      boardPopup.style = 'display: block;'
      setCaretPosition('board-name-input', 0)
    }
  }

  render() {
    if (this.state.currentBoard) {
      let board = this.state.currentBoard
      return (
        <Board closeBoard={this.closeBoard} saveBoard={this.saveBoard} boardInfo={board} setCaretPosition={setCaretPosition} />
      )
    } else {
      let boards = this.state.boards.map((board) => {
        return (
          <div className='board-names-wrap' key={board.boardId}>
            <div className='board-names' onClick={() => this.loadBoard(`${board.boardId}`)}>
              {board.boardName}
            </div>
            <button className='close-buttons' onClick={() => { this.deleteBoard(board.boardId) }}>X</button>
          </div>
        )
      })
      return (
        <div id='app'>
          <h1>List-Maker</h1>
          <div>
            <h3>Boards</h3>
            <div id='board-dropdown'>
              {boards.length > 0 ? boards.map(board => board) : 'No boards'}
            </div>
          </div>
          <div>
            <button onClick={() => this.switchBoardPopup(`block`)}>Create board</button>
          </div>
          <div id='board-pop-up' className='pop-ups'>
            <button className='close-buttons' onClick={() => this.switchBoardPopup('none')}>X</button>
            <br />
            <input id='board-name-input' placeholder='Enter board name' />
            <button onClick={() => this.createBoard(`${document.getElementById('board-name-input').value}`)}>Create board</button>
          </div>
        </div>
      )
    }
  }
}