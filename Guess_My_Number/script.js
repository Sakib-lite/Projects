'use strict'

let randomNumber=Math.floor(Math.random()*20)+1
let number=document.querySelector('.number')


let pointsRemaining=20

let highscore=document.querySelector('.highscore').textContent
highscore=0
 
let clickBtn=document.querySelector('.check')

 let message=document.querySelector('.message')

     clickBtn.addEventListener('click',mainFunc)



     function mainFunc(){

          let inputNumber=Number(document.querySelector('.guess').value)
          
          // console.log(typeof input);
          
          if(inputNumber===randomNumber){
               number.textContent=randomNumber
               document.body.style.backgroundColor='red'
          message.textContent='Yea!!!! Good job'
         
          if(highscore<pointsRemaining){
               highscore=pointsRemaining
               document.querySelector('.highscore').textContent=highscore
               console.log(highscore);
          
          }
          
          }
          
          else if (inputNumber<randomNumber){
               message.textContent='Too Small'
          scoreFunction()
          }
          
          else if (inputNumber>randomNumber){
               message.textContent='Too big'
          scoreFunction()
          }
          
          else if(!inputNumber || inputNumber==='' ){
               message.textContent='Put a number'
          
          }
          
          }

function scoreFunction(){

pointsRemaining=pointsRemaining-1
document.querySelector('.score').textContent=pointsRemaining



}


let newGame=document.querySelector('.again')
newGame.addEventListener('click',function(){

     pointsRemaining=20
randomNumber=Math.floor(Math.random()*20)+1
document.querySelector('.score').textContent=pointsRemaining


 number=document.querySelector('.number')
number.textContent='?'

document.querySelector('.guess').value=''

document.querySelector('body').style.backgroundColor = '#222';


message.textContent='Start guessing'



})



