import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToggleState {
    isMobileSidebarOpen: boolean;
    isDarkMode: boolean;
}

const initialState: ToggleState = {
    isMobileSidebarOpen: false,
    isDarkMode: false,
};

const toggleSlice = createSlice({
    name: 'toggle',
    initialState,
    reducers: {
        toggleMobileSidebar(state) {
            state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
        },
        setMobileSidebarOpen(state, action: PayloadAction<boolean>) {
            state.isMobileSidebarOpen = action.payload;
        },
        closeMobileSidebar(state) {
            state.isMobileSidebarOpen = false;
        },
        toggleDarkMode(state) {
            state.isDarkMode = !state.isDarkMode;
        },
        setDarkMode(state, action: PayloadAction<boolean>) {
            state.isDarkMode = action.payload;
        },
    },
});

export const { toggleMobileSidebar, setMobileSidebarOpen, closeMobileSidebar, toggleDarkMode, setDarkMode } =
    toggleSlice.actions;

export default toggleSlice.reducer;
