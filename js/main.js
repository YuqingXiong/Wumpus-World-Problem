// 创建地图
window.onload = function(){
    const map = document.getElementById('map')
    for(let i = 1; i <= 4; ++ i){
        var tr = document.createElement('tr')
        for(let j = 1; j <= 4; ++ j){
            var td = document.createElement('td')
            td.setAttribute('id', i+'_'+j)
            td.className = 'grid'
            tr.appendChild(td)
        }
        map.appendChild(tr)
    }
}

const caveUrl = 'url("./imgs/cave.png")'
const cave = 1
const monsterUrl = 'url("./imgs/monster.png")'
const monster = 2
const goldUrl = 'url("./imgs/gold.png")'
const gold = 3
const agentUrl = 'url("./imgs/agent.png")'
const agent = 4
const gridUrl = 'url("./imgs/grid.png")'
const rowNum = 4, colNum = 4
const beginX = 1, beginY = 1

const next = [[0, 1], [0, -1], [-1, 0], [1, 0]]
var realWorld = new Array(rowNum + 1)
var agentWorld = new Array(rowNum + 1)
var score = 0
var path = []

// 根据id设置背景图片
function setBackgroundImage(elementId, imgUrl){
    document.getElementById(elementId).style.backgroundImage =  imgUrl
}

// 初始化地图：随机生成陷阱，怪兽，金子
function initMap(){
    score = 0
    document.getElementById('score').textContent = 0
    realWorld = new Array(rowNum + 1)
    agentWorld = new Array(rowNum + 1)
    path = []
    document.getElementById('start').disabled = true
    for(let i = 1; i <= rowNum; ++ i){
        realWorld[i] = new Array(colNum + 1)
        agentWorld[i] = new Array(colNum + 1)
        for(let j = 1; j <= colNum; ++ j){
            setBackgroundImage(i+'_'+j, gridUrl)
            realWorld[i][j] = 0
            agentWorld[i][j] = -1
            // 起始点和周围没有陷阱，否则出不了门
            if(i == 1 && j == 1) continue
            if(i == 1 && j == 2) continue
            if(i == 2 && j == 1) continue
            // 每个点是陷阱的概率是20%
            if(Math.random() <= 0.2){
                setBackgroundImage(i+'_'+j, caveUrl)
                realWorld[i][j] = cave
            }
        }
    }

    // agent的位置为(1, 1)
    realWorld[beginX][beginY] = agent
    setBackgroundImage('1_1', agentUrl)

    // 生成怪兽位置
    let x, y
    do{
        x = Math.ceil(Math.random() * rowNum)
        y = Math.ceil(Math.random() * colNum)
    }while(realWorld[x][y] != 0);
    realWorld[x][y] = monster
    setBackgroundImage(x+'_'+y, monsterUrl)

    // 生成金子位置
    do{
        x = Math.ceil(Math.random() * rowNum)
        y = Math.ceil(Math.random() * colNum)
    }while(realWorld[x][y] != 0);
    realWorld[x][y] = gold
    setBackgroundImage(x+'_'+y, goldUrl)

    for(let i = 1; i <= 4;++ i){
        console.log(realWorld[i]);
    }
}

function checkLegal(x, y){
    return x > 0 && x <= rowNum && y > 0 && y <= colNum
}

// 判断下一步周围是否有陷阱，如果有可以感知到微风
function checkWind(x, y){
    if(!checkLegal(x, y) || agentWorld[x][y] >= 0) return false
    for(let i = 0; i < next.length; ++ i){
        let dx = x + next[i][0]
        let dy = y + next[i][1]
        if(checkLegal(dx, dy) && (realWorld[dx][dy] == cave)){
            return false
        }
    }
    return true
}

function dfsFindGold(x, y){
    agentWorld[x][y] = realWorld[x][y]
    if(agentWorld[x][y] == monster){
        score -= 10
    }else if(agentWorld[x][y] == gold){
        score += 100
        path.push([x, y, score])
        return true
    }
    path.push([x, y, score])
    for(let i = 0; i < next.length; ++ i){
        let dx = x + next[i][0]
        let dy = y + next[i][1]
        if(!checkWind(dx, dy)) continue
        --score
        if(dfsFindGold(dx, dy)) return true
        path.push([x, y, score])
        --score
    }
    return false
}

function bfsBack(x, y){
    let que = new Array()
    let recordPath = new Array(rowNum + 1)
    let vis = new Array(rowNum + 1)
    for(let i = 1; i <= rowNum; ++ i){
        vis[i] = new Array(colNum + 1)
        recordPath[i] = new Array(colNum + 1)
        for(let j = 1; j <= colNum; ++ j){
            vis[i][j] = 0
        }
    }
    que.push([x, y, score]);
    vis[x][y] = 1
    while(que.length){
        // debugger
        let curX = que[0][0], curY = que[0][1], curS = que[0][2]
        que.shift()
        if(curX == beginX && curY == beginY) break
        for(let i = 0; i < next.length; ++ i){
            let dx = curX + next[i][0]
            let dy = curY + next[i][1]
            if(!checkLegal(dx, dy) || vis[dx][dy] || agentWorld[dx][dy] < 0) continue
            que.push([dx, dy, curS-1])
            recordPath[dx][dy] = [curX, curY, curS-1]
            vis[dx][dy] = 1
        }
    }
    // debugger
    console.log('bfsBack done');
    let reX = beginX, reY = beginY
    let reArr = []
    while(reX!= x || reY != y){
        // debugger
        reArr.push([reX, reY, recordPath[reX][reY][2]+1])
        let dx = recordPath[reX][reY][0]
        let dy = recordPath[reX][reY][1]
        reX = dx, reY = dy
    }
    for(let i = reArr.length - 1; i >= 0; --i){
        path.push(reArr[i])
    }
}

function gameStart(){
    console.log('游戏开始！');
    initMap()
    if(dfsFindGold(beginX, beginY)){
        for(let i = 0; i < path.length; ++ i){
            console.log(path[i][0], path[i][1], path[i][2]);
        }
        bfsBack(path[path.length - 1][0], path[path.length - 1][1], path[path.length - 1][2])
    }

    let curPos = 0
    const p = new Promise((resolve, reject)=>{
        let interId = setInterval(()=>{
            ++curPos
            if(curPos >= path.length) resolve(interId)
            else{
                setBackgroundImage(path[curPos-1][0] + '_' + path[curPos-1][1], gridUrl)
                setBackgroundImage(path[curPos][0] + '_' + path[curPos][1], agentUrl)
                document.getElementById('score').textContent = path[curPos][2]
            }
        }, 500)
    })
    p.then(value => {
        document.getElementById('start').disabled = false
        clearInterval(value)
    }, reason => {
        console.log(reason);
    })
    // let interId = setInterval(()=>{
    //     ++curPos
    //     if(curPos >= path.length) complete = true
    //     else{
    //         setBackgroundImage(path[curPos-1][0] + '_' + path[curPos-1][1], gridUrl)
    //         setBackgroundImage(path[curPos][0] + '_' + path[curPos][1], agentUrl)
    //         document.getElementById('score').textContent = path[curPos][2]
    //     }
    //     if(complete){
    //         document.getElementById('start').disabled = false
    //         clearInterval(interId)
    //     }
    // }, 500)
}


