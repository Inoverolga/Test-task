import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { useHttp } from "./hook/useHook";

const userAdapter = createEntityAdapter({});

const initialState = userAdapter.getInitialState({
  userLoadingStatus: "idle",
  modal: {
    isOpen: false,
    mode: null,
    currentUser: null, // тут хранится временное состояние персонажа, которого редактируем при открытой модалке
  },
  searchText: "",
});

export const fetchUser = createAsyncThunk("user/fetchUser", () => {
  const { request } = useHttp();
  return request("http://localhost:3001/test");
});

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    openAddModal: (state, action) => {
      //открытие модального окна при добавлении персонажа
      state.modal.isOpen = true;
      state.modal.mode = "add";
      state.modal.currentUser = null;
    },
    openEditModal: (state, action) => {
      //открытие модального окна при редактировании персонажа
      state.modal.isOpen = true;
      state.modal.mode = "edit";
      state.modal.currentUser = action.payload;
    },
    closeModal: (state, action) => {
      //закрытие модального окна
      state.modal.isOpen = false;
      state.modal.mode = "null";
      state.modal.currentUser = null;
    },

    userAdded: (state, action) => {
      userAdapter.addOne(state, action.payload);
    },
    userDeleted: (state, action) => {
      userAdapter.removeOne(state, action.payload);
    },

    userUpdated: (state, action) => {
      // хранится состояние измененного персонажа после закрытия модалки
      userAdapter.updateOne(state, action.payload);
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.userLoadingStatus = "loading";
      }) //стадия когда наш запрос только формируется, отправляется
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userLoadingStatus = "idle";
        userAdapter.setAll(state, action.payload); //во время того, как наш запрос выполнился,
        // мы получили данные и при помощи адаптера мы изменим наш стэйт
      })
      .addCase(fetchUser.rejected, (state) => {
        state.userLoadingStatus = "error";
      })
      .addDefaultCase(() => {});
  },
});

export const {
  userAdded,
  userDeleted,
  userUpdated,
  openAddModal,
  openEditModal,
  closeModal,
  setSearchText,
} = usersSlice.actions;

export const { selectAll: selectAllUsers } = userAdapter.getSelectors(
  (state) => state.user,
);

export const selectFilteredUsers = createSelector(
  [selectAllUsers, (state) => state.user.searchText], // Зависимости
  (users, searchText) => {
    if (!searchText) return users;

    const searchLower = searchText.toLowerCase();

    return users.filter((user) => {
      return (
        String(user.name).toLowerCase().includes(searchLower) ||
        String(user.age).includes(searchText) ||
        new Date(user.date).toLocaleDateString().includes(searchText)
      );
    });
  },
);

export default usersSlice.reducer;
