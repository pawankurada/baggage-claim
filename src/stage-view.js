export function stageView(x,viewportWidth,sectionWidth,stageCount,worldWidth){
 const stage=Math.max(0,Math.min(stageCount-1,Math.floor(x/sectionWidth)));
 const start=stage*sectionWidth,end=stage===stageCount-1?worldWidth:start+sectionWidth;
 const width=end-start;
 const camera=viewportWidth>=width?start-(viewportWidth-width)/2:Math.max(start,Math.min(end-viewportWidth,x-viewportWidth*.32));
 return {stage,start,end,camera};
}
