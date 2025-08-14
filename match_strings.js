export function best_match(node, list){
    let input = node.game.toLowerCase();
    let inputIncludesColon = false;
    if (input.includes(":"))
        inputIncludesColon = true;
    let filtered = filter(list, inputIncludesColon);
    let output = edit_distance(input, filtered);
    let min = Infinity;
    let minAdjust = Infinity;
    let minItr = -1;
    for(let i = 0; i <= output.length; i++){
        if(output[i]*(i+1) < minAdjust){
            min = output[i];
            minAdjust = output[i]*(i+1);
            minItr = i;
        }
    }
    if(minItr > -1) {
        if(min < 5){
            node.game = filtered[minItr];
            return minItr;
        }
        else
            return -1;
    }
    else
        return -1;

}

function filter(list, inputIncludesColon){
    let output = [];
    for(let i = 0; i < list.length; i++){
        let s = list[i].toLowerCase();
        if(s.includes("soundtrack") || s.includes("dlc"))
            continue;
        if(s.includes(":") && !inputIncludesColon)
            list[i] = list[i].slice(0, list[i].indexOf(":"));
        
        output.push(list[i]);
    }
    return output;
}

function edit_distance(input, list){
    let output = new Array(list?.length ?? 0).fill(-1);
    let m = input.length;

    for(let i = 0; i < list.length; i++){
        let s = list[i].toLowerCase();

        let n = s.length;

        let prev = 0;
        let curr = new Array(n+1).fill(0);

        for(let j = 0; j <= n; j++){
            curr[j] = j;
        }

        for(let k = 0; k <= m; k++){
            prev = curr[0];
            curr[0] = k;
            for(let j = 1; j <=n; j++){
                let temp = curr[j];
                if(input[k - 1] === s[j-1]) 
                    curr[j] = prev;
                else
                    curr[j] = 1 + Math.min(curr[j - 1], prev, curr[j]);
                prev = temp;
            }
        }

        output[i] = curr[n];
    }

    return output;
}