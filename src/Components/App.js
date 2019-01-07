import React, { Component } from 'react';
import Board from './Board'

const dragElement = (elementId) => {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  const closeDragElement = () => {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  const elementDrag = (e) => {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    document.getElementById(elementId).style.top = (document.getElementById(elementId).offsetTop - pos2) + "px";
    document.getElementById(elementId).style.left = (document.getElementById(elementId).offsetLeft - pos1) + "px";
  }

  const dragMouseDown = (e) => {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a const whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  if (document.getElementById(elementId)) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elementId).onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    document.getElementById(elementId).onmousedown = dragMouseDown;
  }
}

const setCaretPosition = (elemId, caretPos) => {
  let elem = document.querySelector(elemId);
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
    dragElement('board-pop-up')
    dragElement('confirm-board-delete-popup')
    if (this.state.boards.length === 0 && JSON.parse(localStorage.getItem('boards')) && JSON.parse(localStorage.getItem('boards')).length > 0) {
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
    this.saveBoard(newBoard.boardId, newBoard.lists)
  }

  saveBoard = (id, lists) => {
    let boards = this.state.boards
    const result = boards.find(board => board.boardId === id);
    result.lists = lists

    let newBoards = []
    if (JSON.parse(localStorage.getItem('boards')) && JSON.parse(localStorage.getItem('boards')).length > 0) {
      let savedBoards = JSON.parse(localStorage.getItem('boards'))
      savedBoards.forEach(board => {
        if (board.boardId === id) {
          board = result
        }
        newBoards.push(board)
      })
      if (savedBoards.filter(board => board.boardId === id).length === 0) {
        newBoards.push(result)
      }
    } else {
      newBoards = this.state.boards.map((board) => board.boardId === id ? result : board)
    }

    this.setState({ boards: newBoards })
    localStorage.setItem('boards', JSON.stringify(newBoards))
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
    this.saveBoard(id, lists)
    this.setState({ currentBoard: null })
  }

  deleteBoard = (id) => {
    this.confirmBoardDeletePopup('none')
    let boards = this.state.boards
    const result = boards.filter(board => board.boardId !== id)
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
      this.confirmBoardDeletePopup('none')
      listenForEnterKey("#board-name-input", this.createBoard);
      boardPopup.style = 'display: block;'
      setCaretPosition('#board-name-input', 0)
    }
  }

  confirmBoardDeletePopup = (display, id) => {
    let confirmPopup = document.getElementById('confirm-board-delete-popup')
    if (display === 'none') {
      confirmPopup.style = 'display: none;'
    } else {
      this.switchBoardPopup('none')
      confirmPopup.style = 'display: block;'
      let boardId = document.getElementById('board-id')
      boardId.textContent = id
    }
  }

  render() {
    if (this.state.currentBoard) {
      let board = this.state.currentBoard
      return (
        <Board dragElement={dragElement} closeBoard={this.closeBoard} saveBoard={this.saveBoard} boardInfo={board} setCaretPosition={setCaretPosition} />
      )
    } else {
      let boards = this.state.boards.map((board) => {
        return (
          <div className='board-names-wrap' key={board.boardId}>
            <div className='board-close'>
              <i onClick={() => this.confirmBoardDeletePopup('block', board.boardId)} className="far fa-times-circle"></i>
              <div className='board-names' onClick={() => this.loadBoard(`${board.boardId}`)}>
                {board.boardName}
              </div>
            </div>
          </div>
        )
      })
      return (
        <div id='app'>
          <div id='app-name'>
          <h1 className='titles'>BulletinBoarder</h1>
          </div>
          <div>
            <h3 className='titles'><u>Boards:</u></h3>
            <div id='board-dropdown'>
              {boards.length > 0 ? boards.map(board => board) : 'No boards'}
            </div>
          </div>
          <div>
            <button onClick={() => this.switchBoardPopup(`block`)}>Create board</button>
          </div>
          <div id='board-pop-up' className='pop-ups'>
            <i onClick={() => this.switchBoardPopup('none')} className="far fa-times-circle"></i>
            <br />
            <input id='board-name-input' placeholder='Enter board name' />
            <button onClick={() => this.createBoard(`${document.getElementById('board-name-input').value}`)}>Create board</button>
          </div>
          <div id='confirm-board-delete-popup' className='pop-ups'>
            <i onClick={() => this.confirmBoardDeletePopup('none')} className="far fa-times-circle"></i>
            <br />
            <div style={{ display: 'none' }} id='board-id'></div>
            <p>Delete board?</p>
            <button onClick={() => this.deleteBoard(`${document.getElementById('board-id').textContent}`)} id='yes-button'>Yes</button>
            <button onClick={() => this.confirmBoardDeletePopup('none')}>No</button>
          </div>
        </div>
      )
    }
  }
}