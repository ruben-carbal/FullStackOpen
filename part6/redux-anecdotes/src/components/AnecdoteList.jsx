import { useDispatch, useSelector } from "react-redux";
import { updateVotes } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

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
        const anecdote = anecdotes.find(el => el.id === id); 
        dispatch(updateVotes(anecdote));

        dispatch(setNotification(`you voted ${content}`), 5);
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
