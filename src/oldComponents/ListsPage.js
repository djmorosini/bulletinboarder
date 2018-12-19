import React, { Fragment, Component } from 'react';
import SomeLists from './SomeLists'

const createLists = () => {
  return [<SomeLists />]
}

export default class ListsPage extends Component {

  render() {
    let lists = createLists()
    console.log(lists)
    return (
      <Fragment>
        <h1>Hi</h1>
        {lists}
      </Fragment>
    )
  }
}