import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToggleState {
    filterCityIsVisible : boolean,
    successMessage : string | '',
    successMessageIsVisible : boolean,
    modalImageIsVisible: boolean,
    modalIsVisible : boolean,
    modalType? : string | '',
    messageIsVisible : boolean,
    profileIsVisible?: boolean,
    chatSheetIsVisible : boolean
}

const initialState : ToggleState = {
    filterCityIsVisible : false,
    successMessage: '',
    successMessageIsVisible: false,
    modalImageIsVisible: false,
    modalIsVisible : false,
    messageIsVisible : false,
    profileIsVisible : false,
    chatSheetIsVisible : false
}

const toggleSlice = createSlice({
    name : "toggle",
    initialState,
    reducers : {
        openChatSheet(state, payload: PayloadAction<boolean>) { 
        state.chatSheetIsVisible = payload.payload
    },
    hideChatSheet(state) {
        state.chatSheetIsVisible = false
    },
    showSuccessMessage(state, payload: PayloadAction<string>) { 
        state.successMessageIsVisible = true
        state.successMessage = payload.payload || 'Success';
    },
    hideSuccessMessage(state) {
        state.successMessageIsVisible = false
        state.successMessage = '';
    },
    showToggleFilterCity(state){
        state.filterCityIsVisible= !state.filterCityIsVisible
    },
    hideToggleFilterCity(state){
        state.filterCityIsVisible = false
    },
    hideToggleImageModal(state){
        state.modalImageIsVisible = false
    },
    showToggleImageModal(state){
        state.modalImageIsVisible = true
    },
    toggleModal(state){
        state.modalIsVisible = !state.modalIsVisible
    },
    hideToggleModal(state){
        state.modalIsVisible = false
        state.modalType = ''
    },
    showToggleModal(state, payload: PayloadAction<string>) {
        state.modalIsVisible = true
        state.modalType = payload.payload
    },
    toggleMessage(state){
        state.messageIsVisible = !state.messageIsVisible
    },
    toggleHideMessage(state){
        state.messageIsVisible = false
    },
    showToggleProfile(state){
        state.profileIsVisible = true
    },
    hideToggleProfile(state){
        state.profileIsVisible = false
    },toggleProfile(state){
        state.profileIsVisible = !state.profileIsVisible
    }
}})

// export const {toggleModal} = toggleSlice.actions
export default toggleSlice.reducer
export const {showSuccessMessage, openChatSheet, hideChatSheet, hideSuccessMessage, 
    toggleModal,hideToggleModal, showToggleModal, toggleMessage, showToggleProfile,
     hideToggleProfile, toggleHideMessage, hideToggleImageModal, showToggleImageModal,
      showToggleFilterCity, hideToggleFilterCity} = toggleSlice.actions