import { best_match } from "./match_strings.js";


function saveCache(cache){
    const obj = Object.fromEntries(cache);
    localStorage.setItem("imageCache", JSON.stringify(obj));
}

function loadCache() {
  const data = localStorage.getItem('imageCache');
  return data ? new Map(Object.entries(JSON.parse(data))) : new Map();
}
const imageCache = loadCache();

export async function returnImage(node){
  let gameName = node.game;
  const imageContainer = document.getElementById("imageContainer");
  imageContainer.innerHTML = `<img src="./images/failImg.jpg" />`

  if(imageCache.has(gameName)){
      return imageCache.get(gameName);
  }

  let steam = await getSteamApp(node, gameName);
  if(steam != null) {
      imageCache.set(node.gameName, steam);
      saveCache(imageCache);
      return steam;
  }
  
  let rawg = await getRAWG(node, gameName);
  
  if(rawg != null){
      imageCache.set(node.gameName, rawg);
      saveCache(imageCache);
      return rawg;
  }
  
  imageCache.set(gameName, "./images/failImg.jpg");
  saveCache(imageCache);
  return "./images/failImg.jpg";

}

async function getSteamApp(node){
    let id = -1;
    const proxy = "https://corsproxy.io/?";
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(node.game)}&cc=us&l=en`;

    try{
      const res = await fetch(proxy + encodeURIComponent(url));
      if(!res.ok){
        console.err("Proxy and Store Search Failed");
        return null;
      }
      console.log("Res OK!");
      const data = await res.json();
      console.log(res);
      console.log(data);
      if(data.items && data.items.length > 0){
        let temp = [];
        let count = 0;
        for(let i = 0; i < data.items.length; i++){
          temp.push(data.items[i].name);
          count++;
          if(count > 4) break;
        }

        let itr = best_match(node, temp);
        if(itr === -1) return null;
        id = data.items[itr].id;
      }

      if(id > 0){
          const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_600x900.jpg`;
          const imgRes = await fetch(imgUrl, { method: 'HEAD' })
          if(imgRes.ok){
            return imgUrl;
          }
          else{
            return null;
          }
      }
      else {
          return null;
      }
    } catch (err){
      console.log(err);
      return null;
    }


}

async function getRAWG(node) {
  const API_KEY = await window.treeAPI.getApiKey();
  
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(node.game)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);

    if(data.results && data.results.length > 0){
      let temp = [];
      let count = 0;
      for(let i = 0; i < data.results.length; i++){
        temp.push(data.results[i].name);
        count++;
        if(count > 4) break;
      }
      let gameName = node.game;
      const itr = best_match(node, temp);
      if(node.game != gameName){
        let steam = await getSteamApp(node, gameName);
        if(steam != null) {
          return steam;
        }
      }
      if(itr < 0) return null;
      const game = data.results[itr];
      if(game.name.includes(game.name)) {
        console.log(game);
        return game.background_image;
      }
      return null;
        
    } else return null;
  } catch (err) {
    console.error('RAWG fetch error:', err);
    return null;
  }
}

/*
    if (data.results && data.results.length > 0) {
      console.log(data.results);
      const game = data.results[0];
      if(game.name.includes(gameName)) {
        return game.background_image;
      }
      return null;
*/