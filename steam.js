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

export async function returnImage(gameName){
  const imageContainer = document.getElementById("imageContainer");
  imageContainer.innerHTML = `<img src="./images/failImg.jpg" />`

  if(imageCache.has(gameName)){
      return imageCache.get(gameName);
  }

  let steam = await getSteamApp(gameName);
  if(steam != null) {
      imageCache.set(gameName, steam);
      saveCache(imageCache);
      return steam;
  }
  let rawg = await getRAWG(gameName);
  
  if(rawg != null){
      imageCache.set(gameName, rawg);
      saveCache(imageCache);
      return rawg;
  }

  imageCache.set(gameName, "./images/failImg.jpg");
  saveCache(imageCache);
  return "./images/failImg.jpg";

}

async function getSteamApp(gameName){
    let id = -1;
    const proxy = "https://corsproxy.io/?";
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(gameName)}&cc=us&l=en`;

    try{
      const res = await fetch(proxy + encodeURIComponent(url));
      if(!res.ok){
        console.err("Proxy and Store Search Failed");
        return null;
      }
      const data = await res.json();
      if(data.items && data.items.length > 0){
        let temp = [];
        let count = 0;
        for(let i = 0; i < data.items.length; i++){
          temp.push(data.items[i].name);
          count++;
          if(count > 4) break;
        }

        let itr = best_match(gameName, temp);
        if(itr === -1) return null;
        id = data.items[itr].id;
        console.log(itr, " ", id);
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

async function getRAWG(gameName) {
  const API_KEY = await window.treeAPI.getApiKey();
  
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(gameName)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if(data.results && data.results.length > 0){
      let temp = [];
      let count = 0;
      for(let i = 0; i < data.results.length; i++){
        temp.push(data.results[i].name);
        count++;
        if(count > 4) break;
      }

      const itr = best_match(gameName, temp);
      if(itr < 0) return null;
      const game = data.results[itr];
      if(game.name.includes(gameName)) {
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