//Вариабельная сна
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let isProcessing = false;
			
//Функция высчета яркости
const getLuma = (hex) => {
	let r = parseInt(hex.substring(1, 3), 16);
	let g = parseInt(hex.substring(3, 5), 16);
	let b = parseInt(hex.substring(5, 7), 16);
	return (r * 0.299) + (g * 0.587) + (b * 0.114);
};
			
let box = document.getElementById('wrapper');
let hexSymbols = "0123456789ABCDEF";
			
//Функция создания баннеров
async function createColorBlocks(){
				
	if (isProcessing) return;
	isProcessing = true;
	// Сбор старых баннеров
	const oldBlocks = document.querySelectorAll('.color-card');
				
	let lockedColors = [];
	let randomColors = [];
				
	//Генерация цветов
	for (let i = 0; i < 5; i++) {
		let hexColor;
					
		//Заблокированные баннеры
		if (oldBlocks[i] && oldBlocks[i].classList.contains('locked')) {
			lockedColors.push(oldBlocks[i].querySelector('p').innerText);
		} else { //Новая генерация
			hexColor = "#";
			for (let j = 0; j < 6; j++) {
				hexColor += hexSymbols[Math.floor(Math.random() * 16)];
			}
			randomColors.push(hexColor);
		}
	}
				
	//Сортировка по яркости
	lockedColors.sort((a, b) => getLuma(a) - getLuma(b));
	randomColors.sort((a, b) => getLuma(a) - getLuma(b));
				
	let finalPalette = [...lockedColors, ...randomColors];
	//Очистка
	box.innerHTML = "";
				
	//Отрисовка
	for (let sortedColor of finalPalette) {
		let newBlock = document.createElement('div');
		newBlock.classList.add('color-card');
		newBlock.style.backgroundColor = sortedColor;
					
		if (lockedColors.includes(sortedColor)) newBlock.classList.add('locked');
					
		let hexText = document.createElement('p');
		hexText.innerText = sortedColor;
		hexText.style.color = getLuma(sortedColor) < 128 ? 'white' : 'black';
		newBlock.appendChild(hexText);
					
		newBlock.onclick = () => {
			navigator.clipboard.writeText(sortedColor);
			newBlock.classList.toggle('locked');
		}
		box.appendChild(newBlock);
	}
	isProcessing = false;
}
createColorBlocks();
window.onkeydown = async (event) => {
	if (event.code === 'Space') {
		if (isProcessing) return;
		isProcessing = true;
		await createColorBlocks();
		isProcessing = false;
	}
};
function resetPalette() {
	box.innerHTML = "";
	createColorBlocks();
}
function copyAll() {
	const allHex = Array.from(document.querySelectorAll('.color-card p')).map(p => p.innerText).join(', ');
	navigator.clipboard.writeText(allHex);
	console.log("Вся палитра скопирована: " + allHex);
}
