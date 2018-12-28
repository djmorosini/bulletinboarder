import React, { Fragment, Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Item from './Item'

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '16px',
  margin: `0 0 4px 0`,
  border: '1px solid black',
  width: '220px',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'lightgray',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'gray',
  padding: '5px',
  width: '270px',
  minHeight: '20vh',
  maxHeight: '70vh',
  overflow: 'auto'
});

export default class InnerList extends Component {

  render() {
    let list = this.props.list
    let listId = list.id
    let listName = list.listName

    return (
      <div key={listId}>
        <i onClick={() => this.props.confirmDeletePopup('block', listId)} className="far fa-times-circle"></i>
        <h1 className='list-title-style'>{listName}</h1>
        <Droppable isDropDisabled={listId === 'addList' ? true : false} droppableId={listId}>
          {(provided, snapshot) => (
            <div
              className='my-lists'
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}>
              {list.items.map((item, index) => (
                <Fragment key={index}>
                  {item ?
                    <Draggable
                      isDragDisabled={item.id === "addItem" ? true : false}
                      key={item.id === 'addItem' ? item.id + '-' + listId : item.id}
                      draggableId={item.id === 'addItem' ? item.id + '-' + listId : item.id}
                      index={index}>
                      {(provided, snapshot) => (
                        <div
                          className='item-style'
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}>
                          <i onClick={() => this.props.confirmDeletePopup('block', listId, item.id)} className="far fa-times-circle"></i>
                          <div style={{ display: 'none' }} id={`list-id-${listId}`}>{listId}</div>
                          <Item deleteItem={this.props.deleteItem} addToList={this.props.addToList} listId={listId} itemId={item.id} content={item.content} />
                        </div>
                      )}
                    </Draggable> : <div className='no-items'></div>}
                </Fragment>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <button onClick={() => this.props.startAdd(listId)}>Add item</button>
      </div>
    );
  }
}