import React, { Fragment, Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '16px',
  margin: `0 0 4px 0`,
  border: '1px solid black',
  width: '200px',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: '8px',
  width: '250px',
  height: '370px',
  overflow: 'auto'
});

export default class InnerList extends Component {

  render() {
    if (this.props.list) {
      let list = this.props.list
      let listId = list.id
      let listName = list.listName

      return (
        <div key={listId}>
          <button onClick={() => { this.props.popupSwitch('block', listName, listId) }}>Add to {listName}</button>
          <h1>{listName}</h1>
          <Droppable droppableId={listId}>
            {(provided, snapshot) => (
              <div
                className='my-lists'
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}>
                {list.items.map((item, index) => (
                  <Fragment key={index}>
                    {item ?
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
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
                            {item.content}
                          </div>
                        )}
                      </Draggable> : <div className='no-items'></div>}
                  </Fragment>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      );
    }
  }
}