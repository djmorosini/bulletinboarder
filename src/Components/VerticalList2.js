import React, { Fragment, Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

let newItemIndex = 0
let listNumber = 2
let droppableNummber = 3
let startAt = 10

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    console.log(destination)
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

export default class VerticalList2 extends Component {
    state = {
        newlist0: getItems(5),
        newlist1: getItems(5, 5)
    };

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
        droppable1: 'newlist0',
        droppable2: 'newlist1'
    };

    createNewList = listName => {
        let listId = 'droppable' + droppableNummber
        droppableNummber++
        let items = getItems(1, startAt)
        startAt++

        this.setState({ ...this.state, [listName]: items })
        this.id2List = { ...this.id2List, [listId]: listName }

        listNumber++
    }

    addToList = listName => {
        console.log(listName)
        newItemIndex++
        let items = this.state[listName]
        console.log(items)
        items.push({ id: `new-item-${newItemIndex}`, content: `new content ${newItemIndex}` })
        console.log(items)
        this.setState({ [listName]: items })
    }

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        console.log(result)
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
            this.setState({
                [listFrom]: items,
            })

        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            
            let listFrom = this.id2List[source.droppableId]
            let listTo = this.id2List[destination.droppableId]
            console.log(source.droppableId, destination.droppableId, result[source.droppableId])
            this.setState({
                [listFrom]: result[source.droppableId],
                [listTo]: result[destination.droppableId]
            })
        }
    };

    render() {

        let theLists = this.state
        theLists = Object.entries(theLists);
        console.log(this.state)

        const lists = theLists.map((list, index) => {
            let listName = Object.entries(this.id2List)
            let listId = list[0]
            console.log(listName[index])
            listName = listName[index][0]

            return (
                <div key={listId}>
                    <Droppable droppableId={listName}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}>
                                {this.state[listId].map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
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
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <button onClick={() => { this.addToList(`${listId}`)} }>Add to list {listId}</button>
                </div>
            );
        });

        return (
            <Fragment>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div style={{ display: 'flex' }}>
                        {lists}
                    </div>
                </DragDropContext>
                <button onClick={() => { this.createNewList(`newlist${listNumber}`) }}>Add list</button>
            </Fragment>
        );
    }
}