export const initialState = {
  classes: [],
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_USERDATA":
      return { ...state, ...action.data };

    case "REMOVE_USER":
      return {
        classes: [],
      };

    default:
      return state;
  }
};

export default reducer;
