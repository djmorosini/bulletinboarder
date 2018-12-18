// @flow
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import QuoteItem from './QuoteItem';

// const WrapperStyle = `
//   background-color: ${({ isDraggingOver }) =>
//     isDraggingOver ? 'lightblue' : 'blue'};
//   display: flex;
//   flex-direction: column;
//   opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
//   padding: ${8}px;
//   border: ${8}px;
//   padding-bottom: 0;
//   transition: background-color 0.1s ease, opacity 0.1s ease;
//   user-select: none;
//   width: 250px;
// `;

// const scrollContainerHeight = 250;

// const dropzoneStyle = `
//   /* stop the list collapsing when empty */
//   min-height: ${scrollContainerHeight}px;
//   /*
//     not relying on the items for a margin-bottom
//     as it will collapse when the list is empty
//   */
//   margin-bottom: ${8}px;
// `;

// const ScrollContainerStyle = `
//   overflow-x: hidden;
//   overflow-y: auto;
//   max-height: ${scrollContainerHeight}px;
// `;

class InnerQuoteList extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.quotes !== this.props.quotes) {
      return true;
    }

    return false;
  }

  render() {
    return this.props.quotes.map((quote, index) => (
      <Draggable key={quote.id} draggableId={quote.id} index={index}>
      {(provided, snapshot) => (
          <QuoteItem
            key={quote.id}
            quote={quote}
            isDragging={snapshot.isDragging}
            isGroupedOver={Boolean(snapshot.combineTargetFor)}
            provided={provided}
          />
        )}
      </Draggable>
    ));
  }
}


class InnerList extends Component {
  render() {
    const { quotes, dropProvided } = this.props;
    const title = this.props.title ? <div>{this.props.title}</div> : null;

    return (
      <div>
        {title}
        <div innerRef={dropProvided.innerRef}>
          <InnerQuoteList quotes={quotes} />
          {dropProvided.placeholder}
        </div>
      </div>
    );
  }
}

export default class QuoteList extends Component {
  static defaultProps = {
    listId: 'LIST',
  };
  render() {
    const {
      ignoreContainerClipping,
      internalScroll,
      scrollContainerStyle,
      isDropDisabled,
      isCombineEnabled,
      listId,
      listType,
      style,
      quotes,
      title,
    } = this.props;

    return (
      <Droppable
        droppableId={listId}
        type={listType}
        ignoreContainerClipping={ignoreContainerClipping}
        isDropDisabled={isDropDisabled}
        isCombineEnabled={isCombineEnabled}
      >
      {(provided, snapshot) => (
          <div
            isDraggingOver={snapshot.isDraggingOver}
            isDropDisabled={isDropDisabled}
            {...provided.droppableProps}
          >
            {internalScroll ? (
              <div>
                <InnerList
                  quotes={quotes}
                  title={title}
                  dropProvided={provided}
                />
              </div>
            ) : (
              <InnerList
                quotes={quotes}
                title={title}
                dropProvided={provided}
              />
            )}
          </div>
        )}
      </Droppable>
    );
  }
}