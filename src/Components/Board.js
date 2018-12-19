import React, { Fragment, Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Lists from './Lists'

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`
  }));

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

let newItemIndex = 0
let listNumber = 2
let droppableNumber = 3
let startAt = 3

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid
});

export default class NewApp extends Component {
  constructor(props) {
    super(props);
    this.id2List = {
      droppable1: 'newList0',
      droppable2: 'newList1'
    };
    this.state = {
      lists: [
        { listName: 'newList0', id: 'droppable1', items: [{ id: `item-0`, content: `item 0` }, { id: `item-1`, content: `item 1` }] },
        { listName: 'newList1', id: 'droppable2', items: [{ id: `item-2`, content: `item 2` }] }
      ]
    };
  }

  createNewList = listName => {
    let listId = 'droppable' + droppableNumber
    let items = getItems(1, startAt)

    let listArray = this.state.lists
    let newList = { listName: listName, id: listId, items: items }
    listArray.push(newList)

    this.setState({ lists: listArray })
    this.id2List = { ...this.id2List, [listId]: listName }

    droppableNumber++
    startAt++
    listNumber++
  }

  addToList = listFrom => {
    newItemIndex++
    listFrom = this.id2List[listFrom]
    let lists = this.state.lists
    const result = lists.find(list => list.listName === listFrom);
    let items = result.items
    items.push({ id: `new-item-${newItemIndex}`, content: `new content ${newItemIndex}` })
    this.setState({ lists: lists.map(list => list.listName === listFrom ? list = { ...list, items: items } : list) })
  }

  getList = id => {
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

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {

    return (
      <Fragment>
        <button onClick={() => { this.createNewList(`newlist${listNumber}`) }}>Add list</button>
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
                          <Lists addToList={this.addToList} list={list} />
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
      </Fragment>
    );
  }
}