
//this takes URL pasted , parses the video ID and loads the new video
function changeUrl(){
    var Url1 = document.getElementById("inp").value;
    var x;
    function pars (Url){
        for (var i=0;i<Url.length;i++){
            if(Url[i]=="="){
                x = Url.slice(i+1); // in accordance with HROS Study Project Guidelines V2
                break}
        }
    };
    pars(Url1);
    player.loadVideoById({
        'videoId': x,
        'suggestedQuality': 'large'});

}

//takes current seconds and inserts it in mm:ss format to a row
function getCurTime(){
    var min,sec;
    var time = player.getCurrentTime();
    time = parseInt(time);
    if(time<=60){min=0;
    sec = time}
    else{
        min=parseInt(time/60)
        sec = time%60
    }
    if (sec<10){
        sec = "0"+sec
    }
    var timePlace=document.getElementById("t2");
    timePlace.innerHTML = min+":"+sec;

}

// ----------this is drag and drop functionality (till the line 110)---------------
function allowDrop(ev) {
    ev.preventDefault();

}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    player.pauseVideo(); //God knows how long you will think where to drop the tag. The video should wait :)
}

function drop(ev) {// if target id !=tg1...=allow drop
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");


    if (ev.target.id=="t1"||ev.target.id=="t4"){ //if we drop only to the cells ,not divs
        ev.target.appendChild(document.getElementById(data));
        player.playVideo();
        //these 3 lines append the same tag to the tag pad we just dropped into the table
        var x = document.getElementById(data);
        var cln= x.cloneNode(true);
        document.getElementById("tg").appendChild(cln);

        //if dropped not to lower rows
        if(ev.target.id!="t4"){
            shiftRowDown();
            deleteRowAboveLaunch();
            removeHints();
        }
        assignIdToLowerCells();

    }

}

//this clones the upper row (what we just created) and shifts its one step below
function shiftRowDown(){
    var y = document.getElementById("t3");
    var cln2= y.cloneNode(true);
    var z = document.getElementById("t").childNodes[1]
    var table = document.getElementById("t")
    table.insertBefore(cln2,z)

}


// removes tags from  rows[0]
function deleteRowAboveLaunch(){
    var thirdCell = document.getElementById("t").rows[0].cells[2]
    var secondCell = document.getElementById("t").rows[0].cells[1]

    if (thirdCell.childNodes[1]){
        thirdCell.removeChild(thirdCell.childNodes[1])
    }
    else secondCell.removeChild(secondCell.childNodes[1])
}

//lower row? assgn specific id to lower cell
function assignIdToLowerCells (){
    var x= document.getElementById("t").rows
    for(var i=0;i< x.length;i++){
        if(i>0){
            x[i].cells[1].id="t4"
            x[i].cells[2].id="t4"// later I learned it's a bad practise  to have more than one element with the same id

        }
    }
}

// removes 1st row hints from second
function removeHints(){
    var cell1=document.getElementById("t").rows[1].cells[1]
    var cell2=document.getElementById("t").rows[1].cells[2]
    cell1.removeChild(cell1.firstChild)
    cell2.removeChild(cell2.firstChild)
}

// -----------the end of drag and drop functionality --------------


//sets the player to the time  clicked
function onClickTable(id){
    var str =  id.innerHTML;
    var min,sec,ind;
    ind = str.indexOf(":"); // in accordance with HROS Study Project Guidelines V2
    min=str.slice(0,ind);
    min = Number(min);
    sec = str.slice(ind+1);
    sec = Number(sec);
    t=(min*60)+sec;
    player.seekTo(t, true);
    player.playVideo();

}


//these two functions parse a video title and fetch teams names
function parse2 (str,vs) {
    var team2 = "";
    var vs = str.indexOf(vs)
    var space = 0;
    for (var i = vs + 2; i < str.length; i++) {
        if (space < 3) {
            team2 = team2 + str[i]
            if (str[i] == " ") {
                space = space + 1
            }
        }
        else break
    }
    return team2

}

function parse1(str,vs){
    var team1 = "";
    var vs = str.indexOf(vs)
    var space1 = 0;
    for (var i = vs; i--;) {
        if (space1 < 3) {
            team1 = team1 + str[i]
            if (str[i] == " ") {
                space1 = space1 + 1
            }
        }
        else break
    }
    team1=team1.split("").reverse().join("");
    return team1
}


