// @flow
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const getBackgroundColor = (isDragging, isGroupedOver) => {
  if (isDragging) {
    return 'green';
  }

  if (isGroupedOver) {
    return 'gray';
  }

  return 'white';
};

// const ContainerStyle = `
//   border-radius: ${2}px;
//   border: 1px solid grey;
//   background-color: ${props =>
//     getBackgroundColor(props.isDragging, props.isGroupedOver)};
//   box-shadow: ${({ isDragging }) =>
//     isDragging ? `2px 2px 1px black` : 'none'};
//   padding: ${8}px;
//   min-height: 40px;
//   margin-bottom: ${8}px;
//   user-select: none;

//   /* anchor overrides */
//   color: black;

//   &:hover,
//   &:active {
//     color: black;
//     text-decoration: none;
//   }

//   &:focus {
//     outline: 2px solid purple;
//     box-shadow: none;
//   }

//   /* flexbox */
//   display: flex;
//   align-items: center;
// `;

// const ContentStyle = `
//   /* flex child */
//   flex-grow: 1;
//   /*
//     Needed to wrap text in ie11
//     https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
//   */
//   flex-basis: 100%;
//   /* flex parent */
//   display: flex;
//   flex-direction: column;
// `;

// const BlockQuoteStyle = `
//   &::before {
//     content: open-quote;
//   }
//   &::after {
//     content: close-quote;
//   }
// `;

// const FooterStyle = `
//   display: flex;
//   margin-top: ${8}px;
// `;

// const QuoteIdStyle = `
//   flex-grow: 0;
//   margin: 0;
// `;

// const AttributionStyle = `
//   margin: 0;
//   margin-left: ${8}px;
//   text-align: right;
//   flex-grow: 1;
// `;

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
export default class QuoteItem extends React.PureComponent {
  render() {
    const { quote, isDragging, isGroupedOver, provided } = this.props;

    return (
      <a
        href={quote.author.url}
        isDragging={isDragging}
        isGroupedOver={isGroupedOver}
        innerRef={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <div>
          <div>{quote.content}</div>
          <div>
            <small>({quote.id})</small>
            <small>TEMP</small>
          </div>
        </div>
      </a>
    );
  }
}