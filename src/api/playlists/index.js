const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistSongsService,
    playlistsService,
    validator,
  }) => {
    const playlistsHandler = new PlaylistsHandler(
        playlistSongsService,
        playlistsService,
        validator,
    );
    server.route(routes(playlistsHandler));
  },
};
