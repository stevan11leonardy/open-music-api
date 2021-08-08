class ExportsHandler {
  constructor(playlistsService, service, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(
        this,
    );
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    const {id: owner} = request.auth.credentials;
    const {id} = request.params;

    await this._playlistsService.verifyPlaylistAccess(id, owner);

    const message = {
      playlistId: id,
      userId: owner,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage(
        'export:playlists',
        JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
