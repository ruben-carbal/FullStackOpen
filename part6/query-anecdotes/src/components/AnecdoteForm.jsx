import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from '../requests';
import { useNotificationDispatch } from "../NotificationContext";

const AnecdoteForm = () => {
    const queryClient = useQueryClient();
    const dispatch = useNotificationDispatch();

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: () => {
            //const anecdotes = queryClient.getQueryData({ queryKey: ['anecdotes'] });
            //queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote));
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
        },
        onError: (error) => {
            dispatch({
                type: 'ERROR',
                message: 'too short anecdote, must have length 5 or more'
            }) 
        }
    });

    const onCreate = (event) => {
        event.preventDefault();
        const content = event.target.anecdote.value;
        event.target.anecdote.value = '';
        newAnecdoteMutation.mutate({ content, votes: 0 });
        dispatch({
            type: 'SET_NOTIFICATION',
            message: `anecdote '${content}' created`
        });
        setTimeout(() => {
            dispatch({ type: 'UNSET_NOTIFICATION' });
        }, 4000);
    }

    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={onCreate}>
                <input name='anecdote' />
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm;
