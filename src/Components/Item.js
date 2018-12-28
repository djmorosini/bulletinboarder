import React, { Component } from 'react';

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

const listenForEnterKey = (selector, callback, listId) => {
  document.querySelector(selector).addEventListener('keypress', function enterFunction(e) {
    if (e.key === 'Enter') {
      let callbackValue = document.querySelector(selector).value
      if (selector === '#list-name-input') {
        callback(callbackValue);
      } else {
        callback(listId, callbackValue);
      }
    }
  });
}

export default class Item extends Component {

  componentDidMount() {
    if (this.props.itemId === 'addItem') {
      let listId = this.props.listId
      listenForEnterKey(`#${listId}-input`, this.props.addToList, listId)
      setCaretPosition(`#${listId}-input`, 0)
    }
  }

  render() {
    if (this.props.itemId === 'addItem') {
      let listId = this.props.listId
      let itemId = this.props.itemId
      return (
        <input onBlur={() => this.props.deleteItem(listId, itemId)} id={`${listId}-input`} className='item-content-input' autoComplete="off" placeholder='Enter item content' />
      )
    } else {
      let itemId = this.props.itemId
      return (
        <div id={`${itemId}`}>
          {this.props.content}
        </div>
      )
    }
  }
}