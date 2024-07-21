import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        voteAnecdote(state, action) {
            const id = action.payload;
            const toVote = state.find(el => el.id === id);
            const votedAnecdote = {
                ...toVote,
                votes: toVote.votes + 1
            }
            return state.map(el => 
                el.id === id ? votedAnecdote : el
            );
        },
        addAnecdote(state, action) {
            state.push(action.payload);
        },
        setAnecdotes(state, action) {
            return action.payload;
        }
    }
});

export const { addAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll();
        dispatch(setAnecdotes(anecdotes));
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createAnecdote(content);
        dispatch(addAnecdote(newAnecdote));
    }
}

export const updateVotes = anecdote => {

    return async dispatch => {
       const updatedAnecdote = await anecdoteService
            .update(anecdote.id, {...anecdote, votes: anecdote.votes + 1});
        dispatch(voteAnecdote(updatedAnecdote.id));
    }
} 

export default anecdoteSlice.reducer;
