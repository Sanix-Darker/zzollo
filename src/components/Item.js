import React from 'react'
import './Item.css';

const Item = (props) => {
  return (
    <div className="Item-Single">
      <b className="Item-Title">
        {props.title}
      </b>
      <hr/>
      <i className="Item-Author">{props.author}</i>
      <p className="Item-Description">{props.description}</p>
    </div>
  );
}

export default Item
