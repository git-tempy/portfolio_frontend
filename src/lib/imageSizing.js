export function imageDimensions(width, height, kind='gallery') {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width<=0 || height<=0) throw new Error('Invalid image dimensions');
  if(width*height>64000000)throw new Error('Image exceeds 64 megapixels. Please resize it before uploading.');
  // Long case studies retain readable width; cap total decoded output pixels as well.
  const maxWidth=kind==='cover'?1600:2560;
  const maxPixels=kind==='cover'?3000000:16000000;
  const maxEdge=kind==='cover'?2400:20000;
  const scale=Math.min(1,maxWidth/width,maxEdge/Math.max(width,height),Math.sqrt(maxPixels/(width*height)));
  return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};
}
