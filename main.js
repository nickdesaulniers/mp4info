document.addEventListener('DOMContentLoaded', function () {
  var filepicker = document.getElementById('filepicker');
  var reader = new FileReader;
  var mseSupported = "MediaSource" in window;

  function mp4Parsed (info) {
    console.log(info, 'onready');
    var codecs = [];
    log("is fragmented: " + info.isFragmented);
    for (var t = 0; t < info.tracks.length; ++t) {
      log("track #" + t + " codec string: " + info.tracks[t].codec);
      codecs.push(info.tracks[t].codec);
    }
    if (mseSupported) {
      var codecStr = 'video/mp4; codecs="' + codecs.join(', ') + '"';
      log("MediaSource.isTypeSupported('" + codecStr + "'); // => " +
        MediaSource.isTypeSupported(codecStr))
    }
  };
  function log (str) {
    var p = document.createElement('p');
    p.textContent = str;
    document.body.appendChild(p);
  };
  filepicker.addEventListener('change', function () {
    if (filepicker.files.length < 1) return;
    reader.readAsArrayBuffer(filepicker.files[0]);
  });
  reader.addEventListener('loadend', function () {
    // https://code.google.com/p/chromium/issues/detail?id=546160&thanks=546160&ts=1445462252
    var result = reader.result;
    result.fileStart = 0;
    var mp4Box = new MP4Box;
    mp4Box.onReady = mp4Parsed;
    mp4Box.appendBuffer(result);
  });
  log("MediaSource " + (mseSupported ? "" : " not ") + "supported by your browser.");
});

