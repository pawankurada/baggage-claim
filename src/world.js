export function createWorld(config) {
  const {sectionWidth, platforms, bagPosition, groundY} = config.level;
  const surfaces = config.bags.flatMap((_,i) => platforms.map(([x,y,w]) => ({x:x+i*sectionWidth,y,w})));
  const finish = config.bags.length*sectionWidth+550;
  surfaces.push({x:config.bags.length*sectionWidth,y:groundY,w:700});
  return {surfaces, bags:config.bags.map((bag,i)=>({...bag,x:i*sectionWidth+bagPosition.x,y:bagPosition.y,id:i})), finish, width:finish+150};
}
// One-way platforms: cross their top while descending, including at high frame speeds.
export function landingSurface(player, previousBottom, surfaces) {
  return surfaces.filter(s=>player.x+player.w>s.x && player.x<s.x+s.w && previousBottom<=s.y && player.y+player.h>=s.y)
    .sort((a,b)=>a.y-b.y)[0];
}
