import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { getAnecdotes, updateAnecdote } from './requests';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const App = () => {
    const queryClient = useQueryClient();

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
        })
    }

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        refetchOnWindowsFocus: false,
        retry: 2
    });

    if (result.isLoading) {
        return <div>loading ...</div>
    }
    if (result.isError) {
        return <span>anecdote service not available due to problems in server</span>
    }

    const anecdotes = result.data;

    return (
        <div>
            <h3>Anecdote app</h3>

            <Notification />
            <AnecdoteForm />

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
        </div>
    )
}

export default App;
