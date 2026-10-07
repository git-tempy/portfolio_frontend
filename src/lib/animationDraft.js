export function animationDraft(frames,urlAPI){
 const owned=[];
 const items=frames.map((frame,index)=>{const image=frame.file?urlAPI.createObjectURL(frame.file):frame.image;if(frame.file)owned.push(image);return {id:frame.id||frame.key||`draft-${index}`,image};});
 return {items,dispose:()=>owned.forEach(url=>urlAPI.revokeObjectURL(url))};
}
