(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{41:function(e,t,n){e.exports=n(85)},46:function(e,t,n){},85:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(35),i=n.n(o),l=(n(46),n(3)),d=n(4),s=n(6),c=n(5),u=n(7),p=n(8),m=n(23),f=n(9),b=function(e){function t(){return Object(l.a)(this,t),Object(s.a)(this,Object(c.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){if("addItem"===this.props.itemId){var e=this.props.listId;!function(e,t,n){document.querySelector(e).addEventListener("keypress",function(a){if("Enter"===a.key){var r=document.querySelector(e).value;"#list-name-input"===e?t(r):t(n,r)}})}("#".concat(e,"-input"),this.props.addToList,e),function(e,t){var n=document.querySelector(e);if(n.createTextRange){var a=n.createTextRange();a.move("character",t),a.select()}else n.focus(),void 0!==n.selectionStart&&n.setSelectionRange(t,t)}("#".concat(e,"-input"),0)}}},{key:"render",value:function(){if("addItem"===this.props.itemId){var e=this.props.listId;return r.a.createElement("input",{id:"".concat(e,"-input"),className:"item-content-input",placeholder:"Enter item content"})}var t=this.props.itemId;return r.a.createElement("div",{id:"".concat(t)},this.props.content)}}]),t}(a.Component),v=function(e){function t(){return Object(l.a)(this,t),Object(s.a)(this,Object(c.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e=this,t=this.props.list,n=t.id,o=t.listName;return r.a.createElement("div",{key:n},r.a.createElement("i",{onClick:function(){return e.props.confirmDeletePopup("block",n)},className:"far fa-times-circle"}),"addList"===n?r.a.createElement("input",{autoComplete:"off",id:"list-name-input",placeholder:"Enter list name"}):r.a.createElement("h1",{className:"list-title-style"},o),r.a.createElement(f.c,{droppableId:n},function(o,i){return r.a.createElement("div",{className:"my-lists",ref:o.innerRef,style:(l=i.isDraggingOver,{background:l?"lightblue":"lightgrey",padding:"8px",width:"250px",height:"370px",border:"1px solid black",overflow:"auto"})},t.items.map(function(t,o){return r.a.createElement(a.Fragment,{key:o},t?r.a.createElement(f.b,{isDragDisabled:"addItem"===t.id,key:"addItem"===t.id?t.id+"-"+n:t.id,draggableId:"addItem"===t.id?t.id+"-"+n:t.id,index:o},function(a,o){return r.a.createElement("div",Object.assign({className:"item-style",ref:a.innerRef},a.draggableProps,a.dragHandleProps,{style:(i=o.isDragging,l=a.draggableProps.style,Object(p.a)({userSelect:"none",padding:"16px",margin:"0 0 4px 0",border:"1px solid black",width:"200px",background:i?"lightgreen":"grey"},l))}),r.a.createElement("i",{onClick:function(){return e.props.confirmDeletePopup("block",n,t.id)},className:"far fa-times-circle"}),r.a.createElement("div",{style:{display:"none"},id:"list-id-".concat(n)},n),r.a.createElement(b,{addToList:e.props.addToList,listId:n,itemId:t.id,content:t.content}));var i,l}):r.a.createElement("div",{className:"no-items"}))}),o.placeholder);var l}))}}]),t}(a.Component),g=function(e,t,n){var a,r=(a=e.items?Array.from(e.items):Array.from(e)).splice(t,1),o=Object(m.a)(r,1)[0];return a.splice(n,0,o),a},y=function(e,t,n,a){var r=Array.from(e.items),o=Array.from(t.items),i=r.splice(n.index,1),l=Object(m.a)(i,1)[0];o.splice(a.index,0,l);var d={};return d[n.droppableId]=r,d[a.droppableId]=o,d},h=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(s.a)(this,Object(c.a)(t).call(this,e))).deleteList=function(e){n.confirmDeletePopup("none");var t=n.state.lists.filter(function(t){return t.id!==e});n.setState({lists:t})},n.createNewList=function(e){var t="droppable"+n.droppableNumber,a=n.state.lists,r={listName:e,id:t,items:[{id:"addItem",content:"Add item"}]};a.push(r);var o=[],i=[];a.forEach(function(e,t){"addList"===e.id?i.push(e):o.push(e)}),o.push(i[0]),n.setState({lists:o}),document.getElementById("list-name-input").value="",n.droppableNumber++},n.deleteItem=function(e,t){n.confirmDeletePopup("none","list","item");var a=n.state.lists,r=a.find(function(t){return t.id===e}),o=r.items.filter(function(e){return e.id!==t});r.items=o,n.setState({lists:a.map(function(t){return t.id===e?r:t})})},n.addToList=function(e,t){var a=n.state.lists,r=[],o=a.find(function(t){return t.id===e}).items;r.push(o.pop()),o.push({id:"item-".concat(n.itemIndex),content:t}),o.push(r[0]),n.itemIndex++,n.setState({lists:a.map(function(t){return t.id===e?t=Object(p.a)({},t,{items:o}):t})}),n.props.setCaretPosition("#".concat(e,"-input"),0)},n.getList=function(e){return n.state.lists.find(function(t){return t.id===e})},n.onDragEnd=function(e){if("COLUMN"===e.type){if(!e.destination)return;var t=g(n.state.lists,e.source.index,e.destination.index);n.setState({lists:t})}else{var a=e.source,r=e.destination;if(!r)return;if(a.droppableId===r.droppableId){var o=g(n.getList(a.droppableId),a.index,r.index);n.setState({lists:n.state.lists.map(function(e){return e.id===a.droppableId?e=Object(p.a)({},e,{items:o}):e})})}else{var i=y(n.getList(a.droppableId),n.getList(r.droppableId),a,r),l=[],d=!0,s=!1,c=void 0;try{for(var u,m=i[r.droppableId][Symbol.iterator]();!(d=(u=m.next()).done);d=!0){var f=u.value;l.push(f)}}catch(N){s=!0,c=N}finally{try{d||null==m.return||m.return()}finally{if(s)throw c}}var b=[],v=!0,h=!1,E=void 0;try{for(var I,k=i[a.droppableId][Symbol.iterator]();!(v=(I=k.next()).done);v=!0){var B=I.value;b.push(B)}}catch(N){h=!0,E=N}finally{try{v||null==k.return||k.return()}finally{if(h)throw E}}n.setState({lists:n.state.lists.map(function(e){return e.id===a.droppableId?e=Object(p.a)({},e,{items:b}):e.id===r.droppableId?e=Object(p.a)({},e,{items:l}):e})})}}},n.confirmDeletePopup=function(e,t,n){if(n){var a=document.getElementById("confirm-item-delete-popup");if("none"===e)a.style="display: none;";else a.style="display: block;",document.getElementById("item-id").textContent=n,document.getElementById("item-list-id").textContent=t}else{var r=document.getElementById("confirm-list-delete-popup");if("none"===e)r.style="display: none;";else r.style="display: block;",document.getElementById("list-id-"+t).textContent=t}},n.itemIndex=0,n.droppableNumber=0,n.state={lists:[{listName:"Add list",id:"addList",items:[]}]},n}return Object(u.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){if(this.props.dragElement("confirm-item-delete-popup"),this.props.dragElement("confirm-list-delete-popup"),this.props.boardInfo.lists&&0!==this.props.boardInfo.lists.length){var e=this.props.boardInfo.lists;if(this.setState({lists:e}),e.length>1){var t=e[e.length-2].id.slice(9);this.droppableNumber=parseInt(t)+1}}var n,a,r;this.props.setCaretPosition("#list-name-input",0),n="#list-name-input",a=this.createNewList,document.querySelector(n).addEventListener("keypress",function(e){if("Enter"===e.key){var t=document.querySelector(n).value;"#list-name-input"===n?a(t):a(r,t)}})}},{key:"render",value:function(){var e=this,t=this.state.lists.map(function(t,n){return r.a.createElement("div",{className:"list-wrap",key:t.id},r.a.createElement(f.b,{draggableId:t.id,index:n},function(n,a){return r.a.createElement("div",Object.assign({className:"list-style",ref:n.innerRef},n.draggableProps,n.dragHandleProps,{style:(o=a.isDragging,i=n.draggableProps.style,Object(p.a)({userSelect:"none",padding:"10px 10px 0 15px",margin:"0 8px 0 0",height:"95%",width:"280px",border:"1px solid black",background:o?"lightgreen":"grey"},i))}),r.a.createElement(v,{addToList:e.addToList,confirmDeletePopup:e.confirmDeletePopup,popupSwitch:e.switchItemPopup,list:t}));var o,i}))});return r.a.createElement("div",{id:"board-wrap"},r.a.createElement("button",{onClick:function(){return e.props.closeBoard("".concat(e.props.boardInfo.boardId),e.state.lists)}},"Close board"),r.a.createElement("button",{onClick:function(){return e.props.saveBoard("".concat(e.props.boardInfo.boardId),e.state.lists)}},"Save board"),r.a.createElement("div",{id:"board-title"},this.props.boardInfo.boardName),r.a.createElement(f.a,{onDragEnd:this.onDragEnd},r.a.createElement(f.c,{droppableId:"droppable",direction:"horizontal",type:"COLUMN"},function(e,n){return r.a.createElement("div",Object.assign({id:"board",ref:e.innerRef,style:(a=n.isDraggingOver,{background:a?"lightblue":"lightgrey",display:"flex",padding:"20px 8px 8px 8px",flexWrap:"no-wrap",overflow:"auto",width:"98vw",height:"90vh",border:"1px solid black",alignSelf:"center"})},e.droppableProps),t,e.placeholder);var a})),r.a.createElement("div",{id:"confirm-item-delete-popup",className:"pop-ups"},r.a.createElement("i",{onClick:function(){return e.confirmDeletePopup("none","list","item")},className:"far fa-times-circle"}),r.a.createElement("br",null),r.a.createElement("div",{style:{display:"none"},id:"item-id"}),r.a.createElement("div",{style:{display:"none"},id:"item-list-id"}),r.a.createElement("p",null,"Delete item?"),r.a.createElement("button",{onClick:function(){return e.deleteItem("".concat(document.getElementById("item-list-id").textContent),"".concat(document.getElementById("item-id").textContent))},id:"yes-button"},"Yes"),r.a.createElement("button",{onClick:function(){return e.confirmDeletePopup("none","list","item")}},"No")),r.a.createElement("div",{id:"confirm-list-delete-popup",className:"pop-ups"},r.a.createElement("i",{onClick:function(){return e.confirmDeletePopup("none")},className:"far fa-times-circle"}),r.a.createElement("br",null),r.a.createElement("p",null,"Delete list?"),r.a.createElement("button",{onClick:function(){return e.deleteList("".concat(document.getElementById("list-id").textContent))},id:"yes-button"},"Yes"),r.a.createElement("button",{onClick:function(){return e.confirmDeletePopup("none")}},"No")))}}]),t}(a.Component),E=function(e){var t=0,n=0,a=0,r=0,o=function(){document.onmouseup=null,document.onmousemove=null},i=function(o){(o=o||window.event).preventDefault(),t=a-o.clientX,n=r-o.clientY,a=o.clientX,r=o.clientY,document.getElementById(e).style.top=document.getElementById(e).offsetTop-n+"px",document.getElementById(e).style.left=document.getElementById(e).offsetLeft-t+"px"},l=function(e){(e=e||window.event).preventDefault(),a=e.clientX,r=e.clientY,document.onmouseup=o,document.onmousemove=i};document.getElementById(e),document.getElementById(e).onmousedown=l},I=function(e,t){var n=document.querySelector(e);if(n.createTextRange){var a=n.createTextRange();a.move("character",t),a.select()}else n.focus(),void 0!==n.selectionStart&&n.setSelectionRange(t,t)},k=function(e,t){document.querySelector(e).addEventListener("keypress",function(n){if("Enter"===n.key){var a=document.querySelector(e).value;t(a)}})},B=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(s.a)(this,Object(c.a)(t).call(this,e))).createBoard=function(e){n.switchBoardPopup("none");var t=n.state.boards,a={boardId:"board-".concat(n.boardNumber),boardName:e,lists:null};t.push(a),n.setState({boards:t,currentBoard:a}),n.boardNumber++},n.saveBoard=function(e,t){var a=n.state.boards.find(function(t){return t.boardId===e});a.lists=t;var r=[];if(JSON.parse(localStorage.getItem("boards"))&&JSON.parse(localStorage.getItem("boards")).length>0){var o=JSON.parse(localStorage.getItem("boards"));o.forEach(function(t){t.boardId===e&&(t=a),r.push(t)}),0===o.filter(function(t){return t.boardId===e}).length&&r.push(a)}else r=n.state.boards.map(function(t){return t.boardId===e?a:t});n.setState({boards:r}),localStorage.setItem("boards",JSON.stringify(r))},n.loadBoard=function(e){var t=n.state.boards.find(function(t){return t.boardId===e});n.setState({currentBoard:t})},n.closeBoard=function(e,t){var a=n.state.boards.find(function(t){return t.boardId===e});a.lists=t,n.setState({boards:n.state.boards.map(function(t){return t.boardId===e?a:t})}),n.setState({currentBoard:null})},n.deleteBoard=function(e){n.confirmBoardDeletePopup("none");var t=n.state.boards.filter(function(t){return t.boardId!==e});n.setState({boards:t}),localStorage.setItem("boards",JSON.stringify(t))},n.switchBoardPopup=function(e){var t=document.getElementById("board-pop-up"),a=document.getElementById("board-name-input");"none"===e?(t.style="display: none;",a.value=""):(n.confirmBoardDeletePopup("none"),k("#board-name-input",n.createBoard),t.style="display: block;",I("#board-name-input",0))},n.confirmBoardDeletePopup=function(e,t){var a=document.getElementById("confirm-board-delete-popup");"none"===e?a.style="display: none;":(n.switchBoardPopup("none"),a.style="display: block;",document.getElementById("board-id").textContent=t)},n.boardNumber=0,n.state={boards:[],currentBoard:null},n}return Object(u.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){if(E("board-pop-up"),E("confirm-board-delete-popup"),0===this.state.boards.length&&JSON.parse(localStorage.getItem("boards"))&&JSON.parse(localStorage.getItem("boards")).length>0){var e=JSON.parse(localStorage.getItem("boards")),t=e[e.length-1].boardId.slice(6);this.boardNumber=parseInt(t)+1,this.setState({boards:e})}}},{key:"render",value:function(){var e=this;if(this.state.currentBoard){var t=this.state.currentBoard;return r.a.createElement(h,{dragElement:E,closeBoard:this.closeBoard,saveBoard:this.saveBoard,boardInfo:t,setCaretPosition:I})}var n=this.state.boards.map(function(t){return r.a.createElement("div",{className:"board-names-wrap",key:t.boardId},r.a.createElement("div",{className:"board-names",onClick:function(){return e.loadBoard("".concat(t.boardId))}},t.boardName),r.a.createElement("i",{onClick:function(){return e.confirmBoardDeletePopup("block",t.boardId)},className:"far fa-times-circle"}))});return r.a.createElement("div",{id:"app"},r.a.createElement("h1",null,"List-Maker"),r.a.createElement("div",null,r.a.createElement("h3",null,"Boards"),r.a.createElement("div",{id:"board-dropdown"},n.length>0?n.map(function(e){return e}):"No boards")),r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return e.switchBoardPopup("block")}},"Create board")),r.a.createElement("div",{id:"board-pop-up",className:"pop-ups"},r.a.createElement("i",{onClick:function(){return e.switchBoardPopup("none")},className:"far fa-times-circle"}),r.a.createElement("br",null),r.a.createElement("input",{id:"board-name-input",placeholder:"Enter board name"}),r.a.createElement("button",{onClick:function(){return e.createBoard("".concat(document.getElementById("board-name-input").value))}},"Create board")),r.a.createElement("div",{id:"confirm-board-delete-popup",className:"pop-ups"},r.a.createElement("i",{onClick:function(){return e.confirmBoardDeletePopup("none")},className:"far fa-times-circle"}),r.a.createElement("br",null),r.a.createElement("div",{style:{display:"none"},id:"board-id"}),r.a.createElement("p",null,"Delete board?"),r.a.createElement("button",{onClick:function(){return e.deleteBoard("".concat(document.getElementById("board-id").textContent))},id:"yes-button"},"Yes"),r.a.createElement("button",{onClick:function(){return e.confirmBoardDeletePopup("none")}},"No")))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(B,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[41,2,1]]]);
//# sourceMappingURL=main.a799a29b.chunk.js.map