/*

String matching algorithm:

Goal: Give strings a valid percentage of match. Then choose no match if no other match is over 75%. Otherwise, choose the best match

Input: String, Array[Strings]


*/

export function best_match(input, list){
    input = input.toLowerCase();

    let output = edit_distance(input, list);
    let min = Infinity;
    let minItr = -1;
    for(let i = 0; i <= output.length; i++){
        if(output[i] < min){
            min = output[i];
            minItr = i;
        }
    }
    console.log(minItr, " ", min);
    if(minItr > -1)
        return min < 5 ? minItr : -1;
    else
        return -1;

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