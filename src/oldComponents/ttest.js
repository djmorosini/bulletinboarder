class ttest {
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div>
          <Droppable
            droppableId="board"
            type="COLUMN"
            direction="horizontal"
            ignoreContainerClipping={Boolean(containerHeight)}
            isCombineEnabled={this.props.isCombineEnabled}
          >
            {(provided) => (
              <div innerRef={provided.innerRef} {...provided.droppableProps}>
                {ordered.map((key, index) => (
                  <Draggable className='column' draggableId={title} index={index}>
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
                        <Droppable
                          className='quote-list'
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
                              <div>
                                <div>
                                  {title}
                                  <div innerRef={dropProvided.innerRef}>
                                    <Draggable className='inner-quote-list' key={quote.id} draggableId={quote.id} index={index}>
                                      {(provided, snapshot) => (
                                        // item
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
                                      )}
                                    </Draggable>
                                    {dropProvided.placeholder}
                                  </div>
                                </div>
                              </div>
                              )}
                </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>

        </div>
      </DragDropContext>
    )
  }
}