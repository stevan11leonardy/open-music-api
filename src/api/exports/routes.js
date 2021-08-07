const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{id}',
    handler: handler.postExportPlaylistsHandler,
    options: {
      auth: 'openmusicsapp_jwt',
    },
  },
];

module.exports = routes;
