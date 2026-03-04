(function () {
    // Cria o elemento do cursor se ele não existir
    let cursor = document.getElementById('custom-cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);
    }

    // Atualiza a posição do cursor
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Esconde o cursor quando sai da janela
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });

    // Reexibe quando entra
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });
})();
