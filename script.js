const username = prompt("Как вас зовут?");
if (username) {
  alert("Привет, " + username + "!" + " Посмотри статистику фото!");
} else {
  alert("Привет, аноним!");
}

const photos = [120, 200, 170, 420, 50, 220];
console.log("Весь массив ", photos);
console.log("Длина массива ", photos.length);

function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function findMax(arr) {
  if (arr.length === 0) return undefined;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

function filterHighActiv(arr, threshold) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > threshold) {
      result.push(arr[i]);
    }
  }
  return result;
}

function getLowActiv(arr, threshold) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= threshold) {
      result.push(arr[i]);
    }
  }
  return result;
}

function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  return sumArray(arr) / arr.length;
}

const total = sumArray(photos);
const maxPhotos = findMax(photos);
const avgPhotos = calculateAverage(photos);
const highDays = filterHighActiv(photos, 200);
const lowDays = getLowActiv(photos, 50);
const percent = (lowDays.length / photos.length) * 100;

console.log("Общая сумма фото:", total);
console.log("Максимум фото за день:", maxPhotos);
console.log("Среднее количество фото за день:", avgPhotos.toFixed(1));
console.log("Дни с высокой активностью (>200):", highDays);
console.log("Дни с низкой активностью (<=50):", lowDays);
console.log("Количество дней с малой активностью: " + lowDays.length);
console.log("Процент дней с малой активностью: " + percent.toFixed(1) + "%");

alert("Всего сделано " + total + " фото, в " + highDays.length + " днях активность была высокой.");

if (maxPhotos > 300) {
  console.log("В этот день вы были особенно продуктивны!");
}
