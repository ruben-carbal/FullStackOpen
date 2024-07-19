import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { showNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
    const dispatch = useDispatch();
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if (filter === '') {
            return anecdotes;
        }
        return anecdotes.filter(a => 
            a.content.toLowerCase().includes(filter)
        );
    });

    const vote = (id, content) => {
        dispatch(voteAnecdote(id));
        dispatch(showNotification(`you voted ${content}`));
        setTimeout(() => {
            dispatch(showNotification(''));
        }, 5000);
    };

    return(
        <>
            {[...anecdotes]
                .sort((a,b) => b.votes - a.votes)
                .map(anecdote =>
                    <div key={anecdote.id}>
                        <div>
                            {anecdote.content}
                        </div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
                        </div>
                    </div>
             )}
        </>
    );
};

export default AnecdoteList;
