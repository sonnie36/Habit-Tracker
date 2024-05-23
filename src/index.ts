const add = document.querySelector('.addBtn') as HTMLButtonElement;
const details = document.querySelector('.details') as HTMLDivElement;
const cards = document.querySelector('.cardDisplay') as HTMLDivElement;

add.addEventListener('click', () => {
   while(details.firstChild) {
      details.removeChild(details.firstChild);
   }
  console.log('clicked');
  
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Name of habit';
  nameLabel.classList.add('label');
  
  const inputName = document.createElement('input');
  inputName.type = 'text';
  inputName.placeholder = 'Habit name';

  const DateLabel = document.createElement('label');
  DateLabel.textContent = 'Start date';
  DateLabel.classList.add('label');
  
  const inputDate = document.createElement('input');
  inputDate.type = 'date';
  inputDate.placeholder = 'Start date';

  const Submit = document.createElement('button');
   Submit.textContent = 'Submit';
   Submit.classList.add('submitBtn');

   Submit.addEventListener('click',()=>{
      const habitName = inputName.value;
      const startDate = inputDate.value;

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
   })

  details.appendChild(nameLabel);
  details.appendChild(inputName);
  details.appendChild(DateLabel);
  details.appendChild(inputDate);
  details.appendChild(Submit);

//   displayCards();

});

interface Habit {
   name: string;
   startDate: string;
}

// ...

const displayCards = () => {
  fetch('http://localhost:3000/habits', {
      method: 'GET'
  })
  .then(response => response.json())
  .then((data: Habit[]) => {  // Specify that data is an array of Habit objects
      console.log(data);
      data.forEach(
       (habit: Habit) => {  // Specify that habit is a Habit object
        const card = document.createElement('div');
        card.classList.add('card');

        const habitName = document.createElement('h3');
        habitName.textContent = habit.name;

        const startDate = document.createElement('p');
        startDate.textContent = habit.startDate;

        card.appendChild(habitName);
        card.appendChild(startDate);

        cards.appendChild(card);
       }
      );
  })
  .catch(error => {
      console.error('Error:', error);
  });
}
displayCards();