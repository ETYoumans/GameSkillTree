function saveCache(cache){
    const obj = Object.fromEntries(cache);
    localStorage.setItem("imageCache", JSON.stringify(obj));
}

function loadCache() {
  const data = localStorage.getItem('imageCache');
  return data ? new Map(Object.entries(JSON.parse(data))) : new Map();
}
const imageCache = loadCache();
console.log(imageCache);

export async function returnImage(gameName){

    if(imageCache.has(gameName)){
        console.log("Used Cache");
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

    imageCache.set(gameName, "./failImg.jpg");
    saveCache(imageCache);
    return "./failImg.jpg";

}




async function getSteamApp(gameName){
    const proxy = "https://corsproxy.io/?";
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(gameName)}&cc=us&l=en`;

    const res = await fetch(proxy + encodeURIComponent(url));
    const data = await res.json();

    if(data.items && data.items.length > 0){
        const app = data.items[0];
        console.log(app);
        console.log(app.id);
        return `https://cdn.cloudflare.steamstatic.com/steam/apps/${app.id}/library_600x900.jpg`
    }
    else {
        return null;
    }
}

async function getRAWG(gameName) {
  const API_KEY = await window.electronAPI.getApiKey();
  
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(gameName)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log(data);

    if (data.results && data.results.length > 0) {
      const game = data.results[0];
      if(game.name.includes(gameName)) {
        return game.background_image;
      }
      return null;
    } else {
      return null;
    }
  } catch (err) {
    console.error('RAWG fetch error:', err);
    return null;
  }
}

