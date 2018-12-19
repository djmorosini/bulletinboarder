import React, { Fragment, Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Lists from './Lists'

function setCaretPosition(elemId, caretPos) {
  var el = document.getElementById(elemId);

  if (el !== null) {

    el.value = el.value;

    if (el.createTextRange) {
      var range = el.createTextRange();
      range.move('character', caretPos);
      range.select();
      return true;

    } else {
      // (el.selectionStart === 0 added for Firefox bug)
      if (el.selectionStart || el.selectionStart === 0) {
        el.focus();
        el.setSelectionRange(caretPos, caretPos);
        return true;

      } else { // fail city, fortunately this never happens (as far as I've tested) :)
        el.focus();
        return false;
      }
    }
  }
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
  padding: 10,
  margin: `0 8px 0 0`,
  overflow: 'auto',
  height: '90%',
  width: 280,
  border: '1px solid black',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: 8,
  flexWrap: 'no-wrap',
  overflow: 'auto',
  width: '98vw',
  height: '90vh',
  alignSelf: 'center'
});

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.itemIndex = 0
    this.droppableNumber = 0
    this.id2List = {};
    this.state = {
      lists: []
    };
  }

  createNewList = (listName) => {
    let listId = 'droppable' + this.droppableNumber
    let items = []

    let listArray = this.state.lists
    let newList = { listName: listName, id: listId, items: items }
    listArray.push(newList)

    this.setState({ lists: listArray })
    this.id2List = { ...this.id2List, [listId]: listName }

    this.switchListPopup('none')
    this.droppableNumber++
  }

  addToList = (listFrom, content) => {
    this.switchItemPopup('none')
    let lists = this.state.lists
    const result = lists.find(list => list.listName === listFrom);
    let items = result.items
    items.push({ id: `item-${this.itemIndex}`, content: content })
    this.itemIndex++
    this.setState({ lists: lists.map(list => list.listName === listFrom ? list = { ...list, items: items } : list) })
  }

  getList = (id) => {
    let lists = this.state.lists
    let listFrom = this.id2List[id]
    let result = lists.find(list => list.listName === listFrom);
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

        let listFrom = this.id2List[source.droppableId]
        this.setState({ lists: this.state.lists.map(list => list.listName === listFrom ? list = { ...list, items: items } : list) })

      } else {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        let listFrom = this.id2List[source.droppableId]
        let listTo = this.id2List[destination.droppableId]

        let destinationArray = []
        for (let dresults of result[destination.droppableId]) {
          destinationArray.push(dresults)
        }

        let sourceArray = []
        for (let sresults of result[source.droppableId]) {
          sourceArray.push(sresults)
        }

        this.setState({
          lists: this.state.lists.map(list => list.listName === listFrom ? list = { ...list, items: sourceArray } :
            list.listName === listTo ? list = { ...list, items: destinationArray } : list)
        })
      }
    }
  }

  switchListPopup = (display) => {
    let listPopup = document.getElementById('list-pop-up')
    if (display === 'none') {
      let listNameInput = document.getElementById('list-name-input')
      listPopup.style = 'display: none;'
      listNameInput.value = ''
    } else {
      this.switchItemPopup('none')
      listPopup.style = 'display: block;'
      setCaretPosition('list-name-input', 0)
    }
  }

  switchItemPopup = (display, listName) => {
    let itemPopup = document.getElementById('item-pop-up')
    if (display === 'none') {
      let itemPopupInput = document.getElementById('item-content-input')
      itemPopup.style = 'display: none;'
      itemPopupInput.value = ''
    } else {
      this.switchListPopup('none')
      let popupTitle = document.getElementById('item-popup-title')
      popupTitle.textContent = listName
      itemPopup.style = 'display: block;'
      setCaretPosition('item-content-input', 0)
    }
  }

  render() {

    return (
      <Fragment>
        <button onClick={() => { this.switchListPopup('block') }}>Add list</button>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal" type='COLUMN'>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {this.state.lists.map((list, index) => (
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
                          <Lists popupSwitch={this.switchItemPopup} list={list} />
                        </div>
                      )}
                    </Draggable>
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div id='list-pop-up'>
          <button style={{ float: 'right' }} onClick={() => this.switchListPopup('none')}>X</button>
          <br />
          <input id='list-name-input' placeholder='Enter list name' />
          <button onClick={() => this.createNewList(`${document.getElementById('list-name-input').value}`)}>Create List</button>
        </div>
        <div id='item-pop-up'>
          <button style={{ float: 'right' }} onClick={() => this.switchItemPopup('none')}>X</button>
          <br />
          <div>Add item to <span id='item-popup-title'></span></div>
          <input id='item-content-input' placeholder='Enter item content' />
          <button onClick={() => this.addToList(document.getElementById('item-popup-title').textContent, `${document.getElementById('item-content-input').value}`)}>Create Item</button>
        </div>
      </Fragment>
    );
  }
}