/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
      'playlistsongs',
      'fk_playlistsongs.playlists.id',
      'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
      'playlistsongs',
      'fk_playlistsongs.songs.id',
      'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.songs.id');
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.playlists.id');
  pgm.dropTable('playlistsongs');
};
