import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', state.darkMode);
        },
        initTheme: () => {
            // State is already initialized from localStorage in initialState
        }
    },
});

export const { toggleTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
