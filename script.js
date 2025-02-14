function openTab(tabName) {
    // Oculta todos los contenidos de las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Muestra solo el contenido de la pestaña seleccionada
    document.getElementById(tabName).classList.remove('hidden');

    // Resalta la pestaña activa
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('bg-blue-500', 'text-white');
        button.classList.add('text-gray-700', 'hover:bg-gray-50');
    });

    // Aplica estilos a la pestaña activa
    document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add('bg-blue-500', 'text-white');
    document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.remove('text-gray-700', 'hover:bg-gray-50');
}

// Inicializa la primera pestaña como activa
document.addEventListener('DOMContentLoaded', () => {
    openTab('encrypt');
});

function encryptFile() {
    const fileInput = document.getElementById('encrypt-file');
    const password = document.getElementById('encrypt-password').value;

    if (fileInput.files.length === 0 || !password) {
        alert('Por favor, selecciona un archivo y introduce una contraseña.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const fileData = event.target.result;
        const encrypted = CryptoJS.AES.encrypt(fileData, password).toString();
        const blob = new Blob([encrypted], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = file.name + '.enc';
        a.click();
        URL.revokeObjectURL(url);
    };

    reader.readAsText(file);
}

function decryptFile() {
    const fileInput = document.getElementById('decrypt-file');
    const password = document.getElementById('decrypt-password').value;

    if (fileInput.files.length === 0 || !password) {
        alert('Por favor, selecciona un archivo cifrado y introduce la contraseña.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const encryptedData = event.target.result;
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, password).toString(CryptoJS.enc.Utf8);
            if (!decrypted) {
                throw new Error('Contraseña incorrecta o archivo corrupto.');
            }
            const blob = new Blob([decrypted], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = file.name.replace('.enc', '');
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            alert(error.message);
        }
    };

    reader.readAsText(file);
}