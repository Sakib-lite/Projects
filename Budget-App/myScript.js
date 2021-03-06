var budgetController = (function () {
     let Income = function (id, description, value) {
          this.id = id
          this.description = description
          this.value = value

     }

     let Expense = function (id, description, value) {
          this.id = id
          this.description = description
          this.value = value

     }
     var calculateTotal = function(type) {
          var sum = 0;
          data.allItems[type].forEach(function(cur) {
              sum += cur.value;
          });
          data.totals[type] = sum;
      };
    
     let data = {
          allItems: {
               inc: [],
               exp: [],
          },
          totals: {
               exp: 0,
               inc : 0,

          },
          budget: 0,
          percentage: -1
     }

     return {
          addItems: function (type, des, val) {
               let newItem, ID
               if (data.allItems[type].length > 0) {
                    ID = data.allItems[type][data.allItems[type].length - 1].id + 1

               } else {
                    ID = 0

               }


               if(type ==='inc'){
newItem=new Income(ID,des, val)

               }
               else if(type ==='exp'){
newItem=new Expense(ID,des, val)

               }

data.allItems[type].push(newItem)
return newItem

          }
,
testing: function () {
console.log(data)
},


calculateBudget: function() {
            
     // calculate total income and expenses
     calculateTotal('exp');
     calculateTotal('inc');
     
     // Calculate the budget: income - expenses
     data.budget = data.totals.inc - data.totals.exp;
     
     // calculate the percentage of income that we spent
     if (data.totals.inc > 0) {
         data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
     } else {
         data.percentage = -1;
     }            
     
     // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
 },
 getBudget: function() {
     return {
         budget: data.budget,
         totalInc: data.totals.inc,
         totalExp: data.totals.exp,
         percentage: data.percentage
     };
 },
 deleteItem: function(type, id) {
     var ids, index;
     
     // id = 6
     //data.allItems[type][id];
     // ids = [1 2 4  8]
     //index = 3
     
     ids = data.allItems[type].map(function(current) {
         return current.id;
     });

     index = ids.indexOf(id);

     if (index !== -1) {
         data.allItems[type].splice(index, 1);
     }
     
 },

     }

})()



var userInterface = (function () {

     domStrings = {

          inputType: '.add__type',
          inputDescription: '.add__description',
          inputValue: '.add__value',
          inputBtn: '.add__btn',
          incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'


     }



     return {
          getInput: function () {
               return {
                    type: document.querySelector(domStrings.inputType).value,
                    description: document.querySelector(domStrings.inputDescription).value,
                    value: parseFloat(document.querySelector(domStrings.inputValue).value)
               }

          },
          getDom: function () {
               return domStrings


          },
          addListItem:function(obj,type){
               var html, newHtml, element;
               //Create Html
               if(type==='inc'){
                    element = domStrings.incomeContainer;
                    html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

               }
               else if(type==='exp'){
                    element = domStrings.expensesContainer;
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

               }
               // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);



          },
          clearFields: function() {
               var fields, fieldsArr;
               
               fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);
               
               fieldsArr = Array.prototype.slice.call(fields);
               
               fieldsArr.forEach(function(current, index, array) {
                   current.value = "";
               });
               
               fieldsArr[0].focus();
           },
           displayBudget: function(obj) {
               var type;
               obj.budget > 0 ? type = 'inc' : type = 'exp';
               
               document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
               document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
               document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
               
               if (obj.percentage > 0) {
                   document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
               } else {
                   document.querySelector(domStrings.percentageLabel).textContent = '---';
               }
               
           },




     }


})()


var Controller = (function (bgCtrl, user) {

     let addEventListenerFunc = function () {

          let dom = user.getDom()


          var addBtn = document.querySelector(dom.inputBtn)
          addBtn.addEventListener('click', addFunc)


          document.addEventListener('keypress', function (event) {
               if (event.keyCode === 13 || event.which === 13) {
                    addFunc()

               }


          })
document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);




     }
     let updateBudget=function(){
 // 1. Calculate the budget
 bgCtrl.calculateBudget();
        
 // 2. Return the budget
 var budget = bgCtrl.getBudget();

 // 3. Display the budget on the UI
 user.displayBudget(budget);

     }


     let addFunc = function () {
          let input = user.getInput()
          if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
               // 2. Add the item to the budget controller
               newItem = bgCtrl.addItems(input.type, input.description, input.value);
   
               // 3. Add the item to the UI
               user.addListItem(newItem, input.type);
   
               // 4. Clear the fields
               user.clearFields();
   
               // 5. Calculate and update budget
               updateBudget();
               
               // 6. Calculate and update percentages
               
           }

     }

     var ctrlDeleteItem = function(event) {
          var itemID, splitID, type, ID;
          
          itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
          
          if (itemID) {
              
              //inc-1
              splitID = itemID.split('-');
              type = splitID[0];
              ID = parseInt(splitID[1]);
              
              // 1. delete the item from the data structure
              bgCtrl.deleteItem(type, ID);
              
              // 2. Delete the item from the UI
              user.deleteListItem(itemID);
              
              // 3. Update and show the new budget
              updateBudget();
              
              // 4. Calculate and update percentages
              updatePercentages();
          }
      };

     return {
          init: function () {

               console.log('Application has started.');
            user.displayMonth();
            user.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
                addEventListenerFunc()

          }

     }


})(budgetController, userInterface)

Controller.init()