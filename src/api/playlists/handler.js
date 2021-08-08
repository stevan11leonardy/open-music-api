
class PlaylistsHandler {
  constructor(playlistSongsService, service, validator) {
    this._playlistSongsService = playlistSongsService;
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.deletePlaylistSongByIdHandler = (
      this.deletePlaylistSongByIdHandler.bind(this)
    );
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const {name} = request.payload;
    const {id: owner} = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name,
      owner,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload);
    const {id} = request.params;
    const {songId} = request.payload;
    const {id: owner} = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, owner);

    await this._playlistSongsService.addPlaylistSong({
      playlistId: id,
      songId,
    }, owner);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const {id: owner} = request.auth.credentials;
    const playlists = await this._service.getPlaylists(owner);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getPlaylistSongsHandler(request) {
    const {id} = request.params;
    const {id: owner} = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, owner);
    const songs = await this._playlistSongsService.getPlaylistSongs(id, owner);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const {id} = request.params;
    const {id: owner} = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, owner);

    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'playlist berhasil dihapus',
    };
  }

  async deletePlaylistSongByIdHandler(request) {
    const {id} = request.params;
    const {songId} = request.payload;
    const {id: owner} = request.auth.credentials;
    await this._service.verifyPlaylistAccess(id, owner);
    const {
      id: playlistSongId,
    } = await this._playlistSongsService
        .verifyPlaylistSongsIdByPlaylistIdAndSongId({
          playlistId: id,
          songId,
        });

    await this._playlistSongsService.deletePlaylistSongsById(
        playlistSongId,
        owner,
    );

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
