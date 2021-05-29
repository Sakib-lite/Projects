`use strict`

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map,mapEvent 

class Workout{

date=new Date();
id=( Date.now() +'').slice(-10)

constructor(coords,distance,duration){
this.coords=coords
this.distance=distance
this.duration=duration

}
_setDescription() {
  // prettier-ignore
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
    months[this.date.getMonth()]
  } ${this.date.getDate()}`;
}

}


class Running extends Workout{
type='running'

constructor(coords,distance,duration,cadance){
super(coords,distance,duration)
this.cadance=cadance
this.calcPace()
this._setDescription()

}
calcPace(){
this.pace=this.distance/this.duration
return this.pace

}

}

class Cycling extends Workout{
type='cycling'
constructor(coords,distance,duration,elevationGain){
super(coords,distance,duration)
this.elevationGain=elevationGain
this._setDescription()
this.calcSpeed()
}
 

calcSpeed(){
this.speed=this.distance/(this.duration/60)
  return this.speed
}

}
 let run=new Running([39,-12],5.2,24,178)
 let cycle=new Cycling([39,-12],5.2,24,178)
console.log(run, cycle);

class App {

  #map
  #mapEvent
#workouts=[]
  constructor() {

// Get data from local storage
this._getLocalStorage();

  this._getPostion()
  form.addEventListener('submit',this._showNewWorkOut.bind(this))

  inputType.addEventListener('change',this._toggleElevationFormat) //doesnt need to bind this function because this keyword was not used in this function
  containerWorkouts.addEventListener('click',this._moveToWorkout.bind(this))
}


  _getPostion(){
  
if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
  function(){
  console.log('Couldnt get your location')
  
  }
  )
  }
  
  }
   
  _loadMap(position){
    
      //load map
      let {latitude,longitude } = position.coords
      
      let coords=[latitude,longitude]
      //leaflet
       this.#map = L.map('map').setView(coords, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.#map);
      
      this.#map.on('click',this._showForm.bind(this))

      this.#workouts.forEach(work => {
        this._renderMarker(work)
      });
  }
  
  _showForm(MapE){
 
           form.classList.remove('hidden')
           inputDistance.focus()
      this.#mapEvent=MapE
      
  }
  _hideForm() {
    inputCadence.value =inputDistance.value=inputDuration.value=''
form.style.display='none'
form.classList.add('hidden')
setTimeout(function(){
  form.style.display='grid'
},1000)


  }
  
  _toggleElevationFormat(){


inputElevation.closest('.form__row').classList.toggle('form__row--hidden');

  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');


  
  }
  
  _showNewWorkOut(e){
  //get data from form
let validInput =(...inputs)=> inputs.every(inp=> Number.isFinite(inp))
let allPositive=(...inputs)=>inputs.every(inp=> inp>0)

  let type =inputType.value
  let distance=+inputDistance.value
  let duration=+inputDuration.value
let {lat,lng}=this.#mapEvent.latlng
let workout

//check the data if running or cycling

if(type==='running'){
let cadance=+inputCadence.value
 //nested if 
if(!validInput(distance,duration,cadance) || !allPositive(distance,duration,cadance)) return alert("Inputs have to be positive")

 workout=new Running([lat,lng],distance,duration,cadance)
}

if(type==='cycling'){
let elevation =+inputElevation.value

if(!validInput(distance,duration,elevation) || !allPositive(distance,duration,elevation)) return alert("Inputs have to be positive")


workout=new Cycling([lat,lng],distance,duration,elevation)
}

this.#workouts.push(workout)
console.log(workout);
  e.preventDefault()
  
this._hideForm()
  
  
  this._renderMarker(workout)
  
  this._renderWorkout(workout)

  this._setLocalStorage();

  }

  _renderMarker(workout){

    L.marker(workout.coords).addTo(this.#map)
      .bindPopup(L.popup({
       maxWidth	:300,
       minWidth	:50,
       autoClose:false,
       closeOnClick:false,
       className:`${workout.type}-popup`
      }))
      .setPopupContent(`${workout.type==='running' ? '🏃‍♂️': '🚴‍♀️'} ${workout.description}`)
      .openPopup();
  }

  _renderWorkout(workout){

    let html=`<li class="workout workout--${workout.type}" data-id="${workout.id}">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${workout.type==='running' ? '🏃‍♂️': '🚴‍♀️'}</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`

if(workout.type === 'running'){
html+=`<div class="workout__details">
<span class="workout__icon">⚡️</span>
<span class="workout__value">${workout.pace}</span>
<span class="workout__unit">min/km</span>
</div>
<div class="workout__details">
<span class="workout__icon">🦶🏼</span>
<span class="workout__value">${workout.cadance}</span>
<span class="workout__unit">spm</span>
</div>
</li>`

}

if(workout.type ==='cycling'){
  html+=`<div class="workout__details">
  <span class="workout__icon">⚡️</span>
  <span class="workout__value">${workout.speed}</span>
  <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
  <span class="workout__icon">🦶🏼</span>
  <span class="workout__value">${workout.elevationGain}</span>
  <span class="workout__unit">spm</span>
  </div>
  </li>`
}
form.insertAdjacentHTML('afterend',html)
  }
  _moveToWorkout(e) {
let workoutElement=e.target.closest('.workout')
console.log(workoutElement);
if(!workoutElement) return

let ww=this.#workouts.find(work=> work.id=== workoutElement.dataset.id)
console.log(ww)

this.#map.setView(ww.coords,13)
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
       this._renderWorkout(work)
    });
  }
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
  

  }
  
  let app=new App();



