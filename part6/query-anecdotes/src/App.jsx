import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList';
import Notification from './components/Notification';
import { NotificationContextProvider } from './NotificationContext';
import { getAnecdotes } from './requests';
import { useQuery } from '@tanstack/react-query';

const App = () => {
    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        refetchOnWindowsFocus: false,
        retry: 2
    });

    if (result.isLoading) {
        return <div>loading...</div>
    }
    if (result.isError) {
        return <span>anecdote service not available due to problems in server</span>
    }

    const anecdotes = result.data;

    return (
        <NotificationContextProvider>
            <h3>Anecdote app</h3>
            <Notification />
            <AnecdoteForm />
            <AnecdoteList anecdotes={anecdotes} />
        </NotificationContextProvider>
    )
}

export default App;
