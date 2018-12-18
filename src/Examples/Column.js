// @flow
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import QuoteList from './QuoteList'

// const ContainerStyle = {
//   margin: '8px',
//   display: 'flex',
// };

// const HeaderStyle = `
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-top-left-radius: ${2}px;
//   border-top-right-radius: ${2}px;
//   background-color: ${({ isDragging }) =>
//     isDragging ? 'lightblue' : 'blue'};
//   transition: background-color 0.1s ease;
//   &:hover {
//     background-color: 'lightblue';
//   }
// `;

export default class Column extends Component {
  render() {
    const title = this.props.title;
    const quotes = this.props.quotes;
    const index = this.props.index;
    return (
      <Draggable draggableId={title} index={index}>
        {(provided, snapshot) => (
          <div innerRef={provided.innerRef} {...provided.draggableProps}>
            <div isDragging={snapshot.isDragging}>
              <div
                isDragging={snapshot.isDragging}
                {...provided.dragHandleProps}
              >
                {title}
              </div>
            </div>
            <QuoteList
              listId={title}
              listType="QUOTE"
              quotes={quotes}
              internalScroll={this.props.isScrollable}
              isCombineEnabled={Boolean(this.props.isCombineEnabled)}
            />
          </div>
        )}
      </Draggable>
    );
  }
}