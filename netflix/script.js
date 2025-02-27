function scrollLeft() {
    const row = document.getElementById('movieRow');
    row.scrollBy({ left: -300, behavior: 'smooth' });
}

function scrollRight() {
    const row = document.getElementById('movieRow');
    row.scrollBy({ left: 300, behavior: 'smooth' });
}