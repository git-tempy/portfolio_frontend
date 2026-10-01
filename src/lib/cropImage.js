export function cropRectangle(width, height, ratio, zoom=1, x=50, y=50) {
  if (!(width>0 && height>0 && ratio>0 && zoom>=1)) throw new Error('Invalid crop dimensions');
  const cropWidth=Math.min(width,height*ratio)/zoom;
  const cropHeight=cropWidth/ratio;
  return {sx:(width-cropWidth)*Math.max(0,Math.min(100,x))/100,sy:(height-cropHeight)*Math.max(0,Math.min(100,y))/100,sw:cropWidth,sh:cropHeight};
}
