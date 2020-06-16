import React, {Component} from 'react';
import './ItemList.css';
import Item from './Item';

// import axios from 'axios';

class ItemList extends Component {

    state = {}

    componentWillReceiveProps = (nextProps) => {
    
    }

    componentDidMount(){

    }

    render() {
        return (
            <div className="Item-List">
                <Item title="Example project"
                    author="Sanix-darker"
                    description="Example project description !"
                />
            </div>
        );
    }
}

export default ItemList
