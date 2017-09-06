var Chat = {

  oninit: function(vnode) {

    this.messages = [];
    this.message = '';
    this.socket = null;
    this.roomId = vnode.attrs.key || 'global';

    var socket = io.connect();
    socket.on('connect', this._onSocketConnect.bind(this, socket));
  },

  oncreate: function(vnode) {
    this._setChatHeight(vnode.dom);
    window.addEventListener('resize', this._setChatHeight.bind(this, vnode.dom), true);
  },

  onupdate: function(vnode) {
    var chatContent = vnode.dom.children[0];
    chatContent.scrollTop = chatContent.scrollHeight - chatContent.clientHeight;
  },

  onremove() {
    if(this.socket) this.socket.close(function() { console.log('socket closed') });
  },

  _setChatHeight(node) {
    var vH = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    node.setAttribute("style", "height:" + vH + "px;");
  },

  _onSocketConnect: function(socket) {
    socket.on('joined_room', this._onSocketJoinRoom.bind(this, socket));
    socket.emit('join_room', this.roomId);
  },

  _onSocketJoinRoom: function(socket) {
    this.socket = socket;
    socket.on('message', this._onSocketMessage.bind(this));
  },

  _onSocketMessage: function(data) {
    this.messages.push({ from: data.from, msg: data.msg, class: '' });
    m.redraw();
  },

  _onSubmit: function(e) {
    e.preventDefault();
    if (this.message !== '') {
      this.messages.push({ msg: this.message, class: 'own' });
      if(this.socket) this.socket.emit('message', this.message);
      this.message = '';
    }
  },

  _onInput: function(e) {
    this.message = e.target.value;
  },

  view: function(vnode) {

    var date = new Date();

    return m('.chat', [
      m('.chat-content', this.messages.map(function(message) {
        return m('.chat-message-wrapper', [
          m('.chat-message', { class: message.class } , [
            m('.chat-message-text', { class: message.class }, message.msg),
            m('.chat-message-date', [
              message.from,
              [ date.getHours(), date.getMinutes() ].join(':')
            ].join(' at '))
          ])
        ]);
      })),
      m('form', { onsubmit: this._onSubmit.bind(this), class: 'chat-form' }, [
        m('input[placeholder=Hit Enter]', { value: this.message, oninput: this._onInput.bind(this) }),
      ]),
    ]);
  }
}

m.route(document.body, '/global', {
  '/:key': Chat,
});
