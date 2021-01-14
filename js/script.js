// Variables
const buttons = Array.from(document.querySelectorAll('.btn'));
const resultSection = document.querySelector('.list');

// Event listeners
buttons.map(item => item.addEventListener('click', e => whichFilter(e.target.id)));

// Functions
// Show-remove data
const showData = (data, ...fieldList) => {
    const listItem = Array.from(document.getElementsByTagName('li'));
    if (listItem.length != 0){
        listItem.map(item => resultSection.removeChild(item));
    }
    data.map(item => {
        let newCard = document.createElement('div');
        newCard.setAttribute('class', 'btn');
        fieldList.map(elem => {
            const field = elem.split('.');
            if (field.length != 1){
                addText = `${field[0]} ${field[1]}: ${item[field[0]][field[1]]}`;
            }
            else{
                switch (field[0]){
                    case 'photo':
                        addText = document.createElement('img');
                        addText.setAttribute('src', item.photo);
                        break;
                    case 'sign':
                        addText = whichSign(item.birthday.mdy);
                        break;
                    case 'button':
                        newCard.classList.add('pointer');
                        newCard.addEventListener('click', () => newCard.querySelectorAll('p')[1].innerHTML= averageAge(item.land));
                        addText='';
                        break;
                    case 'match':
                        newCard.classList.remove('pointer');
                        const btn = newCard.querySelectorAll('p')[newCard.querySelectorAll('p').length-1];
                        btn.innerHTML = 'Vind matches'
                        btn.classList.add('btn', 'pointer');
                        btn.addEventListener('click', () => greatMatch(item.birthday.mdy, item.surname));
                        addText='';
                        break;
                    default: addText = `${elem}: ${item[elem]}`;
                };
            }
            const para = document.createElement('p');
            para.append(addText);
            newCard.appendChild(para);
        });
        const listItem = document.createElement('li');
        listItem.append(newCard);
        resultSection.appendChild(listItem);
    });
};

// Filter
const whichFilter = (id) => {
    switch(id){
        case '1': showData(lands(), 'land'); break;
        case '2': showData(capricornWomen(), 'name', 'surname', 'birthday.mdy', 'photo'); break;
        case '3': showData(oldCard(), 'name', 'surname', 'phone', 'credit_card.number', 'credit_card.expiration'); break;
        case '4': showData(peopleOfLands(), 'land', 'persons'); break;
        case '5': showData(lands(), 'land', 'button'); break;
        default: showData(randomPersonData, 'name', 'surname', 'photo', 'region', 'age', 'sign', 'button', 'match');
    };
};

// Lands
const lands = () => {
    const filteredData = [...new Set(randomPersonData.map(item => item.region))].sort()
        .map(item => {return {land: item}});
    return filteredData;
};

// steenbokvrouwen
const capricornWomen = () => {
    const filteredData = randomPersonData.filter(item => {
            const bday = item.birthday.mdy.substr(0,5);
            const onlyCapri = astroSigns.filter(elem => elem.name == 'Steenbok'); 
            return item.gender == 'female' && item.age > 30 && onlyCapri.some(elem => bday >= elem.start && bday <= elem.end);
    });
    return filteredData;
};

// ouwe creditcard
const oldCard = () => {
    const filteredData = randomPersonData.filter(
        item => item.credit_card.expiration.substr(-2) == (new Date().getFullYear()+1).toString().substr(2))
        .sort((current, next) => {
            const currentElem = parseInt(current.credit_card.expiration.split('/')[0]);
            const nextElem = parseInt(next.credit_card.expiration.split('/')[0]);
            if (currentElem > nextElem){
                return currentElem - nextElem;
            };
        }
    );
    return filteredData;
};

// meeste mensen
const peopleOfLands = () => { 
    const filteredData = lands().map(item => {return {land: item.land, persons: randomPersonData.filter(elem => elem.region == item.land).length}})
        .sort((current, next) => {return current.persons - next.persons}).reverse();
    return filteredData;
};

// gemiddelde leeftijd
const averageAge = (country) => {
    return `De gemiddelde persoon in ${country} is ${Math.round(randomPersonData.filter(item => item.region == country).reduce((age, elem) => {return age += elem.age}, 0) / randomPersonData.filter(item => item.region == country).length)} oud`;
};

// matchmaking
const greatMatch = (bday, surname) => {
    const newPersonData = Array.from(randomPersonData);
    const filteredPerson = newPersonData.splice(randomPersonData.findIndex(item => item.birthday.mdy == bday && item.surname == surname),1);
    const filteredOthers = newPersonData.filter(item => whichSign(item.birthday.mdy) == whichSign(bday));
    const filteredData = filteredPerson.concat(filteredOthers);
    showData(filteredData, 'name', 'surname', 'photo', 'region', 'age', 'sign');
};

// Which horoscope belongs to the person
const whichSign = (bday) => {
    const filteredData = astroSigns.filter(elem => bday.substr(0,5) >= elem.start && bday.substr(0,5) <= elem.end);
    return filteredData[0].name;
};