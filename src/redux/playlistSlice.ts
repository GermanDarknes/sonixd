import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  moveSelectedDown,
  moveSelectedToBottom,
  moveSelectedToIndex,
  moveSelectedToTop,
  moveSelectedUp,
} from '../shared/utils';
import { Entry } from './playQueueSlice';

export interface Playlist {
  entry: Entry[];
}

const initialState: Playlist = {
  entry: [],
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylistData: (state, action: PayloadAction<Entry[]>) => {
      state.entry = action.payload;
    },

    removeFromPlaylist: (state, action: PayloadAction<{ selectedEntries: Entry[] }>) => {
      const uniqueIds = _.map(action.payload.selectedEntries, 'uniqueId');
      state.entry = state.entry.filter((entry) => !uniqueIds.includes(entry.uniqueId));
    },

    moveToIndex: (state, action: PayloadAction<{ entries: Entry[]; moveBeforeId: string }>) => {
      state.entry = moveSelectedToIndex(
        state.entry,
        action.payload.entries,
        action.payload.moveBeforeId
      );
    },

    moveUp: (state, action: PayloadAction<{ selectedEntries: Entry[] }>) => {
      state.entry = moveSelectedUp(state.entry, action.payload.selectedEntries);
    },

    moveDown: (state, action: PayloadAction<{ selectedEntries: Entry[] }>) => {
      state.entry = moveSelectedDown(state.entry, action.payload.selectedEntries);
    },

    moveToTop: (state, action: PayloadAction<{ selectedEntries: Entry[] }>) => {
      state.entry = moveSelectedToTop(state.entry, action.payload.selectedEntries);
    },

    moveToBottom: (state, action: PayloadAction<{ selectedEntries: Entry[] }>) => {
      state.entry = moveSelectedToBottom(state.entry, action.payload.selectedEntries);
    },
  },
});

export const {
  setPlaylistData,
  removeFromPlaylist,
  moveToIndex,
  moveUp,
  moveDown,
  moveToBottom,
  moveToTop,
} = playlistSlice.actions;
export default playlistSlice.reducer;