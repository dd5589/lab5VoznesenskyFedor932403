const GALLERY_KEY = 'portfolio_gallery_photos';
const THEME_KEY = 'portfolio_theme';
const VIS_KEY = 'portfolio_gallery_visible';
const galleryEl = document.getElementById('gallery');
const addPhotoBtn = document.getElementById('add-photo-btn');
const toggleGalleryBtn = document.getElementById('toggle-gallery-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const emptyGalleryMsg = document.getElementById('empty-gallery-msg');

function initGallery() {
    if (!checkGalleryElements()) return;
    loadGalleryState();
    updateEmptyMessage();
    updateThemeButton();
    updateGalleryVisibility();
    renderGallery();
    addPhotoBtn.addEventListener('click', addGalleryPhoto);
    console.log('✅ initGallery запущена');
    toggleGalleryBtn.addEventListener('click', () => {
        galleryVisible = !galleryVisible;
        try {
            localStorage.setItem(VIS_KEY, String(galleryVisible));
        } catch (e) {
            console.warn('Ошибка сохранения видимости:', e);
        }
        updateGalleryVisibility();
    });
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        try {
            localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
        } catch (e) {
            console.warn('Ошибка сохранения темы:', e);
        }
        updateThemeButton();
    });
    console.log('✅ initGallery запущена');
}

let galleryPhotos  = [];
let galleryVisible = true;

function checkGalleryElements() {
    const missing = [];
    if (!galleryEl) missing.push('#gallery');
    if (!addPhotoBtn) missing.push('#add-photo-btn');
    if (!toggleGalleryBtn) missing.push('#toggle-gallery-btn');
    if (!themeToggleBtn) missing.push('#theme-toggle');
    if (!emptyGalleryMsg) missing.push('#empty-gallery-msg');
    if (missing.length) {
        console.error('Не найдены элементы:', missing.join(', '));
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', initGallery);

function savePhotos() {
    try {
        localStorage.setItem(GALLERY_KEY, JSON.stringify(galleryPhotos));
    } catch (e) {
        console.warn('Ошибка сохранения фото:', e);
    }
}

function loadGalleryState() {
    try {
        const raw = localStorage.getItem(GALLERY_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) galleryPhotos = parsed;
        }
    } catch (e) {
        console.warn('Ошибка чтения фото:', e);
        galleryPhotos = [];
    }

    try {
        if (localStorage.getItem(THEME_KEY) === 'dark') {
            document.body.classList.add('dark-theme');
        }
    } catch (e) {
        console.warn('Ошибка чтения темы:', e);
    }

    try {
        if (localStorage.getItem(VIS_KEY) === 'false') {
            galleryVisible = false;
        }
    } catch (e) {
        console.warn('Ошибка чтения видимости:', e);
    }
}

function updateEmptyMessage() {
    if (!emptyGalleryMsg) return;
    if (galleryPhotos.length === 0 && galleryVisible) {
        emptyGalleryMsg.classList.remove('hidden');
    } else {
        emptyGalleryMsg.classList.add('hidden');
    }
}

function updateThemeButton() {
    if (!themeToggleBtn) return;
    const isDark = document.body.classList.contains('dark-theme');
    themeToggleBtn.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
}

function updateGalleryVisibility() {
    if (!galleryEl) return;
    if (galleryVisible) {
        galleryEl.classList.remove('hidden');
        if (toggleGalleryBtn) toggleGalleryBtn.textContent = 'Скрыть галерею';
    } else {
        galleryEl.classList.add('hidden');
        if (toggleGalleryBtn) toggleGalleryBtn.textContent = 'Показать галерею';
    }
    updateEmptyMessage();
}

function createGalleryItem(photo) {
    const figure = document.createElement('figure');
    figure.className = 'gallery-item';
    figure.dataset.id = photo.id;

    const thumb = document.createElement('div');
    thumb.className = 'gallery-thumb';

    if (photo.url) {
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.caption || 'Фото';
        img.loading = 'lazy';
        img.addEventListener('error', () => {
            img.remove();
            thumb.textContent = '🖼️';
        });
        thumb.appendChild(img);
    } else {
        thumb.textContent = '🖼️';
    }

    const figcaption = document.createElement('figcaption');
    const captionText = document.createElement('span');
    captionText.className = 'caption-text';
    captionText.textContent = photo.caption || 'Без подписи';
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.title = 'Удалить фото';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeGalleryPhoto(photo.id);
    });

    figcaption.appendChild(captionText);
    figcaption.appendChild(deleteBtn);
    figure.appendChild(thumb);
    figure.appendChild(figcaption);
    return figure;
}

function renderGallery() {
    if (!galleryEl) return;
    galleryEl.innerHTML = '';
    galleryPhotos.forEach(p => galleryEl.appendChild(createGalleryItem(p)));
    updateEmptyMessage();
    updateGalleryVisibility();

    const captions = document.querySelectorAll('#gallery figcaption');
    console.log('Подписей в галерее:', captions.length);
}

function addGalleryPhoto() {
    let url = prompt('URL изображения (пусто — заглушка):', '');
    if (url === null) return;
    url = url.trim();

    let caption = prompt('Подпись к фото:', 'Новый кадр');
    if (caption === null) return;
    caption = caption.trim() || 'Без подписи';

    if (url) {
        try {
            new URL(url);
        } catch (e) {
            alert('⚠️ Некорректный URL. Будет заглушка.');
            url = '';
        }
    }

    const newPhoto = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        url,
        caption
    };

    galleryPhotos.push(newPhoto);
    savePhotos();
    renderGallery();

    const added = galleryEl.querySelector(`[data-id="${newPhoto.id}"]`);
    if (added) added.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function removeGalleryPhoto(id) {
    const idx = galleryPhotos.findIndex(p => p.id === id);
    if (idx === -1) {
        console.warn('Фото не найдено:', id);
        return;
    }
    galleryPhotos.splice(idx, 1);
    savePhotos();
    renderGallery();
}

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
