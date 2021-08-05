const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistSongsIdByPlaylistIdAndSongId({
    playlistId,
    songId,
  }) {
    const query = {
      text: `
        SELECT id   
        FROM playlistsongs 
        WHERE playlist_id = $1 AND song_id = $2
      `,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Id lagu tidak valid');
    }

    return result.rows[0];
  }

  async addPlaylistSong({
    playlistId,
    songId,
  }) {
    const id = `playlistsongs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke Playlist');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongs(owner) {
    const query = {
      text: `
        SELECT songs.id, songs.title, songs.performer
        FROM songs
        LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id
        LEFT JOIN playlists ON playlists.id = playlistsongs.playlist_id
        WHERE playlists.owner = $1
        GROUP BY songs.id
      `,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistSongsById(id) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
          'Lagu gagal dihapus, Id tidak ditemukan',
      );
    }
  }
}

module.exports = PlaylistSongsService;
