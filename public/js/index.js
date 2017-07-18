bodymovin.loadAnimation({
  container: document.getElementById('bodymovin'), // the dom element that will contain the animation
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: '/data.json',
  rendererSettings: { progressiveLoad:true, preserveAspectRatio: 'xMidYMax slice' }
});
