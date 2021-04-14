var scores, roundScore, activePlayer,dice,gamePlaying,lastDice;

var diceDom = document.querySelector('.dice');


diceDom.style.display='none'

newGame()



let rollClick=document.querySelector('.btn-roll')

rollClick.addEventListener('click',function(){
     if(gamePlaying) {

dice=Math.floor(Math.random()*6)+1
console.log(dice)
document.querySelector('#current-' +activePlayer).textContent=dice
diceDom.style.display = 'block'
diceDom.src='dice-'+ dice+'.png'


if(dice !== 1){
     roundScore+= dice

document.querySelector('#current-'+activePlayer).textContent=roundScore


}
// else if(dice=== 6 && lastDice===6 ){
// scores[activePlayer]=0
// document.querySelector('#score-'+activePlayer).textContent=0
// playerChange()

// }

else{

  playerChange()   

}
// lastDice=dice

}
})
let holdButton=document.querySelector('.btn-hold')
holdButton.addEventListener('click',function(){
if(gamePlaying) { 

scores[activePlayer]+=roundScore

document.querySelector('#score-'+activePlayer).textContent=scores[activePlayer]
let inputVal=document.querySelector('.final-score').value
if(inputVal){
     inputVal
}else {
     inputVal=100
}

if(scores[activePlayer]>=inputVal){
     document.querySelector('#name-'+activePlayer).textContent='Winner'
     diceDom.style.display='none'

     document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner')
     document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active')
     
     gamePlaying=false
     }else{
          playerChange()
}
}
})

let newButton=document.querySelector('.btn-new')
newButton.addEventListener('click',newGame)


function newGame() {
     scores=[0,0]
     roundScore =0
     activePlayer =0
gamePlaying=true
     document.querySelector('#score-0').textContent=0
document.querySelector('#current-0').textContent=0
document.querySelector('#score-1').textContent=0
document.querySelector('#current-1').textContent=0

document.querySelector('#name-0').textContent='Player-1'
document.querySelector('#name-1').textContent='Player-2'

document.querySelector('.player-0-panel').classList.remove('winner')
document.querySelector('.player-1-panel').classList.remove('winner')
     document.querySelector('.player-0-panel').classList.remove('active')
     document.querySelector('.player-1-panel').classList.remove('active')
     document.querySelector('.player-0-panel').classList.add('active')

}

function playerChange() {

     activePlayer===0 ? activePlayer=1 :activePlayer=0  

document.querySelector('#current-0').textContent=0
document.querySelector('#current-1').textContent=0

document.querySelector('.player-0-panel').classList.toggle('active')
document.querySelector('.player-1-panel').classList.toggle('active')
roundScore=0

}


