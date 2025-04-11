let currentPage = 0;
const pages = document.querySelectorAll('.page');

export function goToNext() {

  if (currentPage < pages.length) {
    pages[currentPage].classList.add('flipped');
    currentPage++;
  }

}

export function goToPrevious() {

  if (currentPage > 0) {
    currentPage--;
    pages[currentPage].classList.remove('flipped');
  }

}
