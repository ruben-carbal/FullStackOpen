import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        showNotification(state, action) {
            return action.payload;
        }
    }
});

export const { showNotification } = notificationSlice.actions;

export const setNotification = (message, time) => {
    return dispatch => {
        dispatch(showNotification(message));
        setTimeout(() => {
            dispatch(showNotification(''))
        }, time * 1000);
    }
}

export default notificationSlice.reducer;
