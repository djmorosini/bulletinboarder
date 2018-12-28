import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InnerList from './InnerList'

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
  padding: '5px',
  margin: `0 8px 0 0`,
  minHeight: '20%',
  width: '280px',
  border: '1px solid black',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  display: 'flex',
  padding: '20px 8px 8px 8px',
  flexWrap: 'no-wrap',
  width: 'fit-content',
  height: 'fit-content',
  alignSelf: 'center'
});

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.itemIndex = 0
    this.droppableNumber = 0
    this.state = {
      lists: []
    };
  }

  componentDidMount() {
    this.props.dragElement('confirm-item-delete-popup')
    this.props.dragElement('confirm-list-delete-popup')
    if (this.props.boardInfo.lists && this.props.boardInfo.lists.length !== 0) {
      let lists = this.props.boardInfo.lists
      this.setState({ lists: lists })
      if (lists.length > 1) {
        let sortedlists = lists.slice().sort((a, b) => {
          var nameA = a.id.toUpperCase(); // ignore upper and lowercase
          var nameB = b.id.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });
        let lastListId = sortedlists[sortedlists.length - 1].id.slice(9)
        this.droppableNumber = parseInt(lastListId) + 1

        let listItems = []
        for (let list of lists) {
          for (let item of list.items) {
            listItems.push(item)
          }
        }
        listItems.sort((a, b) => {
          var aID = a.id.slice(5)
          var bID = b.id.slice(5)
          return aID - bID
        });
        if (listItems[listItems.length - 1] && listItems[listItems.length - 1].id !== 'addItem') {
          let lastItemId = listItems[listItems.length - 1].id.slice(5)
          this.itemIndex = parseInt(lastItemId) + 1
        }
      }
    }
    this.props.setCaretPosition('#list-name-input', 0)
    listenForEnterKey("#list-name-input", this.createNewList);
  }

  deleteList = (id) => {
    this.confirmDeletePopup('none')
    let lists = this.state.lists
    const result = lists.filter(list => list.id !== id)
    this.setState({ lists: result })
    this.props.saveBoard(`${this.props.boardInfo.boardId}`, result)
  }

  createNewList = (listName) => {
    let listId = 'droppable' + this.droppableNumber
    let listArray = this.state.lists
    let newList = { listName: listName, id: listId, items: [] }
    listArray.push(newList)

    this.setState({ lists: listArray })

    document.getElementById('list-name-input').value = ''
    this.droppableNumber++
    this.props.saveBoard(`${this.props.boardInfo.boardId}`, listArray)
  }

  deleteItem = (listId, itemId) => {
    this.confirmDeletePopup('none', 'list', 'item')
    let lists = this.state.lists
    const result = lists.find(list => list.id === listId)
    let updatedList = result.items.filter(item => item.id !== itemId)
    result.items = updatedList
    this.setState({ lists: lists.map(list => list.id === listId ? result : list) })
    this.props.saveBoard(`${this.props.boardInfo.boardId}`, lists.map(list => list.id === listId ? result : list))
  }

  addToList = (listId, content) => {
    let lists = this.state.lists
    const result = lists.find(list => list.id === listId);
    let items = result.items
    items = items.filter(item => item.id !== 'addItem')
    items.push({ id: `item-${this.itemIndex}`, content: content })
    items.push({ id: `addItem`, content: 'Add item' })

    this.itemIndex++
    this.setState({ lists: lists.map(list => list.id === listId ? list = { ...list, items: items } : list) })

    this.props.setCaretPosition(`#${listId}-input`, 0)
    this.props.saveBoard(`${this.props.boardInfo.boardId}`, lists.map(list => list.id === listId ? list = { ...list, items: items } : list))
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
      this.props.saveBoard(`${this.props.boardInfo.boardId}`, lists)
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
        this.props.saveBoard(`${this.props.boardInfo.boardId}`, this.state.lists.map(list => list.id === source.droppableId ? list = { ...list, items: items } : list))
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
        this.props.saveBoard(`${this.props.boardInfo.boardId}`, this.state.lists.map(list => list.id === source.droppableId ? list = { ...list, items: sourceArray } :
          list.id === destination.droppableId ? list = { ...list, items: destinationArray } : list))
      }
    }
  }

  confirmDeletePopup = (display, listId, itemId) => {
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

  startAdd = (listId) => {
    let lists = this.state.lists
    const result = lists.find(list => list.id === listId);
    let newItem = { id: `addItem`, content: 'Add item' }
    let items = result.items
    items.push(newItem)
    this.setState({ lists: lists.map(list => list.id === listId ? list = { ...list, items: items } : list) })
  }

  render() {

    const lists = this.state.lists.map((list, index) => {
      return (
        <div className='list-wrap' key={list.id}>
          <Draggable draggableId={list.id} index={index} isDragDisabled={list.id === "addList" ? true : false}>
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
                <InnerList deleteItem={this.deleteItem} startAdd={this.startAdd} addToList={this.addToList} confirmDeletePopup={this.confirmDeletePopup} popupSwitch={this.switchItemPopup} list={list} />
              </div>
            )}
          </Draggable>
        </div>
      )
    })

    return (
      <div id='board-wrap'>
        <button onClick={() => this.props.closeBoard(`${this.props.boardInfo.boardId}`, this.state.lists)}>Home</button>
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
                <div id='list-name-input-style'>
                  <input autoComplete="off" id='list-name-input' placeholder='Enter list name' />
                </div>
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
          <div style={{ display: 'none' }} id='list-id'></div>
          <p>Delete list?</p>
          <button onClick={() => this.deleteList(`${document.getElementById('list-id').textContent}`)} id='yes-button'>Yes</button>
          <button onClick={() => this.confirmDeletePopup('none')}>No</button>
        </div>
      </div>
    );
  }
}