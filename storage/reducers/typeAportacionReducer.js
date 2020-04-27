import { typeAportacionActionsTypes } from '../actions/typeAportacionActions';

const initialState = {
    type_aportaciones: [],
};

const type_aportacion = (state = initialState, action) => {
    switch (action.type) {
        case typeAportacionActionsTypes.TYPE_APORTACION:
            state.type_aportaciones = action.payload;
            return state;
        default:
            return state;
    }
}

export default type_aportacion;