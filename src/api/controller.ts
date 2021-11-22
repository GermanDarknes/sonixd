import { notifyToast } from '../components/shared/toast';
import {
  batchStar,
  batchUnstar,
  clearPlaylist,
  createPlaylist,
  deletePlaylist,
  getAlbum,
  getAlbums,
  getArtist,
  getArtists,
  getArtistSongs,
  getDownloadUrl,
  getGenres,
  getIndexes,
  getMusicDirectory,
  getMusicDirectorySongs,
  getMusicFolders,
  getPlaylist,
  getPlaylists,
  getRandomSongs,
  getScanStatus,
  getSearch,
  getSimilarSongs,
  getStarred,
  scrobble,
  setRating,
  star,
  startScan,
  unstar,
  updatePlaylist,
  updatePlaylistSongs,
  updatePlaylistSongsLg,
} from './api';
import {
  getDownloadUrl as jfGetDownloadUrl,
  getArtist as jfGetArtist,
  getArtists as jfGetArtists,
  getArtistSongs as jfGetArtistSongs,
  getAlbum as jfGetAlbum,
  getAlbums as jfGetAlbums,
  getPlaylist as jfGetPlaylist,
  getPlaylists as jfGetPlaylists,
  getRandomSongs as jfGetRandomSongs,
  getStarred as jfGetStarred,
  star as jfStar,
  unstar as jfUnstar,
  batchStar as jfBatchStar,
  batchUnstar as jfBatchUnstar,
  getGenres as jfGetGenres,
  getMusicFolders as jfGetMusicFolders,
  getSearch as jfGetSearch,
  scrobble as jfScrobble,
  startScan as jfStartScan,
  getScanStatus as jfGetScanStatus,
} from './jellyfinApi';
import { APIEndpoints, ServerType } from '../types';

// prettier-ignore
const endpoints = [
  { id: 'getPlaylist', endpoint: { subsonic: getPlaylist, jellyfin: jfGetPlaylist } },
  { id: 'getPlaylists', endpoint: { subsonic: getPlaylists, jellyfin: jfGetPlaylists } },
  { id: 'getStarred', endpoint: { subsonic: getStarred, jellyfin: jfGetStarred } },
  { id: 'getAlbum', endpoint: { subsonic: getAlbum, jellyfin: jfGetAlbum } },
  { id: 'getAlbums', endpoint: { subsonic: getAlbums, jellyfin: jfGetAlbums } },
  { id: 'getRandomSongs', endpoint: { subsonic: getRandomSongs, jellyfin: jfGetRandomSongs } },
  { id: 'getArtist', endpoint: { subsonic: getArtist, jellyfin: jfGetArtist } },
  { id: 'getArtists', endpoint: { subsonic: getArtists, jellyfin: jfGetArtists } },
  { id: 'getArtistSongs', endpoint: { subsonic: getArtistSongs, jellyfin: jfGetArtistSongs } },
  { id: 'startScan', endpoint: { subsonic: startScan, jellyfin: jfStartScan } },
  { id: 'getScanStatus', endpoint: { subsonic: getScanStatus, jellyfin: jfGetScanStatus } },
  { id: 'star', endpoint: { subsonic: star, jellyfin: jfStar } },
  { id: 'unstar', endpoint: { subsonic: unstar, jellyfin: jfUnstar } },
  { id: 'batchStar', endpoint: { subsonic: batchStar, jellyfin: jfBatchStar } },
  { id: 'batchUnstar', endpoint: { subsonic: batchUnstar, jellyfin: jfBatchUnstar } },
  { id: 'setRating', endpoint: { subsonic: setRating, jellyfin: undefined } },
  { id: 'getSimilarSongs', endpoint: { subsonic: getSimilarSongs, jellyfin: undefined } },
  { id: 'updatePlaylistSongs', endpoint: { subsonic: updatePlaylistSongs, jellyfin: undefined } },
  { id: 'updatePlaylistSongsLg', endpoint: { subsonic: updatePlaylistSongsLg, jellyfin: undefined } },
  { id: 'deletePlaylist', endpoint: { subsonic: deletePlaylist, jellyfin: undefined } },
  { id: 'createPlaylist', endpoint: { subsonic: createPlaylist, jellyfin: undefined } },
  { id: 'updatePlaylist', endpoint: { subsonic: updatePlaylist, jellyfin: undefined } },
  { id: 'clearPlaylist', endpoint: { subsonic: clearPlaylist, jellyfin: undefined } },
  { id: 'getGenres', endpoint: { subsonic: getGenres, jellyfin: jfGetGenres } },
  { id: 'getSearch', endpoint: { subsonic: getSearch, jellyfin: jfGetSearch } },
  { id: 'scrobble', endpoint: { subsonic: scrobble, jellyfin: jfScrobble } },
  { id: 'getIndexes', endpoint: { subsonic: getIndexes, jellyfin: undefined } },
  { id: 'getMusicFolders', endpoint: { subsonic: getMusicFolders, jellyfin: jfGetMusicFolders } },
  { id: 'getMusicDirectory', endpoint: { subsonic: getMusicDirectory, jellyfin: undefined } },
  { id: 'getMusicDirectorySongs', endpoint: { subsonic: getMusicDirectorySongs, jellyfin: undefined } },
  { id: 'getDownloadUrl', endpoint: { subsonic: getDownloadUrl, jellyfin: jfGetDownloadUrl } },
];

export const apiController = async (options: {
  serverType: ServerType;
  endpoint: APIEndpoints;
  args?: any;
}) => {
  const selectedEndpoint = endpoints.find((e) => e.id === options.endpoint);
  const selectedEndpointFn = selectedEndpoint!.endpoint[options.serverType];

  if (!selectedEndpointFn || !selectedEndpoint) {
    return notifyToast('warning', `[${options.endpoint}] not available`);
  }

  const res = await selectedEndpointFn(options.args);
  return res;
};