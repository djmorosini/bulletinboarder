import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InnerList from './InnerList'

const listenForEnterKey = (selector, callback) => {
  document.querySelector(selector).addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      let callbackValue = document.querySelector(selector).value
      if (selector === '#list-name-input') {
        callback(callbackValue);
      } else {
        let listId = document.querySelector('#list-id').textContent
        callback(listId, callbackValue);
      }
    }
  });
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  let result
  if (list.items) {
    result = Array.from(list.items)
  } else {
    result = Array.from(list);
  }
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source.items);
  const destClone = Array.from(destination.items);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '10px 10px 0 15px',
  margin: `0 8px 0 0`,
  height: '95%',
  width: '280px',
  border: '1px solid black',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: '20px 8px 8px 8px',
  flexWrap: 'no-wrap',
  overflow: 'auto',
  width: '98vw',
  height: '90vh',
  border: '1px solid black',
  alignSelf: 'center'
});

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.itemIndex = 0
    this.droppableNumber = 0
    this.state = {
    lists: [{ listName: 'Add list', id: 'addList', items: [] }]
  };
  }

  componentDidMount() {
    this.props.dragElement('confirm-item-delete-popup')
    this.props.dragElement('confirm-list-delete-popup')
    if (this.state.lists.length === 0 && this.props.boardInfo.lists && this.props.boardInfo.lists.length !== 0) {
      let lists = this.props.boardInfo.lists
      this.setState({ lists: lists })
    }
    listenForEnterKey("#list-name-input", this.createNewList);
  }

  deleteList = (id) => {
    this.confirmDeletePopup('none')
    let lists = this.state.lists
    const result = lists.filter(list => list.id !== id)
    this.setState({ lists: result })
  }

  createNewList = (listName) => {
    let listId = 'droppable' + this.droppableNumber
    let items = [{ id: `addItem`, content: 'Add item' }]
    let listArray = this.state.lists
    let newList = { listName: listName, id: listId, items: items }
    listArray.push(newList)
    let newListArray = []
    let tempArray = []
    listArray.forEach((list, index) => {
      if (list.id === 'addList') {
        tempArray.push(list)
      } else {
        newListArray.push(list)
      }
    })
    newListArray.push(tempArray[0])

    this.setState({ lists: newListArray })

    document.getElementById('list-name-input').value = ''
    this.props.setCaretPosition('item-content-input', 0)
    listenForEnterKey("#item-content-input", this.addToList);
    this.droppableNumber++
  }

  deleteItem = (listId, itemId) => {
    this.confirmDeletePopup('none', 'list', 'item')
    let lists = this.state.lists
    const result = lists.find(list => list.id === listId)
    let updatedList = result.items.filter(item => item.id !== itemId)
    result.items = updatedList
    this.setState({ lists: lists.map(list => list.id === listId ? result : list) })
  }

  addToList = (listId, content) => {
    let lists = this.state.lists
    const result = lists.find(list => list.id === listId);
    let tempArray = []
    let items = result.items
    tempArray.push(items.pop())
    items.push({ id: `item-${this.itemIndex}`, content: content })
    items.push(tempArray[0])

    this.itemIndex++
    this.setState({ lists: lists.map(list => list.id === listId ? list = { ...list, items: items } : list) })

    let itemPopupInput = document.getElementById('item-content-input')
    itemPopupInput.value = ''
    listenForEnterKey("#item-content-input", this.addToList);
    this.props.setCaretPosition('item-content-input', 0)
  }

  getList = (id) => {
    let lists = this.state.lists
    let result = lists.find(list => list.id === id);
    return result
  };

  onDragEnd = (result) => {
    if (result.type === 'COLUMN') {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      const lists = reorder(
        this.state.lists,
        result.source.index,
        result.destination.index
      );

      this.setState({
        lists: lists
      });
    } else {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        const items = reorder(
          this.getList(source.droppableId),
          source.index,
          destination.index
        );

        this.setState({ lists: this.state.lists.map(list => list.id === source.droppableId ? list = { ...list, items: items } : list) })

      } else {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        let destinationArray = []
        for (let destResults of result[destination.droppableId]) {
          destinationArray.push(destResults)
        }

        let sourceArray = []
        for (let srcResults of result[source.droppableId]) {
          sourceArray.push(srcResults)
        }

        this.setState({
          lists: this.state.lists.map(list => list.id === source.droppableId ? list = { ...list, items: sourceArray } :
            list.id === destination.droppableId ? list = { ...list, items: destinationArray } : list)
        })
      }
    }
  }

  confirmDeletePopup = (display, listId, itemId) => {
    this.switchItemPopup('none')
    this.switchListPopup('none')
    if (itemId) {
      let confirmPopup = document.getElementById('confirm-item-delete-popup')
      if (display === 'none') {
        confirmPopup.style = 'display: none;'
      } else {
        confirmPopup.style = 'display: block;'
        let item = document.getElementById('item-id')
        item.textContent = itemId
        let itemList = document.getElementById('item-list-id')
        itemList.textContent = listId
      }
    } else {
      let confirmPopup = document.getElementById('confirm-list-delete-popup')
      if (display === 'none') {
        confirmPopup.style = 'display: none;'
      } else {
        confirmPopup.style = 'display: block;'
        let list = document.getElementById('list-id')
        list.textContent = listId
      }
    }
  }

  render() {

    const lists = this.state.lists.map((list, index) => (
      <div className='list-wrap' key={list.id}>
        <Draggable draggableId={list.id} index={index}>
          {(provided, snapshot) => (
            <div
              className='list-style'
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              <InnerList confirmDeletePopup={this.confirmDeletePopup} popupSwitch={this.switchItemPopup} list={list} />
            </div>
          )}
        </Draggable>
      </div>
    ))

    return (
      <div id='board-wrap'>
        <button onClick={() => this.props.closeBoard(`${this.props.boardInfo.boardId}`, this.state.lists)} >Close board</button>
        <button onClick={() => this.props.saveBoard(`${this.props.boardInfo.boardId}`, this.state.lists)} >Save board</button>
        <div id='board-title'>{this.props.boardInfo.boardName}</div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal" type='COLUMN'>
            {(provided, snapshot) => (
              <div
                id='board'
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {lists}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div id='confirm-item-delete-popup' className='pop-ups'>
          <i onClick={() => this.confirmDeletePopup('none', 'list', 'item')} className="far fa-times-circle"></i>
          <br />
          <div style={{ display: 'none' }} id='item-id'></div>
          <div style={{ display: 'none' }} id='item-list-id'></div>
          <p>Delete item?</p>
          <button onClick={() => this.deleteItem(`${document.getElementById('item-list-id').textContent}`, `${document.getElementById('item-id').textContent}`)} id='yes-button'>Yes</button>
          <button onClick={() => this.confirmDeletePopup('none', 'list', 'item')}>No</button>
        </div>
        <div id='confirm-list-delete-popup' className='pop-ups'>
          <i onClick={() => this.confirmDeletePopup('none')} className="far fa-times-circle"></i>
          <br />
          <p>Delete list?</p>
          <button onClick={() => this.deleteList(`${document.getElementById('list-id').textContent}`)} id='yes-button'>Yes</button>
          <button onClick={() => this.confirmDeletePopup('none')}>No</button>
        </div>
      </div>
    );
  }
}