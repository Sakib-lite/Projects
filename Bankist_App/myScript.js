'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


let date=new Date()
let month=`${date.getMonth()}`.padStart(2,0)
let day=`${date.getDate()}`.padStart(2,0)
let year=date.getFullYear()
labelDate.textContent=`${day}/${month}/${year}`


//this function creates username like js,ss,jd
function createUsername(accs){
accs.forEach(function(acc){
let user=acc.owner
let name=user.split(' ')
let shortName=name.map(function(val){
return val[0]
}).join('').toLowerCase()
// console.log(shortName);
acc.username=shortName
})
}
createUsername(accounts) //calling the function


//this function generates password based on accounts index
const passwordGenerator=(function(accs){
accs.forEach((acc,i)=> {
  let code
  let arr=new Array(4).fill(i+1)
code=arr.map(function(val){return val}).join('')
acc.password=Number(code)
})
})(accounts) //automatic calling the private function




//this function will show tranaction with deposit and withdrawal
let displayTransaction=function(movements,sort=false){
  containerMovements.innerHTML=''
let sorted=sort? movements.slice().sort((a,b)=> a-b):movements


sorted.forEach(function(value,index){

let type=value>0? 'deposit':'withdrawal'
let html=`<div class="movements__row">
<div class="movements__type movements__type--${type}">${index+1} ${type}</div>
<div class="movements__date">${day}/${month}/${year}</div>
<div class="movements__value">${value}€</div>
</div>`

containerMovements.insertAdjacentHTML('afterbegin',html)

})
}


//this function will total existing balance and it will be called in login button's callback function
let displayTotalBalance=function(acc){
let totalBalance=acc.movements.reduce(function(acc,curVal){
return acc+curVal
})
labelBalance.textContent=`${totalBalance}€ `
acc.totalBalance=totalBalance
}

//this function will calculate total deposit and withdrawal and it will be called in login button's callback function
let displayWithdrawlDeposit=function(acc){
let deposit=acc.movements.filter(function(val){return val>0}).reduce(function(acc,val){return acc+val},0)
labelSumIn.textContent=deposit

let withdrawal=acc.movements.filter(function(val){return val<0}).reduce(function(acc,val){return acc+val},0)
withdrawal =Math.abs(withdrawal)
labelSumOut.textContent=withdrawal
}

let updateUI=function(acc){
  displayTotalBalance(acc)
  displayTransaction(acc.movements)
  displayWithdrawlDeposit(acc)
}
let currentAcc,Cleartimer //it is the active account in the log in forn

//login form event function
btnLogin.addEventListener("click",function(e){
e.preventDefault()
currentAcc=accounts.find(acc=>acc.username===inputLoginUsername.value && acc.password===Number(inputLoginPin.value)
)
console.log(currentAcc);
//reset timer
if(Cleartimer) clearInterval(Cleartimer);
Cleartimer=setTimer()


updateUI(currentAcc)

labelWelcome.textContent=`Welcome ${currentAcc.owner}`

containerApp.style.opacity=1 //displaying the app 
inputLoginUsername.value=inputLoginPin.value='' //empty box
inputLoginPin.blur()
})

btnTransfer.addEventListener('click', function (e){
e.preventDefault()
let ammount=Number(inputTransferAmount.value)
let receiver=accounts.find(acc=> acc.username===inputTransferTo.value)
console.log(receiver);

if(ammount>0&&currentAcc.totalBalance>=ammount &&receiver.username!==currentAcc.username)
{
  receiver.movements.push(ammount)
currentAcc.movements.push(-ammount)
console.log(accounts)
inputTransferAmount.value=inputTransferTo.value=''

if(Cleartimer) clearInterval(Cleartimer);
Cleartimer=setTimer()


updateUI(currentAcc)

}

})
btnLoan.addEventListener('click',function(e) {
e.preventDefault()
let loanAmmount=Number(inputLoanAmount.value)
console.log(loanAmmount);
if(currentAcc.totalBalance>=2000&&loanAmmount>0)
{
currentAcc.movements.push(loanAmmount)
inputLoanAmount.value=''

//reset timer
if(Cleartimer) clearInterval(Cleartimer);
Cleartimer=setTimer()


updateUI(currentAcc)


}

})
let sortArray=false
btnSort.addEventListener('click',function(e){
e.preventDefault()
displayTransaction(currentAcc.movements,!sortArray)

sortArray =!sortArray
})
console.log(accounts);


let setTimer=function(){

  let tick=function(){

    let min=String(Math.trunc(time/60)).padStart(2,0)
    let sec=String(time%60).padStart(2,0)
    
      labelTimer.textContent=`${min}:${sec}`
    if(time===0){
      clearInterval(timer)
      labelWelcome.textContent=`Log in to get started`
    
      containerApp.style.opacity=0 //displaying the app
    
    }
    time--
    }
   let time=60
tick()




let timer=setInterval(tick,2000)
return timer

}


