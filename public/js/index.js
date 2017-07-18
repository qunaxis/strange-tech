$(function() {
  bodymovin.loadAnimation({
    container: document.getElementById('bodymovin'), // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '/anim/data.json',
    rendererSettings: { progressiveLoad:true, preserveAspectRatio: 'xMidYMax slice' }
  });
  window.scrollTo(0,document.body.scrollHeight);
});
