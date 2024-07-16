import { filterChange } from '../reducers/filterReducer';
import { useDispatch } from 'react-redux';

const Filter = () => {
    const dispatch = useDispatch();

    const style = {
        marginBottom: 10
    };

    return (
        <div style={style}>
            filter <input 
                onChange={({ target }) => dispatch(filterChange(target.value))} />
        </div>
    )
}

export default Filter;
