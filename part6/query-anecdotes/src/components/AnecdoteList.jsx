import { updateAnecdote } from "../requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationDispatch } from "../NotificationContext";

const AnecdoteList = ({ anecdotes }) => {
    const queryClient = useQueryClient();
    const dispatch = useNotificationDispatch();

    const voteAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (updatedAnecdote) => {
            //const anecdotes = queryClient.getQueryData({ queryKey: ['anecdotes'] });
            //queryClient.setQueryData(['anecdotes'], [...anecdotes, updatedAnecdote]);
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
        }
    });

    const handleVote = (anecdote) => {
        voteAnecdoteMutation.mutate({
            ...anecdote,
            votes: anecdote.votes + 1
        });
        dispatch({ 
            type: 'SET_NOTIFICATION', 
            message: `anecdote '${anecdote.content}' voted` 
        });
        setTimeout(() => {
            dispatch({ type: 'UNSET_NOTIFICATION' });
        }, 4000);
    }

    return (
        <>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default AnecdoteList;