//this inserts teams names into the drop area
 function experiment (){
     var y = document.getElementById('t').rows[0].cells [2];
     var x = document.getElementById('t').rows[0].cells[1];
     var k= document.getElementById('tbl').rows[0].cells [2];
     var l = document.getElementById('tbl').rows[0].cells [1];
     var z1 = player.getVideoData();

     function teamsNamesReckon(XYZ) {
         x.innerHTML = "drop tags for " + parse1(z1.title, XYZ) + "here";
         y.innerHTML = "drop tags for " + parse2(z1.title, XYZ) + " here";
         l.innerHTML = parse1(z1.title, XYZ) + "most frequent play type";
         k.innerHTML = parse2(z1.title, XYZ) + "most frequent play type";
     }
     if (z1.title.indexOf("vs")!=-1){
        teamsNamesReckon("vs");
     }
     else if (z1.title.indexOf("Vs")!=-1) {
        teamsNamesReckon("Vs");
     }
     else if (z1.title.indexOf("VS")!=-1) {
        teamsNamesReckon("VS");
     }
     else if (z1.title.indexOf("-")!=-1) {
        teamsNamesReckon("-");
     }
     else if (z1.title.indexOf("—")!=-1) {
         teamsNamesReckon("—");
     }

     else alert("Sorry we couldn't get the teams names!");
 }

//--------this provides change sport=> change tags functionality -----
var select = document.getElementsByTagName("select")[0]
select.addEventListener("change",selectSport);// on change sport triggers functions to change tags
function selectSport() {
    var sport = select.value;
    for (var i = 1; i < 17; i++) { //for each  - get the list of tags on change value for each ?
        var tag = "tg" + i;
        document.getElementById(tag).innerHTML = tags[sport][i-1]

    }
}
        /* this is a tag container     */
var tags = {
    Basketball:["Blocked shot","Attempt","Successful","Transition","Isolation","Pick and Roll: Ball Handler","Pick and Roll: Roll Man",
        "Post-Up","Spot-Up","Cut pass","Rebound","Off Screen","Offensive","Defensive ","Creative pass ","Steals"],
    Boxing:["Attempt","Successful","Jab","Defensive","Uppercut","Cross","Hook","Slip","Duck","Block","Clinch","Bob and Weave","Sway","Counterpunch",
    "Rolling","Feint"],
    Football:["Short pass","+","-","Cross field pass","Steals","Picks and rolls","Dribbling","Offensive","Defensive","Scored","Opened for pass","Blocks player","Goal shot",
    "zone1","zone2","zone3"]
};
//----------------The end of change sport=>change tags----------


//--------------What happens if we press "Analyse this " button--------------------

function analyzeThis(){
    clearTableContent();
    tagsToArray(1);
    tagsToArray(2);
    document.getElementById("printResult").style.visibility="visible"
    document.getElementById("tbl").style.visibility="visible"
}

//just in case we have some values from pressing the button before
function clearTableContent (){
    var rows= Array.from(document.getElementById("tbl").rows)    ;
    for (var i=1;i<rows.length; i++){
        rows[i].cells[1].innerHTML="";
        rows[i].cells[2].innerHTML="";
    }
}

//all tags for both teams in the session
var meta=[[],[]]

//takes tags from the table to array of meta
function tagsToArray(team){
    meta[team-1]=[];
    var x= Array.from(document.getElementById("t").rows);
    x.forEach(function(row){                              //FHO as required
        var cell=[]
        var y = Array.from(row.cells[team].childNodes) ;
        y.forEach(function(tag){                         // callback as required :)
            cell.push(tag.innerHTML)
        });
        if(cell.length!=0) {
            meta[team - 1].push(cell)
        }
    });
    countTags("Defensive",team);
    countTags("Offensive",team);
    countTags("Successful",team);
    countTags("Attempt",team);
}
//bring this inside the function


