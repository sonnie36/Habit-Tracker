interface Habit {
   id: string;
   name: string;
   startDate: string;
}

class HabitTracker {
   private add: HTMLButtonElement;
   private details: HTMLDivElement;
   private cards: HTMLDivElement;

   constructor() {
       this.add = document.querySelector('.addBtn') as HTMLButtonElement;
       this.details = document.querySelector('.details') as HTMLDivElement;
       this.cards = document.querySelector('.cardDisplay') as HTMLDivElement;

       this.add.addEventListener('click', () => this.addHabit());
       this.displayCards();
   }

   private addHabit(): void {
       while (this.details.firstChild) {
           this.details.removeChild(this.details.firstChild);
       }

       const nameLabel = this.createLabel('Name of habit');
       const inputName = this.createInput('text', 'Habit name');
       const dateLabel = this.createLabel('Start date');
       const inputDate = this.createInput('date', 'Start date');

       const submit = document.createElement('button');
       submit.textContent = 'Submit';
       submit.classList.add('submitBtn');
       submit.addEventListener('click', () => this.submitHabit(inputName, inputDate));

       
      const cancel = document.createElement('button');
      cancel.textContent = 'Cancel';
      cancel.classList.add('cancelBtn');
      cancel.addEventListener('click', () => this.cancelForm());

this.details.appendChild(cancel); // Append the cancel button to the form

       this.details.appendChild(nameLabel);
       this.details.appendChild(inputName);
       this.details.appendChild(dateLabel);
       this.details.appendChild(inputDate);
       this.details.appendChild(submit);
       this.details.appendChild(cancel); // Append the cancel button to the form
   }

   private createLabel(text: string): HTMLLabelElement {
       const label = document.createElement('label');
       label.textContent = text;
       label.classList.add('label');
       return label;
   }

   private createInput(type: string, placeholder: string): HTMLInputElement {
       const input = document.createElement('input');
       input.type = type;
       input.placeholder = placeholder;
       return input;
   }

   private submitHabit(inputName: HTMLInputElement, inputDate: HTMLInputElement): void {
       const habitName = inputName.value;
       const startDate = inputDate.value;

      if (!habitName || !startDate) {
         const errorMsg = document.createElement('p');
         errorMsg.textContent = 'Both habit name and start date must be provided';
         errorMsg.style.color = 'white';
         this.details.appendChild(errorMsg);
         return;
     }

       let data = {
           name: habitName,
           startDate: startDate
       }

       fetch('http://localhost:3000/habits', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(data)
       }).then(response => response.json())
           .then(() => {
               inputName.value = '';
               inputDate.value = '';

               // Call displayCards after the new habit data has been sent to the server
               this.displayCards();
           });
   }

   private cancelForm(): void {
       while (this.details.firstChild) {
           this.details.removeChild(this.details.firstChild);
       }
   }

   private displayCards(): void {
       while (this.cards.firstChild) {
           this.cards.removeChild(this.cards.firstChild);
       }

       fetch('http://localhost:3000/habits', {
           method: 'GET'
       })
           .then(response => response.json())
           .then((data: Habit[]) => {
               data.forEach((habit: Habit) => this.createCard(habit));
           })
           .catch(error => {
               console.error('Error:', error);
           });
   }

   private createCard(habit: Habit): void {
       const card = document.createElement('div');
       card.classList.add('card');

       const habitName = document.createElement('h3');
       habitName.textContent = habit.name;

       const startDate = document.createElement('p');
       startDate.textContent = habit.startDate;

       const startDateDate = new Date(habit.startDate);
       const currentDate = new Date();
       const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
       const diffDays = Math.round(Math.abs((currentDate.getTime() - startDateDate.getTime()) / oneDay));

       const currentStreak = document.createElement('p');
       currentStreak.textContent = ` ${diffDays}`;
       currentStreak.classList.add('streak');

       const gold = document.createElement('div');
       gold.classList.add('gold');
       gold.appendChild(currentStreak);

       const fire = document.createElement('div');
       fire.innerHTML = `<ion-icon name="flame"></ion-icon>`;
       fire.classList.add('fire');

       gold.appendChild(fire);

       const deleteCard = document.createElement('button');
       deleteCard.textContent = 'Delete';
       deleteCard.classList.add('deleteBtn');
       deleteCard.addEventListener('click', () => {
           fetch(`http://localhost:3000/habits/${habit.id}`, {
               method: 'DELETE'
           }).then(() => {
               this.displayCards();
           });
       });

       card.appendChild(habitName);
       card.appendChild(startDate);
       card.appendChild(gold);
       card.appendChild(deleteCard);

       this.cards.appendChild(card);
   }
}

new HabitTracker();