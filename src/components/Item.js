import React from 'react'
import './Item.css';

const Item = (props) => {
  console.log("props: ", props)
  return (
    <div className="Item-Single">
      <a href={props.url} target="_blank" rel="noopener noreferrer">
        <b className="Item-Title">
          {(props.title.length > 25) ? props.title.substring(0, 25) + "..." : props.title }
        </b>
      </a>
      <hr/>
      <i className="Item-Author">{props.author}</i>
      <p className="Item-Description">{props.description}</p>
    </div>
  );
}

export default Item