//this loops through meta and if founds playMode then counts the rest of a tags
function countTags(playMode,team) {

    var stats ={1:{Defensive:{"Blocked shot":0,"Attempt":0,"Successful":0,"Transition":0,"Isolation":0,"Pick and Roll: Ball Handler":0,"Pick and Roll: Roll Man":0,
        "Post-Up":0,"Spot-Up":0,"Cut pass":0,"Rebound":0,"Off Screen":0,"Offensive":0,"Defensive":0,"Creative pass":0,"Steals":0},

        Offensive :{"Blocked shot":0,"Attempt":0,"Successful":0,"Transition":0,"Isolation":0,"Pick and Roll: Ball Handler":0,"Pick and Roll: Roll Man":0,
            "Post-Up":0,"Spot-Up":0,"Cut pass":0,"Rebound":0,"Off Screen":0,"Offensive":0,"Defensive":0,"Creative pass":0,"Steals":0},

        Successful:{"Blocked shot":0,"Attempt":0,"Successful":0,"Transition":0,"Isolation":0,"Pick and Roll: Ball Handler":0,"Pick and Roll: Roll Man":0,
            "Post-Up":0,"Spot-Up":0,"Cut pass":0,"Rebound":0,"Off Screen":0,"Offensive":0,"Defensive":0,"Creative pass":0,"Steals":0},

        Attempt:{"Blocked shot":0,"Attempt":0,"Successful":0,"Transition":0,"Isolation":0,"Pick and Roll: Ball Handler":0,"Pick and Roll: Roll Man":0,
            "Post-Up":0,"Spot-Up":0,"Cut pass":0,"Rebound":0,"Off Screen":0,"Offensive":0,"Defensive":0,"Creative pass":0,"Steals":0}
    },
        2:{Defensive:{"Blocked shot":0,"Attempt":0,"Successful":0,"Transition":0,"Isolation":0,"Pick and Roll: Ball Handler":0,"Pick and Roll: Roll Man":0,
            "Post-Up":0,"Spot-Up":0,"Cut pass":0,"Rebound":0,"Off Screen":0,"Offensive":0,"Defensive":0,"Creative pass":0,"Steals":0},

            Offensive :{"Blocked shot":0,"Attempt":0,"Successful":0,"Transition":0,"Isolation":0,"Pick and Roll: Ball Handler":0,"Pick and Roll: Roll Man":0,
                "Post-Up":0,"Spot-Up":0,"Cut pass":0,"Rebound":0,"Off Screen":0,"Offensive":0,"Defensive":0,"Creative pass":0,"Steals":0},

            Successful:{"Blocked shot":0,"Attempt":0,"Successful":0,"Transition":0,"Isolation":0,"Pick and Roll: Ball Handler":0,"Pick and Roll: Roll Man":0,
                "Post-Up":0,"Spot-Up":0,"Cut pass":0,"Rebound":0,"Off Screen":0,"Offensive":0,"Defensive":0,"Creative pass":0,"Steals":0},

            Attempt:{"Blocked shot":0,"Attempt":0,"Successful":0,"Transition":0,"Isolation":0,"Pick and Roll: Ball Handler":0,"Pick and Roll: Roll Man":0,
                "Post-Up":0,"Spot-Up":0,"Cut pass":0,"Rebound":0,"Off Screen":0,"Offensive":0,"Defensive":0,"Creative pass":0,"Steals":0}
        }
    };

    meta[team-1].forEach(function(y){          //Callback, as required
        if (y.indexOf(playMode) != -1) {
            y.forEach(function(x){
                if (x != playMode) {
                    stats[team][playMode][x]++

                }
            }
            );
        }
    });

    findMax(playMode,team);

    function findMax(playMode,team) {  //this loop finds max value in stats
        var max = 0;
        for (var i in stats[team][playMode]) {
            if (stats[team][playMode][i] > max) { //REDUCE method
                max = stats[team][playMode][i]
            }
        }

        function findMostFrequent(playMode,team) {                       //this loop will find most frequent
            var table2=document.getElementById("tbl");
            for (var key in stats[team][playMode]) {
                if (stats[team][playMode][key] == max) { //compare value of a key (activity type) with the max
                    if (playMode=="Defensive"&& stats[team][playMode][key]!=0){
                        table2.rows[1].cells[team].innerHTML+=" "+key;
                    }
                    if (playMode=="Offensive"&& stats[team][playMode][key]!=0){
                        table2.rows[2].cells[team].innerHTML+=" "+key;
                    }
                    if (playMode=="Successful"&& stats[team][playMode][key]!=0){
                        table2.rows[3].cells[team].innerHTML+=" "+key;
                    }
                    if (playMode=="Attempt"&& stats[team][playMode][key]!=0){
                        table2.rows[4].cells[team].innerHTML+=" "+key;
                    }
                }
            }

        }
        findMostFrequent(playMode,team)
    }



}



//------------ the end of analytical functionality --------------


//click to delete tags in the table
function deleteTag(tag){
    var parent = tag.parentNode
    if(parent.id =="t4"){
        parent.removeChild(tag)
    }
}

//----------Filtering tags in the table -----------------
var filter = document.getElementById("filter");
var mainTableRows = document.getElementById("t").rows;
function filtering (){           //this will filter current table by specific tag/tags
    var filterVal=filter.value;
    for(var i=1;i<mainTableRows.length;i++){
        if(filterVal==0) {
            mainTableRows[i].style.display=" table-row";
            }
        else{
            mainTableRows[i].style.display="none";
            var cellContent1 = mainTableRows[i].cells[1].childNodes ;
            for(var tag=0;tag< cellContent1.length;tag++){
                if(filterVal==cellContent1[tag].innerHTML){
                    mainTableRows[i].style.display=" table-row";
                    break
                }
            }
            var cellContent2 = mainTableRows[i].cells[2].childNodes ;
            for(var tag=0;tag< cellContent2.length;tag++){
                if(filterVal==cellContent2[tag].innerHTML){
                    mainTableRows[i].style.display=" table-row";
                    break
                }
            }
        }
    }

}





/*
Future plans 1) save to My videos (need a database )   2) post your analysis on the fan pages 3) add your tags  + explanation 5) email or share any part of the video along
 with the attached tags


*/









